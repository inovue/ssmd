import type { Compiler, Processor, Transformer } from "unified"
import type { Element, Nodes } from 'xast';
import { toXast } from 'hast-util-to-xast'
import { toXml } from 'xast-util-to-xml'
import { visit } from 'unist-util-visit';
import type { Root } from 'hast'


// Transformers

export function hastToXast():Transformer<Root, Nodes> {
  return (tree) => {
    return toXast(tree);
  }
}

export function xastAddBookmark(): Transformer<Nodes, Nodes> {
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

export function xastRemoveUnsupportedTags():Transformer<Nodes, Nodes> {
  const unsupportedTags = ['input', 'pre', 'code', 'img'];
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if(parent && index !== undefined && unsupportedTags.includes(node.name)) {
        parent.children.splice(index, 1);
      }
    });
  }
}


export function xastReplaceTags():Transformer<Nodes, Nodes> {
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

export function xastStringify(this: Processor){
  const compiler:Compiler<Nodes, string> = (tree) => {
    return toXml(tree);
  }
  this.compiler = compiler;
}




/*
export function rehypeSsmlStringify(this: Processor, options = {}) {
  console.info(options)

  const compiler:Compiler = (root) => {
    
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
        if (parent && index !== undefined) {
          parent.children.splice(index, 0, markNode);
        }
      }
      
      // Remove unsupported tags
      if (index !== undefined && node.name !== 'mark'){
        node.attributes = {};
        
        if(['input', 'pre', 'code', 'img'].includes(node.name)) {
          // remove node
          if(parent){
            parent.children.splice(index, 1);
          }else{
            console.error('parent is undefined');
          }
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
*/