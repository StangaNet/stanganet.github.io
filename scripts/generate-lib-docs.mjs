/**
 * Generate LibraryDoc TypeScript modules from StangaNetLib.* public C# sources.
 * Usage: node scripts/generate-lib-docs.mjs
 */
import fs from 'fs';
import path from 'path';

const LIBS_ROOT = 'd:/Sviluppi/StangaNet/Libraries';
const OUT_DIR = 'd:/Sviluppi/StangaNet/stanganet.github.io/src/content/docs/libraries';
const SKIP = new Set(['StangaNetLib.Core']); // already hand-authored

const META = {
  Auth: {
    slug: 'auth',
    tagline: 'Authentication and authorization building blocks for ASP.NET',
    description:
      'Auth primitives for token handling, identity, and policy helpers aligned with StangaNetLib.Core Result patterns.',
  },
  Caching: {
    slug: 'caching',
    tagline: 'In-memory and distributed caching with lock-aware helpers',
    description:
      'Caching abstractions and providers (in-memory / Redis) with distributed lock support, built on Core and Concurrency.',
  },
  Concurrency: {
    slug: 'concurrency',
    tagline: 'Keyed locks, throttles, work queues, and debouncing',
    description:
      'Async concurrency primitives: keyed locks, semaphore throttles, bounded work queues, and per-key debouncers.',
  },
  ContentFlow: {
    slug: 'contentflow',
    tagline: 'Content lifecycle workflow with Result-based transitions',
    description:
      'Immutable content items and workflow services for Draft → Pending → Approved → Published with review trails.',
  },
  Cryptography: {
    slug: 'cryptography',
    tagline: 'Encryption, hashing, and secret-handling helpers',
    description:
      'Cryptographic utilities (encrypt/decrypt, hash, protect) designed for application and domain use without heavy framework coupling.',
  },
  EventBus: {
    slug: 'eventbus',
    tagline: 'Pub/sub messaging with in-memory and broker backends',
    description:
      'Event bus abstractions with in-memory and RabbitMQ-style providers, integrated with Jobs where needed.',
  },
  FeatureFlags: {
    slug: 'featureflags',
    tagline: 'Feature flag evaluation and providers',
    description:
      'Feature flag service abstractions and in-memory/config providers for toggling behavior safely.',
  },
  Gdpr: {
    slug: 'gdpr',
    tagline: 'Consent, DSAR, and pseudonymization for GDPR compliance',
    description:
      'GDPR-oriented services: consent repositories, DSAR lifecycle, pseudonymization, and endpoint consent enforcement.',
  },
  Jobs: {
    slug: 'jobs',
    tagline: 'Background job scheduling and execution',
    description:
      'Job definitions, schedulers, and runners for reliable background work on top of Core concurrency primitives.',
  },
  Media: {
    slug: 'media',
    tagline: 'Media storage, processing, and metadata',
    description:
      'Media asset abstractions for upload, storage backends, and processing pipelines.',
  },
  Notifications: {
    slug: 'notifications',
    tagline: 'Multi-channel notification dispatch and templates',
    description:
      'Notification channels, templates, and dispatch services for email and other providers.',
  },
  Observability: {
    slug: 'observability',
    tagline: 'Logging, metrics, and tracing helpers',
    description:
      'Observability wiring for structured logging, metrics, and activity tracing across StangaNetLib services.',
  },
  RequestProtection: {
    slug: 'requestprotection',
    tagline: 'Rate limiting and request abuse protection',
    description:
      'ASP.NET request protection: rate limits, bot/abuse controls, backed by Caching where appropriate.',
  },
  Resilience: {
    slug: 'resilience',
    tagline: 'Named Polly pipelines that return Result',
    description:
      'Resilience pipelines (retry, circuit breaker, timeout) via Microsoft.Extensions.Resilience, mapping failures to Core Result types.',
  },
  SchemaRegistry: {
    slug: 'schemaregistry',
    tagline: 'Versioned JSON schema validation',
    description:
      'Schema registry for versioned JSON contracts with validation against registered schemas.',
  },
  Search: {
    slug: 'search',
    tagline: 'Search abstractions with in-memory BM25 provider',
    description:
      'ISearchService and in-memory BM25 indexing for full-text search without external dependencies.',
  },
  Storage: {
    slug: 'storage',
    tagline: 'Blob/object storage abstractions and providers',
    description:
      'Storage service contracts with local and cloud-oriented providers for binary object persistence.',
  },
  Tenancy: {
    slug: 'tenancy',
    tagline: 'Multi-tenant context and resolution',
    description:
      'Tenant identification, context accessors, and resolution strategies for multi-tenant applications.',
  },
};

function kebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[`<>]/g, '')
    .replace(/,/g, '-')
    .toLowerCase();
}

function esc(s) {
  return String(s ?? '')
    .replace(/\r\n/g, ' ')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\u2028|\u2029/g, ' ');
}

function stripXml(xml) {
  if (!xml) return '';
  return xml
    .replace(/<see\s+cref="([^"]+)"\s*\/>/g, (_, c) => c.split('.').pop().replace(/`\d+/g, ''))
    .replace(/<paramref\s+name="([^"]+)"\s*\/>/g, '$1')
    .replace(/<typeparamref\s+name="([^"]+)"\s*\/>/g, '$1')
    .replace(/<c>([^<]*)<\/c>/g, '$1')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractXmlSummary(block) {
  const m = block.match(/\/\/\/\s*<summary>\s*([\s\S]*?)\/\/\/\s*<\/summary>/);
  if (!m) return '';
  const inner = m[1]
    .split('\n')
    .map((l) => l.replace(/^\s*\/\/\/\s?/, ''))
    .join(' ');
  return stripXml(inner);
}

function extractXmlParams(block) {
  const params = [];
  const re = /\/\/\/\s*<param\s+name="([^"]+)">\s*([\s\S]*?)\/\/\/\s*<\/param>/g;
  let m;
  while ((m = re.exec(block))) {
    params.push({
      name: m[1],
      description: stripXml(
        m[2]
          .split('\n')
          .map((l) => l.replace(/^\s*\/\/\/\s?/, ''))
          .join(' '),
      ),
    });
  }
  return params;
}

function extractXmlReturns(block) {
  const m = block.match(/\/\/\/\s*<returns>\s*([\s\S]*?)\/\/\/\s*<\/returns>/);
  if (!m) return undefined;
  return stripXml(
    m[1]
      .split('\n')
      .map((l) => l.replace(/^\s*\/\/\/\s?/, ''))
      .join(' '),
  );
}

function leadingDocs(src, index) {
  const before = src.slice(Math.max(0, index - 2500), index);
  const lines = before.split('\n');
  const docLines = [];
  for (let i = lines.length - 1; i >= 0; i--) {
    const t = lines[i].trim();
    if (t.startsWith('///')) docLines.unshift(lines[i]);
    else if (t === '' || t.startsWith('[')) continue;
    else break;
  }
  return docLines.join('\n');
}

function parseCsFile(filePath, content) {
  const types = [];
  const nsMatch = content.match(/namespace\s+([\w.]+)/);
  const namespace = nsMatch ? nsMatch[1] : 'Unknown';

  const typeRe =
    /(?:public\s+)(?:(static|abstract|sealed|partial)\s+)*(class|interface|enum|record|struct)\s+(\w+)(?:<([^>]+)>)?/g;
  let m;
  while ((m = typeRe.exec(content))) {
    const kindRaw = m[2];
    const name = m[3];
    const typeParamsRaw = m[4];
    const start = m.index;
    // skip nested private types roughly: require public at match
    if (!m[0].includes('public')) continue;

    const docs = leadingDocs(content, start);
    const summary = extractXmlSummary(docs) || `${kindRaw} ${name}.`;

    // find type body brace
    let i = content.indexOf('{', start);
    if (i < 0) continue;
    let depth = 0;
    let end = i;
    for (; end < content.length; end++) {
      if (content[end] === '{') depth++;
      else if (content[end] === '}') {
        depth--;
        if (depth === 0) {
          end++;
          break;
        }
      }
    }
    const body = content.slice(i, end);
    const header = content.slice(start, i);

    let kind = kindRaw;
    if (kind === 'record' && header.includes('record class')) kind = 'record';

    const typeParameters = [];
    if (typeParamsRaw) {
      for (const part of typeParamsRaw.split(',')) {
        const p = part.trim();
        const nm = p.replace(/^out\s+|^in\s+/, '').split(/\s+/)[0];
        const constraintMatch = header.match(
          new RegExp(`where\\s+${nm}\\s*:\\s*([^\\n{]+)`),
        );
        typeParameters.push({
          name: nm,
          constraint: constraintMatch ? constraintMatch[1].trim() : undefined,
          description: `Type parameter ${nm}.`,
        });
      }
    }

    const inherits = [];
    const implementsList = [];
    const baseMatch = header.match(/:\s*([^{\n]+)/);
    if (baseMatch) {
      for (const b of baseMatch[1].split(',').map((x) => x.trim())) {
        if (b.startsWith('I') && /^I[A-Z]/.test(b)) implementsList.push(b);
        else inherits.push(b);
      }
    }

    const displayName = typeParamsRaw ? `${name}<${typeParamsRaw.split(',').map((p) => p.trim().replace(/^out\s+|^in\s+/, '').split(/\s+/)[0]).join(', ')}>` : name;
    const signature = header
      .replace(/\/\/\/.*$/gm, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\s*:\s*/, ' : ')
      .slice(0, 240);

    const typeDoc = {
      slug: kebab(displayName.replace(/[<>]/g, '')),
      name,
      displayName,
      kind: kind === 'record' ? 'record' : kind,
      namespace,
      summary,
      signature: signature.endsWith('{') ? signature.slice(0, -1).trim() : signature,
      inherits: inherits[0],
      implements: implementsList.length ? implementsList : undefined,
      typeParameters: typeParameters.length ? typeParameters : undefined,
      constructors: [],
      properties: [],
      methods: [],
      fields: [],
      enumValues: [],
    };

    if (kind === 'enum') {
      const enumRe = /^\s*(\w+)\s*(?:=\s*([^,\n]+))?/gm;
      let em;
      let idx = 0;
      const enumBody = body.slice(1, -1);
      while ((em = enumRe.exec(enumBody))) {
        if (['public', 'private', 'protected', 'internal'].includes(em[1])) continue;
        const val = em[2] ? Number(em[2].trim()) : idx;
        typeDoc.enumValues.push({
          name: em[1],
          value: Number.isFinite(val) ? val : idx,
          summary: em[1],
        });
        idx++;
      }
    } else {
      // properties
      const propRe =
        /(?:public|protected)\s+(?:static\s+|virtual\s+|override\s+|abstract\s+|required\s+|new\s+)*(?:[\w.<>,\s\?\[\]]+?)\s+(\w+)\s*\{\s*(get|set|init)/g;
      let pm;
      while ((pm = propRe.exec(body))) {
        const pDocs = leadingDocs(body, pm.index);
        const access = body.slice(pm.index, pm.index + 120).includes('init')
          ? 'get; init'
          : body.slice(pm.index, pm.index + 120).includes('set')
            ? 'get; set'
            : 'get';
        const typeM = pm[0].match(
          /(?:public|protected)\s+(?:static\s+|virtual\s+|override\s+|abstract\s+|required\s+|new\s+)*([\w.<>,\s\?\[\]]+?)\s+\w+\s*\{/,
        );
        typeDoc.properties.push({
          name: pm[1],
          type: typeM ? typeM[1].trim() : 'unknown',
          access,
          summary: extractXmlSummary(pDocs) || pm[1],
        });
      }

      // methods & constructors
      const methodRe =
        /(?:public|protected)\s+(?:static\s+|virtual\s+|override\s+|abstract\s+|async\s+|new\s+|sealed\s+)*(?:[\w.<>,\s\?\[\]]+?)\s+(\w+)\s*(?:<[^>]+>)?\s*\(([^)]*)\)/g;
      let mm;
      while ((mm = methodRe.exec(body))) {
        const methodName = mm[1];
        if (['get', 'set', 'init', 'add', 'remove'].includes(methodName)) continue;
        const mDocs = leadingDocs(body, mm.index);
        const isCtor = methodName === name;
        const isStatic = mm[0].includes('static');
        const isAsync = mm[0].includes('async') || /Task(?:<|$)/.test(mm[0]);
        const retMatch = mm[0].match(
          /(?:public|protected)\s+(?:static\s+|virtual\s+|override\s+|abstract\s+|async\s+|new\s+|sealed\s+)*([\w.<>,\s\?\[\]]+?)\s+\w+\s*(?:<[^>]+>)?\s*\(/,
        );
        const returnType = isCtor ? undefined : retMatch ? retMatch[1].trim() : undefined;
        const paramsRaw = mm[2].trim();
        const xmlParams = extractXmlParams(mDocs);
        const parameters = [];
        if (paramsRaw) {
          for (const part of splitParams(paramsRaw)) {
            const optional = part.includes('=');
            const cleaned = part.replace(/\s*=\s*.*$/, '').trim();
            const bits = cleaned.split(/\s+/);
            const pName = bits.pop();
            const pType = bits.join(' ').replace(/^(this|ref|out|in|params)\s+/, '');
            const xml = xmlParams.find((p) => p.name === pName);
            parameters.push({
              name: pName.replace(/^@/, ''),
              type: pType || 'object',
              description: xml?.description || pName,
              optional: optional || undefined,
            });
          }
        }
        const sig = mm[0]
          .replace(/\s+/g, ' ')
          .replace(/^(public|protected)\s+/, 'public ')
          .trim();
        const entry = {
          name: methodName,
          signature: sig.length > 200 ? sig.slice(0, 197) + '...' : sig,
          summary: extractXmlSummary(mDocs) || methodName,
          parameters: parameters.length ? parameters : undefined,
          returns: extractXmlReturns(mDocs) || (returnType && returnType !== 'void' ? returnType : undefined),
          isStatic: isStatic || undefined,
          isAsync: isAsync || undefined,
        };
        if (isCtor) typeDoc.constructors.push(entry);
        else typeDoc.methods.push(entry);
      }

      // static fields / const
      const fieldRe =
        /public\s+(?:static\s+|readonly\s+|const\s+)+([\w.<>,\s\?\[\]]+?)\s+(\w+)\s*(?:=\s*([^;]+))?;/g;
      let fm;
      while ((fm = fieldRe.exec(body))) {
        const fDocs = leadingDocs(body, fm.index);
        let value = fm[3]?.trim();
        if (value) {
          value = value.replace(/\s+/g, ' ').slice(0, 120);
          if (fm[3].trim().length > 120) value += '...';
        }
        typeDoc.fields.push({
          name: fm[2],
          type: fm[1].trim(),
          summary: extractXmlSummary(fDocs) || fm[2],
          value,
        });
      }
    }

    // cleanup empty arrays
    if (!typeDoc.constructors.length) delete typeDoc.constructors;
    if (!typeDoc.properties.length) delete typeDoc.properties;
    if (!typeDoc.methods.length) delete typeDoc.methods;
    if (!typeDoc.fields.length) delete typeDoc.fields;
    if (!typeDoc.enumValues.length) delete typeDoc.enumValues;

    types.push(typeDoc);
  }
  return { namespace, types };
}

function splitParams(s) {
  const parts = [];
  let cur = '';
  let depth = 0;
  for (const ch of s) {
    if (ch === '<') depth++;
    else if (ch === '>') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

function readVersion(csprojPath) {
  const xml = fs.readFileSync(csprojPath, 'utf8');
  const v = xml.match(/<Version>([^<]+)<\/Version>/);
  const tfm = xml.match(/<TargetFrameworks>([^<]+)<\/TargetFrameworks>/) ||
    xml.match(/<TargetFramework>([^<]+)<\/TargetFramework>/);
  return {
    version: v ? v[1] : '1.0.0',
    frameworks: tfm ? tfm[1].split(';').map((x) => x.trim()) : ['net8.0', 'net9.0'],
  };
}

function emitTs(libName, shortName, meta, version, frameworks, namespaces) {
  const exportName =
    shortName.charAt(0).toLowerCase() +
    shortName.slice(1).replace(/Flow$/, 'Flow') +
    'Library';
  // special cases
  const exportMap = {
    ContentFlow: 'contentFlowLibrary',
    FeatureFlags: 'featureFlagsLibrary',
    RequestProtection: 'requestProtectionLibrary',
    SchemaRegistry: 'schemaRegistryLibrary',
    EventBus: 'eventBusLibrary',
  };
  const exp = exportMap[shortName] || `${shortName.charAt(0).toLowerCase()}${shortName.slice(1)}Library`;

  const nsBlocks = namespaces
    .map((ns) => {
      const types = ns.types.map((t) => emitType(t)).join(',\n');
      return `    {
      name: '${esc(ns.name)}',
      summary: '${esc(ns.summary)}',
      types: [
${types}
      ],
    }`;
    })
    .join(',\n');

  return `import type { LibraryDoc } from '../types';

export const ${exp}: LibraryDoc = {
  slug: '${meta.slug}',
  name: '${libName}',
  version: '${version}',
  targetFrameworks: [${frameworks.map((f) => `'${f}'`).join(', ')}],
  tagline: '${esc(meta.tagline)}',
  description:
    '${esc(meta.description)}',
  repository: 'https://github.com/StangaNet/${libName}',
  namespaces: [
${nsBlocks}
  ],
};
`;
}

function emitType(t) {
  const lines = [];
  lines.push(`        {
          slug: '${t.slug}',
          name: '${esc(t.name)}',
          displayName: '${esc(t.displayName)}',
          kind: '${t.kind}',
          namespace: '${esc(t.namespace)}',
          summary: '${esc(t.summary)}',
          signature: '${esc(t.signature)}',`);
  if (t.inherits) lines.push(`          inherits: '${esc(t.inherits)}',`);
  if (t.implements?.length)
    lines.push(`          implements: [${t.implements.map((i) => `'${esc(i)}'`).join(', ')}],`);
  if (t.typeParameters?.length) {
    lines.push(`          typeParameters: [`);
    for (const tp of t.typeParameters) {
      lines.push(
        `            { name: '${esc(tp.name)}'${tp.constraint ? `, constraint: '${esc(tp.constraint)}'` : ''}, description: '${esc(tp.description)}' },`,
      );
    }
    lines.push(`          ],`);
  }
  if (t.constructors?.length) {
    lines.push(`          constructors: [`);
    for (const c of t.constructors) lines.push(emitMethod(c) + ',');
    lines.push(`          ],`);
  }
  if (t.properties?.length) {
    lines.push(`          properties: [`);
    for (const p of t.properties) {
      lines.push(
        `            { name: '${esc(p.name)}', type: '${esc(p.type)}', access: '${p.access}', summary: '${esc(p.summary)}' },`,
      );
    }
    lines.push(`          ],`);
  }
  if (t.methods?.length) {
    lines.push(`          methods: [`);
    for (const m of t.methods) lines.push(emitMethod(m) + ',');
    lines.push(`          ],`);
  }
  if (t.fields?.length) {
    lines.push(`          fields: [`);
    for (const f of t.fields) {
      lines.push(
        `            { name: '${esc(f.name)}', type: '${esc(f.type)}', summary: '${esc(f.summary)}'${f.value ? `, value: '${esc(f.value)}'` : ''} },`,
      );
    }
    lines.push(`          ],`);
  }
  if (t.enumValues?.length) {
    lines.push(`          enumValues: [`);
    for (const e of t.enumValues) {
      lines.push(
        `            { name: '${esc(e.name)}', value: ${e.value}, summary: '${esc(e.summary)}' },`,
      );
    }
    lines.push(`          ],`);
  }
  lines.push(`        }`);
  return lines.join('\n');
}

function emitMethod(m) {
  const parts = [
    `            { name: '${esc(m.name)}', signature: '${esc(m.signature)}', summary: '${esc(m.summary)}'`,
  ];
  if (m.parameters?.length) {
    parts.push(
      `, parameters: [${m.parameters
        .map(
          (p) =>
            `{ name: '${esc(p.name)}', type: '${esc(p.type)}', description: '${esc(p.description)}'${p.optional ? ', optional: true' : ''} }`,
        )
        .join(', ')}]`,
    );
  }
  if (m.returns) parts.push(`, returns: '${esc(m.returns)}'`);
  if (m.isStatic) parts.push(`, isStatic: true`);
  if (m.isAsync) parts.push(`, isAsync: true`);
  parts.push(` }`);
  return parts.join('');
}

function walkCs(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'obj' || e.name === 'bin') continue;
      out.push(...walkCs(p));
    } else if (e.name.endsWith('.cs') && !e.name.endsWith('.g.cs') && !e.name.includes('AssemblyInfo')) {
      out.push(p);
    }
  }
  return out;
}

function main() {
  const libs = fs
    .readdirSync(LIBS_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith('StangaNetLib.'))
    .map((d) => d.name)
    .sort();

  const generated = [];

  for (const libName of libs) {
    if (SKIP.has(libName)) {
      console.log('skip', libName);
      continue;
    }
    const shortName = libName.replace(/^StangaNetLib\./, '');
    const meta = META[shortName];
    if (!meta) {
      console.warn('no META for', shortName);
      continue;
    }
    const srcDir = path.join(LIBS_ROOT, libName, 'src', libName);
    const csproj = path.join(srcDir, `${libName}.csproj`);
    if (!fs.existsSync(srcDir) || !fs.existsSync(csproj)) {
      console.warn('missing src', libName);
      continue;
    }
    const { version, frameworks } = readVersion(csproj);
    const files = walkCs(srcDir);
    const byNs = new Map();
    for (const f of files) {
      const content = fs.readFileSync(f, 'utf8');
      // skip files with only internal/private types for generation noise
      if (!/\bpublic\s+(?:static\s+|abstract\s+|sealed\s+|partial\s+)*(?:class|interface|enum|record|struct)\b/.test(content))
        continue;
      const { namespace, types } = parseCsFile(f, content);
      if (!types.length) continue;
      if (!byNs.has(namespace)) byNs.set(namespace, []);
      // dedupe by slug
      const list = byNs.get(namespace);
      for (const t of types) {
        if (!list.some((x) => x.slug === t.slug && x.displayName === t.displayName)) list.push(t);
      }
    }

    const namespaces = [...byNs.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, types]) => ({
        name,
        summary: `Types in ${name}.`,
        types: types.sort((a, b) => a.displayName.localeCompare(b.displayName)),
      }))
      .filter((ns) => ns.types.length > 0);

    const ts = emitTs(libName, shortName, meta, version, frameworks, namespaces);
    const outPath = path.join(OUT_DIR, `${meta.slug}.ts`);
    fs.writeFileSync(outPath, ts);
    const typeCount = namespaces.reduce((n, ns) => n + ns.types.length, 0);
    console.log(`wrote ${meta.slug}.ts — ${namespaces.length} ns, ${typeCount} types, v${version}`);
    generated.push({
      slug: meta.slug,
      shortName,
      exportName: (() => {
        const exportMap = {
          ContentFlow: 'contentFlowLibrary',
          FeatureFlags: 'featureFlagsLibrary',
          RequestProtection: 'requestProtectionLibrary',
          SchemaRegistry: 'schemaRegistryLibrary',
          EventBus: 'eventBusLibrary',
        };
        return (
          exportMap[shortName] ||
          `${shortName.charAt(0).toLowerCase()}${shortName.slice(1)}Library`
        );
      })(),
      importPath: `./libraries/${meta.slug}`,
    });
  }

  // write registry stub helper
  fs.writeFileSync(
    path.join(OUT_DIR, '_generated-manifest.json'),
    JSON.stringify(generated, null, 2),
  );
  console.log('manifest', generated.length, 'libraries');
}

main();
