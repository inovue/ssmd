import type { Parser, Plugin, Processor } from "unified"
import type { Nodes as HastNodes } from 'hast';
import {fromMarkdown} from 'mdast-util-from-markdown'
import {directive} from 'micromark-extension-directive'
import {directiveFromMarkdown} from 'mdast-util-directive'
import {gfm} from 'micromark-extension-gfm'
import {gfmFromMarkdown} from 'mdast-util-gfm'
import transformSsmlFromMdast from "./mdast-util-ssml.js";
import { toHast } from "mdast-util-to-hast";

export const ssmdParse: Plugin<void[], string, HastNodes>  = function(this:Processor) {
  const parser:Parser<HastNodes> = (document) => {
    const mdastRoot = fromMarkdown(document, {
      extensions: [ directive(), gfm() ],
      mdastExtensions: [ directiveFromMarkdown(), gfmFromMarkdown() ]
    });
    transformSsmlFromMdast(mdastRoot);
    const hastNodes = toHast(mdastRoot, {allowDangerousHtml: true});

    
    return hastNodes;
  }
  this.parser = parser;
}
