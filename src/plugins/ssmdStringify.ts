import type { Compiler, Plugin, Processor } from "unified"
import type { Root as XastRoot } from 'xast';
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


// Compilers
export const xastStringify: Plugin = function(this:Processor) {
  const compiler:Compiler<XastRoot, string> = (tree) => {
    return toXml(tree);
  }
  Object.assign(this, { Compiler: compiler });
}
