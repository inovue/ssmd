import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {unified} from 'unified';
//import remark from 'remark'
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkDirective from 'remark-directive';
import remarkGfm from "remark-gfm";
import rehypeFormat from "rehype-format";

import { rehypeCommentExpand } from "./plugins/rehypeCommentExpand.js";
import { rehypeAutoUniqueId } from "./plugins/rehypeAutoUniqueId.js";
import { 
  hastToXast, 
  xastAddBookmark, 
  xastRemoveUnsupportedTags, 
  xastReplaceTags, 
  xastStringify 
} from "./plugins/rehypeSsmlStringify.js";

import rehypeRaw from "rehype-raw";
import { remarkSsml } from "./plugins/remarkSsml.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {

  try {
    fs.unlinkSync(path.resolve(__dirname, "example.html"));
    fs.unlinkSync(path.resolve(__dirname, "example.ssml"));
  } catch (error) {
    console.log(error);
  }
  const mdString = fs.readFileSync(path.resolve(__dirname, "example.md")).toString();


  const mdast = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkGfm)
    .parse(mdString);
  
  const hast = unified()
    .use(remarkSsml)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeFormat)
    .runSync(mdast);

  const hast2 = unified()
    .use(rehypeAutoUniqueId)
    .use(rehypeCommentExpand)
    .use(rehypeRaw)
    .runSync(hast);

  const xast = unified()
    .use(hastToXast)
    .use(xastAddBookmark)
    .use(xastRemoveUnsupportedTags)
    .use(xastReplaceTags)
    .runSync(hast2);

  const ssml = unified()
    .use(xastStringify)
    .stringify(xast);

  const htmlString = unified()
    .use(rehypeStringify)
    .stringify(hast2);

  fs.writeFileSync(path.resolve(__dirname, "example.html"), htmlString);
  fs.writeFileSync(path.resolve(__dirname, "example.ssml"), ssml);

})();