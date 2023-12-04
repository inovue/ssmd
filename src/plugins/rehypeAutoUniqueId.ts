import { visit } from 'unist-util-visit';
import { Root } from 'hast';
import { Element } from 'hast';


export function rehypeAutoUniqueId(){
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const startOffset = node.position?.start.offset;
      const endOffset = node.position?.end.offset;
      if(startOffset &&  endOffset){
        const uniqueId = `${node.tagName}_${startOffset}-${endOffset}`;
        node.properties.id = uniqueId;
      }
    });
  };
};