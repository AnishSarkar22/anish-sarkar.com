import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';

const processor = remark()
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeKatex)
  .use(rehypePrettyCode, {
    theme: 'vesper',
    keepBackground: false,
  })
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function processMarkdown(content: string): Promise<string> {
  const result = await processor.process(content);
  return String(result);
}