import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getTone } from '../src/utils/pinyin.js';

const dataDir = new URL('../src/data/', import.meta.url);
const source = JSON.parse(fs.readFileSync(new URL('qianziwenSource.json', dataDir), 'utf8'));
const details = JSON.parse(fs.readFileSync(new URL('qianziwenDetails.json', dataDir), 'utf8'));
const meaningsMap = JSON.parse(fs.readFileSync(new URL('qianziwenMeanings.json', dataDir), 'utf8'));
const landmarks = ['竹林书院','桃花溪谷','青山古亭','皇极宫阙','将相台榭','烟雨田园','向学雅筑','千字大成阁'];
const periods = [];
const units = [];
for (const [periodIndex, period] of source.periods.entries()) {
  const periodNumber = periodIndex + 1;
  const startUnit = units.length + 1;
  for (const pairs of period.lines) {
    if (pairs.length !== 8 || pairs.some(c => !c.char || !c.pinyin)) throw new Error('Invalid character-pinyin data');
    const id = units.length + 1;
    const original = details.find(u => u.id === id);
    const phrase1 = pairs.slice(0,4).map(c=>c.char).join('');
    const phrase2 = pairs.slice(4).map(c=>c.char).join('');
    const pinyin1 = pairs.slice(0,4).map(c=>c.pinyin).join(' ');
    const pinyin2 = pairs.slice(4).map(c=>c.pinyin).join(' ');
    const fullText = `${phrase1}，${phrase2}。`;
    const meaningEntry = meaningsMap[id] || {};
    const meaning1 = meaningEntry.meaning1 || `${phrase1}的古训意蕴。`;
    const meaning2 = meaningEntry.meaning2 || `${phrase2}的深远含义。`;
    const meaning = meaningEntry.meaning || original?.meaning || `${meaning1} ${meaning2}`;
    units.push({
      ...original, id, unitNumber:id, periodNumber, periodTitle:period.title,
      title:original?.title ?? `${phrase1} · ${phrase2}`, subtitle:`第${periodNumber}期 · ${period.title}`,
      phrase1,phrase2,pinyin1,pinyin2,fullText,fullPinyin:`${pinyin1}，${pinyin2}。`,
      meaning,
      meaning1,
      meaning2,
      illustration:`/assets/lessons/lesson-${String(id).padStart(3,'0')}.jpg`,
      locationName:landmarks[periodIndex],
      characters:pairs.map((c,i)=>({
        ...(original?.characters[i] ?? {}), id:`${id}-${i+1}`, ...c, toneNumber:getTone(c.pinyin),
        meaning:original?.characters[i]?.meaning ?? `“${c.char}”在本句中读作 ${c.pinyin}。`,
        words:original?.characters[i]?.words ?? [], example:original?.characters[i]?.example ?? fullText,
        hotspotLabel:original?.characters[i]?.hotspotLabel ?? c.char,
        hotspotX:original?.characters[i]?.hotspotX ?? 15+(i%4)*23,
        hotspotY:original?.characters[i]?.hotspotY ?? 25+Math.floor(i/4)*45
      }))
    });
  }
  periods.push({periodNumber,title:period.title,subtitle:period.title,startUnit,endUnit:units.length,unitCount:period.lines.length,landmark:landmarks[periodIndex],theme:period.title});
}
if (units.length !== 125 || units.reduce((n,u)=>n+u.characters.length,0) !== 1000) throw new Error('Incomplete source data');
const output = `// 从《千字文精注本.docx》提取；运行 npm run generate:data 重新生成。\nimport type { QianziwenUnit, QianziwenPeriod } from '../types/qianziwen';\n\nexport const PERIODS_DATA: QianziwenPeriod[] = ${JSON.stringify(periods,null,2)};\n\nexport const UNITS_DATA: QianziwenUnit[] = ${JSON.stringify(units,null,2)};\n\nexport const ALL_UNITS_INDEX = UNITS_DATA.map(u => ({id:u.id,phrase:u.fullText.replace(/。$/, ''),title:u.title}));\n`;
fs.writeFileSync(new URL('qianziwenData.ts',dataDir),output);
console.log(`Generated ${units.length} units, 1000 character-pinyin pairs, ${periods.length} periods: ${fileURLToPath(dataDir)}`);
