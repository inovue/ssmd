export function isBlockTag(tag: string): boolean {
  const regex = /^(address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h[1-6]|header|hr|li|main|nav|noscript|ol|p|pre|section|table|tfoot|ul|video)$/;
  return regex.test(tag);
}

export function isInlineTag(tag: string): boolean {
  const regex = /^(a|abbr|acronym|b|bdi|bdo|big|br|cite|code|data|datalist|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|noscript|output|picture|progress|q|ruby|s|samp|script|select|small|span|strong|sub|sup|svg|template|textarea|time|tt|u|var|wbr)$/;
  return regex.test(tag);
}

export function isNeitherTag(tag: string): boolean {
  return !isBlockTag(tag) && !isInlineTag(tag);
}