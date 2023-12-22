import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import { Plugin } from "unified";


export const rehypeSsml:Plugin<void[], Root, Root> = function () {
  return (tree) => {
    visit(tree, 'element', (element:Element) => {
      if(/^(em|strong|h[1-6]|)$/.test(element.type)){
        if(element.tagName === 'strong'){
          element.data
          element.tagName = 'emphasis';
        
      }
    });
  };
};