import type { Compiler, Plugin, Processor } from "unified"
import type { Element, Root as XastRoot } from 'xast';
import { toXast } from 'hast-util-to-xast'
import { toXml } from 'xast-util-to-xml'
import { visit } from 'unist-util-visit';
import type { Root as HastRoot } from 'hast'
import { isBlockTag, isInlineTag } from "../utils/checkTagName.js";


// Transformers


export const hastToXast:Plugin<void[], HastRoot, XastRoot> = function() {
  return (tree) => {
    return toXast(tree) as XastRoot;
  }
}


export const xastAddBookmark:Plugin<void[], XastRoot, XastRoot> = function() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.name !== 'bookmark' && node.attributes.id) {
        const bookMarkNode: Element = {
          type: 'element',
          name: 'bookmark',
          attributes: { mark: node.attributes.id },
          children: []
        };
        if (parent && index !== undefined) {
          if (index === 0 || (index > 0 && (parent.children[index - 1] as Element).name !== 'bookmark')) {
            parent.children.splice(index, 0, bookMarkNode);
          }
        }
      }
    });
  }
}


export const xastRemoveUnsupportedTags:Plugin<void[], XastRoot, XastRoot> = function() {
  const unsupportedTags = ['input', 'pre', 'code', 'img'];
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if(parent && index !== undefined && unsupportedTags.includes(node.name)) {
        parent.children.splice(index, 1);
      }
    });
  }
}


export const xastReplaceTags:Plugin<void[], XastRoot, XastRoot> = function() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if(isBlockTag(node.name)){
        node.attributes = {};
        node.name = 'p';
      }else if(isInlineTag(node.name)){
        node.attributes = {};
        node.name = 's';
      }
    });
  }
}


// Compilers
export const xastStringify: Plugin = function(this:Processor) {
  const compiler:Compiler<XastRoot, string> = (tree) => {
    return toXml(tree);
  }
  Object.assign(this, { Compiler: compiler });
}
