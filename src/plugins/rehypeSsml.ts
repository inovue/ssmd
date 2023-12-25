import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import { Plugin } from "unified";


export const rehypeSsml:Plugin<void[], Root, Root> = function () {
  const emphasisTagName = 'emphasis';
  return (tree) => {
    visit(tree, 'element', (element:Element, _, parent) => {
      const {heading} = element.tagName.match(/^h(?<heading>[1-6])$/)?.groups || {};
      if(heading){
        element.tagName = emphasisTagName;
        element.properties = {level: Math.abs(Number(heading)-7)};
      }else if(element.tagName === 'strong'){
        if(parent && (parent as Element).tagName === 'em'){
          element.tagName = emphasisTagName;
          element.properties = {level: 3};
        }else{
          element.tagName = emphasisTagName;
          element.properties = {level: 2};
        }
      }
    });

    visit(tree, {tagName:'em'}, (element:Element) => {
      element.tagName = emphasisTagName;
      element.properties = {level: 1};
    });
  };
};