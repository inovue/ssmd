import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {unified} from 'unified';
//import remark from 'remark'
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";

import { rehypeCommentExpand } from "./plugins/rehypeCommentExpand.js";
import { rehypeAutoUniqueId } from "./plugins/rehypeAutoUniqueId.js";
import {rehypeToSsml} from "./plugins/rehypeToSsml.js";
import rehypeRaw from "rehype-raw";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {

  const mdString = fs.readFileSync(path.resolve(__dirname, "example.md")).toString();


  const mdast = unified().use(remarkParse).use(remarkGfm).parse(mdString);
  const hast = unified().use(remarkRehype, {allowDangerousHtml: true}).runSync(mdast);
  const hast2 = unified().use(rehypeAutoUniqueId).use(rehypeCommentExpand).runSync(hast);
  const hast3 = unified().use(rehypeRaw).use(rehypeToSsml).stringify(hast2);
  const htmlString = unified().use(rehypeStringify).stringify(hast2);

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