import { Compiler, Processor } from "unified"
import type { Element } from 'xast';
import {toXast} from 'hast-util-to-xast'
import {toXml} from 'xast-util-to-xml'
import { visit } from 'unist-util-visit';
import { remove } from 'unist-util-remove';

import type { Root } from 'hast'


export function rehypeSsmlStringify(this: Processor, options = {}) {
  console.info(options)

  const compiler:Compiler = (root) => {
    console.info(root)
    
    const xast = toXast(root as Root)
    
    visit(xast, 'element', (node, index, parent) => {
      
      // Add <mark name={id} /> before nodes with id
      if (node.attributes.id) {
        const markNode: Element = {
          type: 'element',
          name: 'mark',
          attributes: { name: node.attributes.id },
          children: []
        };
        node.attributes.id = undefined;
        node.children.unshift(markNode);
      }
      
      // Remove unsupported tags
      if (index !== undefined && node.name !== 'mark'){
        if(['input', 'pre', 'code', 'img'].includes(node.name)) {
          // remove(node);
        }else if (node.name.startsWith('h')) {
          node.name = 'p';
        }else {
          node.name = 's';
        }
      }
    });
    
    const xml = toXml(xast);
    return xml;
  }
  
  this.compiler = compiler;
}