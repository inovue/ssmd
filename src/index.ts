import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import type { Root } from "mdast";
import {unified} from 'unified';
//import remark from 'remark'
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkComment from "remark-comment";
import type { Options } from 'remark-comment';

import { remarkCommentExpand } from "./plugins/remarkCommentExpand.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {

  const mdString = fs.readFileSync(path.resolve(__dirname, "example.md")).toString();

  const mdast = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkComment, { ast: true } as Options)
    .parse(mdString);
  const mdast2 = unified().use(remarkCommentExpand).runSync(mdast) as Root;
  const hast = unified().use(remarkRehype).runSync(mdast2);
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