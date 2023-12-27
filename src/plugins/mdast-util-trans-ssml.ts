import { visit } from 'unist-util-visit';
import type { Root, Node } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';


export const transSsmlFromMdast = (tree: Root) => {
  visit(tree, ['containerDirective', 'leafDirective', 'textDirective'], (node: Node) => {
    if (isContainerDirective(node)) {
      const containerDirective = node as ContainerDirective;
      transVoiceDirective(containerDirective);
      transLangDirective(containerDirective);
    } else if (isLeafDirective(node)) {
      const leafDirective = node as LeafDirective;
      transBreakDirectiveData(leafDirective);
      transLexiconDirective(leafDirective);
      transBookmarkDirective(leafDirective);
      transLangDirective(leafDirective);
      transSubDirective(leafDirective);
      transSayasDirective(leafDirective);
    } else if (isTextDirective(node)) {
      const textDirective = node as TextDirective;
      transBreakDirectiveData(textDirective);
      transBookmarkDirective(textDirective);
      transLangDirective(textDirective);
      transSubDirective(textDirective);
      transSayasDirective(textDirective);
    }
  });
};


export const isContainerDirective = (node: Node): boolean => node.type === 'containerDirective';
export const isLeafDirective = (node: Node): boolean => node.type === 'leafDirective';
export const isTextDirective = (node: Node): boolean => node.type === 'textDirective';


export const transVoiceDirective = (directive: ContainerDirective) => {
  const voice = directive.attributes?.voice;
  const [name, effect] = (voice || '').split(':');
  if (name) {
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

export const transBreakDirectiveData = (directive: LeafDirective | TextDirective, defaultBreakTime: number = 500) => {
  const time = directive.attributes?.class;
  if (!!Number(time) || time === '.') {
    directive.data = {
      hName: 'break',
      hProperties: {
        time: Number(time) || defaultBreakTime
      }
    }
    directive.attributes = {};
  }
}

export const transLexiconDirective = (directive: LeafDirective) => {
  const lexicon = directive.attributes?.uri;
  if (lexicon) {
    directive.data = {
      hName: 'lexicon',
      hProperties: {
        uri: lexicon
      }
    }
    directive.attributes = {};
  }
}

export const transBookmarkDirective = (directive: LeafDirective | TextDirective) => {
  const bookmark = directive.attributes?.id;
  if (bookmark) {
    directive.data = {
      hName: 'bookmark',
      hProperties: {
        mark: bookmark
      }
    }
    directive.attributes = {};
  }
}

export const transLangDirective = (directive: ContainerDirective | LeafDirective | TextDirective) => {
  const lang = directive.attributes?.lang;
  if (lang) {
    directive.data = {
      hName: 'lang',
      hProperties: {
        'xml:lang': lang
      }
    }
    directive.attributes = {};
  }
}

export const transSubDirective = (directive: LeafDirective | TextDirective) => {
  const sub = directive.attributes?.sub;
  if (sub) {
    directive.data = {
      hName: 'sub',
      hProperties: {
        alias: sub
      }
    }
    directive.attributes = {};
  }
}

export const transSayasDirective = (directive: LeafDirective | TextDirective) => {
  const sayas = directive.attributes?.as;
  const [interpretAs, format, detail] = (sayas || '').split(':');
  if (interpretAs) {
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

