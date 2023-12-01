import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {Transformer, unified} from 'unified';
import remark from 'remark'
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkComment from "remark-comment";
import type { Options } from 'remark-comment';

import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

// プラグインの型定義
interface CommentNode extends Node {
  type: 'comment';
  commentValue: string;
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {

  const remarkCommentExpand: () => Transformer = () => {
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

  let mdString = fs.readFileSync(path.resolve(__dirname, "example.md")).toString();
  // console.log(mdString);

  const mdast = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkComment, { ast: true } as Options)
    .parse(mdString);
  const mdast2 = unified().use(remarkCommentExpand).runSync(mdast);
  const hast = unified().use(remarkRehype).runSync(mdast);
  const htmlString = unified().use(rehypeStringify).stringify(hast);

  /*
  const htmlString = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(mdString).toString();
  */
    

  console.log(htmlString);

  fs.writeFileSync(path.resolve(__dirname, "example.html"), htmlString);
})();