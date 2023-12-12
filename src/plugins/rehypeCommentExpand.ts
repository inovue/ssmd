import {unified } from 'unified';
import { visit } from 'unist-util-visit';
//import { Node, Parent } from 'unist';
import { Root } from 'hast';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import { Plugin } from "unified"

export const rehypeCommentExpand:Plugin<void[], Root, Root> = function () {
  return (tree) => {
    visit(tree, 'raw', (node, index, parent) => {
      const comment = extractHtmlComment(node.value);

      if (comment && parent && typeof index === 'number') {
        // commentValueのマークダウンをmdastに変換
        const mdast = unified()
          .use(remarkParse)
          .use(remarkGfm)
          .parse(comment);
        const hast = unified()
          .use(remarkRehype, {allowDangerousHtml: true})
          .runSync(mdast);

        // mdastのchildrenをhastのchildrenに置換
        parent.children.splice(index, 1, ...hast.children);
      }
    });
    return tree;
  }
}

export function extractHtmlComment(str:string):string|null {
  const regexp = /<!--\s*(?<commentValue>.*)\s*-->/s;
  const result = regexp.exec(str);
  if (result && result.groups && result.groups.commentValue) {
    return result.groups.commentValue;
  } else {
    return null;
  }
}