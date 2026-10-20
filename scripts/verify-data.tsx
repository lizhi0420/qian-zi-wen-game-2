import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { UNITS_DATA, PERIODS_DATA } from '../src/data/qianziwenData';
import { getTone, generateToneVariants } from '../src/utils/pinyin.js';
import { HomeView } from '../src/components/HomeView';
import { HeaderNav } from '../src/components/HeaderNav';
import { LiteracyView } from '../src/components/LiteracyView';
import { ReadingHallView } from '../src/components/ReadingHallView';
import { sound } from '../src/utils/audio';

const source: {periods: {lines: {char:string;pinyin:string}[][]}[]} = JSON.parse(fs.readFileSync(new URL('../src/data/qianziwenSource.json',import.meta.url),'utf8'));
const sourcePairs = source.periods.flatMap(p=>p.lines.flat());
assert.equal(UNITS_DATA.length,125);
assert.equal(PERIODS_DATA.length,8);
assert.equal(new Set(UNITS_DATA.map(u=>u.illustration)).size,125);
const artworkHashes = new Set<string>();
for(const unit of UNITS_DATA) {
  assert.equal(unit.illustration,`/assets/lessons/lesson-${String(unit.id).padStart(3,'0')}.jpg`);
  assert(fs.existsSync(new URL(`../public${unit.illustration}`,import.meta.url)),`Missing lesson illustration: ${unit.id}`);
  const artworkBytes = fs.readFileSync(new URL(`../public${unit.illustration}`,import.meta.url));
  assert(artworkBytes.length > 10_000,`Invalid image: ${unit.id}`);
  assert.equal(artworkBytes[0],0xff);
  assert.equal(artworkBytes[1],0xd8);
  artworkHashes.add(createHash('sha256').update(artworkBytes).digest('hex'));
}
assert.equal(artworkHashes.size,125,'Each lesson must have a distinct image');
assert.deepEqual(UNITS_DATA.flatMap(u=>u.characters.map(({char,pinyin})=>({char,pinyin}))),sourcePairs);
for(const unit of UNITS_DATA) {
  assert.equal(unit.fullText,`${unit.characters.slice(0,4).map(c=>c.char).join('')}，${unit.characters.slice(4).map(c=>c.char).join('')}。`);
  for(const c of unit.characters) {
    assert.equal(c.toneNumber,getTone(c.pinyin));
    const options = generateToneVariants(c.pinyin);
    assert.equal(new Set(options).size,4);
    assert(options.includes(c.pinyin),`Missing correct option: ${c.char} ${c.pinyin}`);
    assert(!options.some(p=>/[ˊˇˋ]/.test(p)));
  }
}
assert.equal(getTone('shang'),0);
assert.deepEqual(generateToneVariants('liú'),['liū','liú','liǔ','liù']);
assert.deepEqual(generateToneVariants('lǜ'),['lǖ','lǘ','lǚ','lǜ']);
const noop=()=>{};
const home=renderToStaticMarkup(<HomeView onSelectTab={noop} currentUnit={UNITS_DATA[0]} stars={0} completedUnitsCount={0}/>);
const header=renderToStaticMarkup(<HeaderNav currentTab="HOME" onSelectTab={noop} stars={0} isMuted={false} onToggleMute={noop}/>);
assert(!/翻翻乐|绘本/.test(home+header));
for(const index of [0,16,112,124]) {
  const unit=UNITS_DATA[index];
  const literacy=renderToStaticMarkup(<LiteracyView currentUnit={unit} allUnits={UNITS_DATA} onSelectUnit={noop} onCharacterLearned={noop}/>);
  assert.equal((literacy.match(/<option /g)??[]).length,125);
  const reading=renderToStaticMarkup(<ReadingHallView currentUnit={unit} allUnits={UNITS_DATA} onSelectUnit={noop}/>);
  assert(literacy.includes(unit.illustration));
  assert(reading.includes(unit.illustration));
  for(const c of unit.characters) {assert(literacy.includes(c.pinyin));assert(reading.includes(c.pinyin));}
}
console.log('PASS: 8 periods / 125 units / all 1000 source pairs; all tone options; home/navigation feature removal; first/middle/last lesson rendering.');

// Simulate delayed browser cancellation events, which must not restart old reading.
class FakeUtterance {
  lang = ''; rate = 1; pitch = 1; voice: unknown;
  onend?: () => void;
  onerror?: (event: {error:string}) => void;
  constructor(public text: string) {}
}
const spoken: FakeUtterance[] = [];
const mandarin = {lang:'zh-CN'};
const synthesis = {
  cancel() {},
  getVoices: () => [{lang:'zh-HK'},mandarin],
  speak: (utterance:FakeUtterance) => spoken.push(utterance)
};
Object.defineProperty(globalThis,'window',{value:{speechSynthesis:synthesis},configurable:true});
Object.defineProperty(globalThis,'SpeechSynthesisUtterance',{value:FakeUtterance,configurable:true});
let oldEnds=0, newEnds=0;
sound.speak('天',()=>oldEnds++);
sound.speak('地',()=>newEnds++);
spoken[0].onerror?.({error:'canceled'});
spoken[0].onend?.();
assert.equal(oldEnds,0);
assert.equal(spoken[1].voice,mandarin);
spoken[1].onend?.(); spoken[1].onend?.();
assert.equal(newEnds,1);
sound.speak('玄',()=>oldEnds++);
sound.stopSpeech(); spoken[2].onend?.();
assert.equal(oldEnds,0);
sound.speak('黄',()=>oldEnds++);
sound.isMuted=true; spoken[3].onend?.();
assert.equal(oldEnds,0);
sound.speak('宇'); assert.equal(spoken.length,4);
sound.isMuted=false;
const literacySource=fs.readFileSync(new URL('../src/components/LiteracyView.tsx',import.meta.url),'utf8');
assert(!/sound\.speak\([^\n]*item\.pinyin/.test(literacySource));
delete (globalThis as {window?:unknown}).window;
delete (globalThis as {SpeechSynthesisUtterance?:unknown}).SpeechSynthesisUtterance;
console.log('PASS: direct character speech; Mandarin voice selection; rapid replay; stale callbacks; stop; mute.');
