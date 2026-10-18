/** Lightweight C# / XML / plain highlighter → HTML with token spans. */
const CSHARP_KEYWORDS =
  /\b(abstract|as|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|record|required|init|get|set|var|when|where|yield|partial|file|scoped)\b/g;

const CSHARP_TYPES =
  /\b(Task|ValueTask|Result|Guid|DateTime|DateTimeOffset|String|Boolean|Int32|Int64|CancellationToken|IEnumerable|IAsyncEnumerable|List|Dictionary|Action|Func|Exception|AggregateRoot|Entity|ValueObject|ISpecification|IRepository|IUnitOfWork)\b/g;

export function highlightCode(code: string, lang?: string): string {
  const escaped = escapeHtml(code);
  const l = (lang ?? '').toLowerCase();

  if (l === 'csharp' || l === 'cs' || l === 'c#' || (!lang && looksLikeCSharp(code))) {
    return highlightCSharp(escaped);
  }
  if (l === 'xml' || l === 'csproj' || code.trimStart().startsWith('<')) {
    return highlightXml(escaped);
  }
  return escaped;
}

function looksLikeCSharp(code: string): boolean {
  return /\b(public|private|class|interface|async|Task|namespace)\b/.test(code);
}

function highlightCSharp(s: string): string {
  // comments
  s = s.replace(/(\/\/[^\n]*)/g, '<span class="tok-cmt">$1</span>');
  s = s.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-cmt">$1</span>');
  // strings (simple)
  s = s.replace(/("[^"\\]*(?:\\.[^"\\]*)*"|@"[^"]*")/g, '<span class="tok-str">$1</span>');
  // numbers
  s = s.replace(/\b(\d+\.?\d*[fFdDmM]?)\b/g, '<span class="tok-num">$1</span>');
  // keywords / types — avoid replacing inside existing spans
  s = mapOutsideSpans(s, (chunk) =>
    chunk
      .replace(CSHARP_KEYWORDS, '<span class="tok-kw">$1</span>')
      .replace(CSHARP_TYPES, '<span class="tok-type">$1</span>')
      .replace(/\b([A-Z][A-Za-z0-9]*)\s*(?=\()/g, '<span class="tok-fn">$1</span>'),
  );
  return s;
}

function highlightXml(s: string): string {
  s = s.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-cmt">$1</span>');
  s = s.replace(/(&lt;\/?)([\w:.-]+)/g, '$1<span class="tok-kw">$2</span>');
  s = s.replace(/\s([\w:.-]+)=(&quot;[^&]*&quot;)/g, ' <span class="tok-type">$1</span>=<span class="tok-str">$2</span>');
  return s;
}

function mapOutsideSpans(html: string, fn: (chunk: string) => string): string {
  const parts = html.split(/(<span[\s\S]*?<\/span>)/g);
  return parts.map((p, i) => (i % 2 === 1 ? p : fn(p))).join('');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
