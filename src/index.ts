import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {unified} from 'unified';
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
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
import transformSsmlFromHast from "./plugins/hast-util-ssml.js";
import { ssmdParse } from "./plugins/ssmdParse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {

  try {
    fs.unlinkSync(path.resolve(__dirname, "example.html"));
    fs.unlinkSync(path.resolve(__dirname, "example.ssml"));
  } catch (error) {
    console.log(error);
  }
  const markdown = fs.readFileSync(path.resolve(__dirname, "example.md")).toString();

  const mdast = unified()
    .use(ssmdParse)
    .parse(markdown);
  
  const hast = unified()
    .use(rehypeFormat)
    .use(rehypeAutoUniqueId)
    .use(rehypeCommentExpand)
    .use(rehypeRaw)
    .runSync(mdast);

  const html = unified()
    .use(rehypeStringify)
    .stringify(hast);

  const xast = unified()
    .use(transformSsmlFromHast)
    .use(hastToXast)
    .use(xastAddBookmark)
    .use(xastRemoveUnsupportedTags)
    .use(xastReplaceTags)
    .runSync(hast);

  const ssml = unified()
    .use(xastStringify)
    .stringify(xast);

  fs.writeFileSync(path.resolve(__dirname, "example.html"), html);
  fs.writeFileSync(path.resolve(__dirname, "example.ssml"), ssml);

})();