import { visit } from 'unist-util-visit';
import type { Root, Node } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';
import { Plugin } from "unified";

export type Directive = ContainerDirective | LeafDirective | TextDirective;

export const isContainerDirective = (node:Node):boolean => node.type === 'containerDirective';
export const isLeafDirective = (node:Node):boolean => node.type === 'leafDirective';
export const isTextDirective = (node:Node):boolean => node.type === 'textDirective';

export const setVoiceDirective = (directive:ContainerDirective) => {
  const voice = directive.attributes?.voice;
  const [name, effect] = (voice||'').split(':');
  if(name){
    directive.data = {
      hName: 'voice',
      hProperties: {
        name,
        effect
      }
    }
    directive.attributes = {};
  }
}

export const setBreakDirectiveData = (directive:LeafDirective|TextDirective, defaultBreakTime:number=500) => {
  const time = directive.attributes?.class;
  if(!!Number(time) || time === '.'){ 
    directive.data = {
      hName: 'break',
      hProperties: {
        time: Number(time) || defaultBreakTime
      }
    }
    directive.attributes = {};
  }
}

export const setLexiconDirective = (directive:LeafDirective) => {
  const lexicon = directive.attributes?.uri;
  if(lexicon){
    directive.data = {
      hName: 'lexicon',
      hProperties: {
        uri: lexicon
      }
    }
    directive.attributes = {};
  }
}

export const setBookmarkDirective = (directive:LeafDirective|TextDirective) => {
  const bookmark = directive.attributes?.id;
  if(bookmark){
    directive.data = {
      hName: 'bookmark',
      hProperties: {
        mark: bookmark
      }
    }
    directive.attributes = {};
  }
}

export const setLangDirective = (directive:ContainerDirective|LeafDirective|TextDirective) => {
  const lang = directive.attributes?.lang;
  if(lang){
    directive.data = {
      hName: 'lang',
      hProperties: {
        'xml:lang':lang
      }
    }
    directive.attributes = {};
  }
}

export const setSubDirective = (directive:LeafDirective|TextDirective) => {
  const sub = directive.attributes?.sub;
  if(sub){
    directive.data = {
      hName: 'sub',
      hProperties: {
        alias:sub
      }
    }
    directive.attributes = {};
  }
}

export const setSayasDirective = (directive:LeafDirective|TextDirective) => {
  const sayas = directive.attributes?.as;
  const [interpretAs, format, detail] = (sayas||'').split(':');
  if(interpretAs){
    directive.data = {
      hName: 'say-as',
      hProperties: {
        "interpret-as": interpretAs,
        format,
        detail
      }
    }
    directive.attributes = {};
  }
}



export const remarkSsml:Plugin<void[], Root, Root> = function () {
  return (tree) => {
    visit(tree, ['containerDirective', 'leafDirective', 'textDirective'], (node:Node) => {
      if(isContainerDirective(node)){
        const containerDirective = node as ContainerDirective;
        setVoiceDirective(containerDirective);
        setLangDirective(containerDirective);
      }else if(isLeafDirective(node)){
        const leafDirective = node as LeafDirective;
        setBreakDirectiveData(leafDirective);
        setLexiconDirective(leafDirective);
        setBookmarkDirective(leafDirective);
        setLangDirective(leafDirective);
        setSubDirective(leafDirective);
        setSayasDirective(leafDirective);
      }else if(isTextDirective(node)){
        const textDirective = node as TextDirective;
        setBreakDirectiveData(textDirective);
        setBookmarkDirective(textDirective);
        setLangDirective(textDirective);
        setSubDirective(textDirective);
        setSayasDirective(textDirective);
      }
    });
  };
};