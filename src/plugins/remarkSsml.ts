import {unified, Transformer  } from 'unified';
import { visit } from 'unist-util-visit';
import { Node, Parent } from 'unist';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

// プラグインの型定義
interface CommentNode extends Node {
  type: 'comment';
  commentValue: string;
}

export const remarkCommentExpand: () => Transformer = () => {
  return (tree) => {
    visit(tree, 'comment', (node:CommentNode, index, parent:Parent) => {
      if (parent && typeof index === 'number') {
        // commentValueのマークダウンをmdastに変換
        const mdastTree = unified().use(remarkParse).use(remarkGfm).parse(node.commentValue);

        // 元のcommentノードを変換したノードに置き換え
        parent.children.splice(index, 1, ...mdastTree.children);
      }
    });
  };
};

