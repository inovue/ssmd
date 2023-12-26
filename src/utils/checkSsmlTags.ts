export function isSsmlUnsupportTag(tag: string): boolean {
  const regex = /^(input|pre|code|img)$/;
  return regex.test(tag);
}