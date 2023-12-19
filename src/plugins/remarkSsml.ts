import { visit } from 'unist-util-visit';
import { Root } from 'mdast';
import { Element } from 'hast';
import { Plugin } from "unified"

export const rehypeAutoUniqueId:Plugin<void[], Root, Root> = function () {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      const startOffset = node.position?.start.offset;
      const endOffset = node.position?.end.offset;
      if(startOffset !== undefined && endOffset !== undefined){
        const uniqueId = `${node.tagName}_${startOffset}-${endOffset}`;
        node.properties.id = uniqueId;
      }
    });
  };
};