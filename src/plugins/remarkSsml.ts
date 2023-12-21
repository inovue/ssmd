import { visit } from 'unist-util-visit';
import type { Root, Node } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective,ContainerDirectiveData, LeafDirectiveData } from 'mdast-util-directive';
import { Plugin } from "unified"
import {toString} from 'mdast-util-to-string'


export const asContainerDirective = (node:Node):ContainerDirective|null => {
  const directive = node.type === 'containerDirective' ? node as ContainerDirective : null;
  return directive?.name === 'voice' ? directive : null;
}
export const asLeafDirective = (node:Node):LeafDirective|null => {
  const directive = node.type === 'leafDirective' ? node as LeafDirective : null;
  return directive?.name === 'o' ? directive : null;
}
export const asTextDirective = (node:Node):TextDirective|null => {
  const directive =  node.type === 'textDirective' ? node as TextDirective : null;
  return directive?.name === 'o' ? directive : null;
}

export const getVoiceDirective = (directive:ContainerDirective ):ContainerDirectiveData|null => {
  if(directive.name === 'voice'){
    return {
      hName: directive.name,
      hProperties: {
        id: directive.attributes?.id
      }
    }
  }else{
    return null;
  }
}

export const getBreakDirectiveData = (innerText:string):LeafDirectiveData|null => {
  const defaultTime = 500;
  const {time} = innerText.match(/^\.{2}(?<time>(\d+\.?))$/)?.groups || {}
  if(time){ 
    return {
      hName: 'break',
      hProperties: {
        time: time === '.' ? defaultTime : Number(time)
      }
    }
  }else{
    return null;
  }
}


export const remarkSsml:Plugin<void[], Root, Root> = function () {
  return (tree) => {
    visit(tree, ['containerDirective', 'leafDirective', 'textDirective'], (node:Node) => {
      const containerDirective = asContainerDirective(node);
      const innerText = toString(node);
      if(containerDirective){
        const directiveData = getVoiceDirective(containerDirective)
        if(directiveData) containerDirective.data = directiveData;
        return;
      }
      const leafDirective = asLeafDirective(node);
      if(leafDirective){
        const directiveData = getBreakDirectiveData(innerText)
        if(directiveData) leafDirective.data = directiveData;
        return;
      }
      const textDirective = asTextDirective(node);
      if(textDirective){
        return;
      }
    });
  };
};