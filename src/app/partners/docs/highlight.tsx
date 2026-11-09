import type { ReactNode } from 'react';
import type { Lang } from './docs-content';

/*
  A small, dependency-free highlighter for the docs' own samples: strings, comments, numbers,
  keywords and JSON keys. It only has to be right for the code on this page.
*/

const KEYWORDS: Record<Lang, string[]> = {
  js: ['const', 'let', 'function', 'return', 'if', 'await', 'require', 'true', 'false', 'null', 'new'],
  py: ['import', 'from', 'def', 'return', 'if', 'not', 'or', 'and', 'for', 'in', 'None', 'True', 'False'],
  php: ['use', 'function', 'return', 'string', 'new'],
  bash: ['curl'],
  json: ['true', 'false', 'null'],
  http: ['POST', 'GET'],
};

const COMMENT: Record<Lang, string> = {
  js: '\\/\\/[^\\n]*',
  php: '\\/\\/[^\\n]*',
  py: '#[^\\n]*',
  bash: '(?<![\\w$])#[^\\n]*',
  json: '\\/\\/[^\\n]*',
  http: '(?!)',
};

export function highlight(code: string, lang: Lang): ReactNode[] {
  if (lang === 'http') {
    // Header lines: name in one colour, value plain.
    return code.split('\n').flatMap((line, i) => {
      const m = /^([A-Za-z-]+)(:)(.*)$/.exec(line);
      const parts: ReactNode[] = m
        ? [<span key={`k${i}`} className="t-key">{m[1]}</span>, m[2], m[3]]
        : line.startsWith('POST ') || line.startsWith('GET ')
          ? [<span key={`m${i}`} className="t-kw">{line.split(' ')[0]}</span>, line.slice(line.indexOf(' '))]
          : [line];
      return i === 0 ? parts : ['\n', ...parts];
    });
  }
  const kw = KEYWORDS[lang].join('|');
  const re = new RegExp(
    `(${COMMENT[lang]})|("(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`)(\\s*:)?|\\b(${kw})\\b|\\b(\\d+(?:\\.\\d+)?)\\b`,
    'g',
  );
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (let m = re.exec(code); m; m = re.exec(code)) {
    if (m[0] === '') {
      re.lastIndex++;
      continue;
    }
    if (m.index > last) out.push(code.slice(last, m.index));
    const key = n++;
    if (m[1]) out.push(<span key={key} className="t-com">{m[1]}</span>);
    else if (m[2]) {
      out.push(<span key={key} className={m[3] && (lang === 'json' || lang === 'py') ? 't-key' : 't-str'}>{m[2]}</span>);
      if (m[3]) out.push(m[3]);
    } else if (m[4]) out.push(<span key={key} className="t-kw">{m[4]}</span>);
    else if (m[5]) out.push(<span key={key} className="t-num">{m[5]}</span>);
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

/** JSON, two-space indented, ready to highlight. */
export const pretty = (v: unknown): string => JSON.stringify(v, null, 2);
