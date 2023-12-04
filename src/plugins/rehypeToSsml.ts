import { Root } from 'hast';
import type { Element } from 'xast';
import {toXast} from 'hast-util-to-xast'
import {toXml} from 'xast-util-to-xml'
import { visit } from 'unist-util-visit';
import { remove } from 'unist-util-remove';

export function rehypeToSsml() {
  return (tree: Root) => {
    // Turn hast to xast:
    const xast = toXast(tree)

    // Traverse the xast tree and modify nodes:
    visit(xast, 'element', (node, index, parent) => {
      // Add <mark name={id} /> before nodes with id
      if (node.attributes.id) {
        const markNode: Element = {
          type: 'element',
          name: 'mark',
          attributes: { name: node.attributes.id },
          children: []
        };
        node.children.unshift(markNode);
      }
      
      // Remove unsupported tags
      if (index !== undefined && node.type === 'element' && ['input', 'pre', 'code', 'img'].includes(node.name)) {
        remove(node);
      }else if (node.name.startsWith('h')) {
        node.name = 'p';
      }else {
        node.name = 's';
      }
    });
    
    const xml = toXml(xast);
    console.log(xml);
    return xml;
  };
}