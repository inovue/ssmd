import type { Compiler, Plugin, Processor } from "unified"
import type { Element, Root as XastRoot } from 'xast';
import { toXast } from 'hast-util-to-xast'
import { toXml } from 'xast-util-to-xml'
import { visit } from 'unist-util-visit';
import type { Root as HastRoot } from 'hast'


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
          children: [node]
        };
        if (parent && index !== undefined) {
          parent.children[index] = bookMarkNode;
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
      if(node.name !== 'bookmark'){
        node.attributes = {};
        node.name = (node.name.startsWith('h') || node.name === 'p') ? 'p' : 's';
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
