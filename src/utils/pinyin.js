const toneRows = ['aāáǎà','eēéěè','iīíǐì','oōóǒò','uūúǔù','üǖǘǚǜ'];

export function getTone(pinyin) {
  for (const row of toneRows) {
    for (let tone=1;tone<=4;tone++) if(pinyin.includes(row[tone])) return tone;
  }
  return 0;
}

export function generateToneVariants(pinyin) {
  let base = pinyin.normalize('NFC');
  for (const row of toneRows) for(const marked of row.slice(1)) base=base.replaceAll(marked,row[0]);
  let index = base.indexOf('a');
  if(index<0) index=base.indexOf('e');
  if(index<0 && base.includes('ou')) index=base.indexOf('o');
  if(index<0) for(let i=base.length-1;i>=0;i--) if('iouü'.includes(base[i])) {index=i;break;}
  if(index<0) return [pinyin];
  const row=toneRows.find(r=>r[0]===base[index]);
  const variants=[1,2,3,4].map(t=>base.slice(0,index)+row[t]+base.slice(index+1));
  return getTone(pinyin)===0 ? [base,...variants.slice(0,3)] : variants;
}
