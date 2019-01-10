//基础函数
const checkSingleTag = (tag) => tag && tag.match('area|base|col|command|embed|keygen|param|source|track|wbr|br|hr|img|input|link|meta|video') !== null;
const getTagFromHead = (tag) => {
  const match = tag.match(/<[^ <\/]* |<[^ <\/]*>/)
  return match && match[0].replace(/<|>| /g, '');
}
const getTagFromTail = (tag) => {
  const match = tag.match(/<\/[^<]*>/)
  return match && match[0].replace(/<\/|>/g, '');
}
const matchTags = (origin) => origin.match(/<[\/!-]{0,1}[^<]*[^-]>/g);
const splitText = (origin) => origin.split(/<[\/!-]{0,1}[^<]*[^-]>/g).map(item => item.replace(/\n|\t/g, ''));
const equel = fph.curry((a, b) => a === b);
const attr = (tag) => tag.replace(/<[^\s<>]*|>/g, '').replace(/^ | $/g, '').split(' ').map(item => ({ attr: item.split('=')[0], value: item.split('=')[1] }));


//复合函数
const singleTags = fph.compose(checkSingleTag, getTagFromHead);
const duoTag_Count0 = (current, tag) => (fph.compose(equel(current), getTagFromHead))(tag);
const closeTag = (current, tag) => (fph.compose(equel(current), getTagFromTail))(tag);