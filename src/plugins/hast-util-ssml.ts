import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import { Plugin } from "unified";
import { isBlockTag, isInlineTag } from "../utils/checkHtmlTags.js";

export const transformSsmlFromHast:Plugin<void[], Root, Root> = function () {
  return (tree) => {
    
    const emphasisTagName = 'emphasis';

    // replace heading tags to <emphasis level="n">
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

    // replace <em> to <emphasis>
    visit(tree, {tagName:'em'}, (element:Element) => {
      element.tagName = emphasisTagName;
      element.properties = {level: 1};
    });


    // replace other elements to <p> and <s>
    visit(tree, 'element', (node) => {
      if(isBlockTag(node.tagName)){
        node.properties = {};
        node.tagName = 'p';
      }else if(isInlineTag(node.tagName)){
        node.properties = {};
        node.tagName = 's';
      }
    });

  };
};

export default transformSsmlFromHast;