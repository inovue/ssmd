import { visit } from 'unist-util-visit';
import { Root, Element } from 'hast';
import { Plugin } from "unified"
import { isHtmlTag } from '../utils/checkHtmlTags.js';

export const setUniqueId: Plugin<void[], Root, Root> = function () {
  return (tree) => {
    visit(tree, 'element', (element, _, parent) => {
      if (isHtmlTag(element.tagName)) {
        element.properties.id = generateElementId(element);
        setBookmark(element, _, parent);
      }
    });
  };
};


export const generateElementId = (node: Element) => {
  const startOffset = node.position?.start.offset;
  const endOffset = node.position?.end.offset;
  if (startOffset === undefined || endOffset === undefined) return undefined;

  const id = `${node.tagName}_${startOffset}-${endOffset}`;
  return id;
}


export const setBookmark = (element: Element, index?: number, parent?: Root|Element) => {
  const bookmarkTagName = 'bookmark';
  if (element.tagName !== bookmarkTagName && element.properties.id) {
    const bookmarkElement: Element = {
      type: 'element',
      tagName: bookmarkTagName,
      properties: { mark: element.properties.id },
      children: []
    };
    if (parent && index !== undefined) {
      if (index === 0 || (index > 0 && (parent.children[index - 1] as Element).tagName !== bookmarkTagName)) {
        parent.children.splice(index, 0, bookmarkElement);
      }
    }
  }
}
