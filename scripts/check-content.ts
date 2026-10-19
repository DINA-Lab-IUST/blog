/**
 * check-content.ts
 *
 * Fast frontmatter validation for content pull requests (posts and
 * people). Students only write Markdown — this catches typos in `authors`,
 * `refs`, `lang` and `image` paths in seconds, without a full site build.
 *
 * Template changes still go through the full gate
 * (type-check → lint → unit tests → build) via CI.
 *
 * Usage:
 *   yarn content:check
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import yaml from 'js-yaml';

const root = process.cwd();

interface Issue {
  file: string;
  message: string;
}

const issues: Issue[] = [];
let checked = 0;

function fail(file: string, message: string): void {
  issues.push({ file, message });
}

/** Split `---\nfrontmatter\n---\nbody` (also tolerates `...` closers). */
function splitFrontmatter(source: string, file: string): { data: any; ok: boolean } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)\r?\n?/);
  if (!match) {
    fail(file, 'missing YAML frontmatter block (--- ... ---)');
    return { data: {}, ok: false };
  }
  try {
    return { data: yaml.load(match[1]) ?? {}, ok: true };
  } catch (err) {
    fail(file, `invalid YAML frontmatter: ${(err as Error).message.split('\n')[0]}`);
    return { data: {}, ok: false };
  }
}

function listFiles(dir: string): string[] {
  const abs = join(root, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => join(dir, f));
}

function asArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function checkDate(data: any, file: string, field = 'date'): void {
  const raw = data[field];
  if (raw === undefined || raw === null || raw === '') {
    fail(file, `missing required field: ${field}`);
    return;
  }
  const d = raw instanceof Date ? raw : new Date(String(raw));
  if (Number.isNaN(d.getTime())) fail(file, `unparseable ${field}: ${JSON.stringify(raw)}`);
}

// ─── People slugs (valid `authors` targets) ─────────────────────────────────

const peopleFiles = new Set(
  listFiles('src/content/people').map((f) =>
    f
      .split(/[\\/]/)
      .pop()!
      .replace(/\.mdx?$/, ''),
  ),
);

// ─── Posts ──────────────────────────────────────────────────────────────────

const postIds = new Set(
  listFiles('src/content/posts').map((f) =>
    f
      .split(/[\\/]/)
      .pop()!
      .replace(/\.mdx?$/, ''),
  ),
);

for (const file of listFiles('src/content/posts')) {
  checked++;
  const { data, ok } = splitFrontmatter(readFileSync(join(root, file), 'utf8'), file);
  if (!ok) continue;
  if (typeof data.title !== 'string' || data.title.trim() === '') {
    fail(file, 'missing required field: title');
  }
  checkDate(data, file);
  if (data.lang !== undefined && data.lang !== 'en' && data.lang !== 'fa') {
    fail(file, `lang must be "en" or "fa", got: ${JSON.stringify(data.lang)}`);
  }
  for (const slug of asArray(data.authors)) {
    if (!peopleFiles.has(slug.replace(/\.mdx?$/, ''))) {
      fail(file, `unknown author slug: ${slug} (no src/content/people/${slug}.md)`);
    }
  }
  for (const ref of asArray(data.refs)) {
    if (!postIds.has(ref.replace(/\.mdx?$/, ''))) {
      fail(file, `unknown refs entry: ${ref} (no such post)`);
    }
  }
  if (typeof data.image === 'string' && data.image !== '') {
    const local = data.image.replace(/^\//, '');
    if (/^https?:\/\//.test(data.image)) {
      // Remote URL — cannot verify locally.
    } else if (!existsSync(join(root, 'public', local))) {
      fail(file, `image not found: public/${local}`);
    }
  }
}

// ─── People ─────────────────────────────────────────────────────────────────

for (const file of listFiles('src/content/people')) {
  checked++;
  const { data, ok } = splitFrontmatter(readFileSync(join(root, file), 'utf8'), file);
  if (!ok) continue;
  if (typeof data.name !== 'string' || data.name.trim() === '') {
    fail(file, 'missing required field: name');
  }
  if (typeof data.role !== 'string' || data.role.trim() === '') {
    fail(file, 'missing required field: role');
  }
  if (typeof data.photo === 'string' && data.photo !== '' && !/^https?:\/\//.test(data.photo)) {
    if (!existsSync(join(root, 'public', data.photo.replace(/^\//, '')))) {
      fail(file, `photo not found: public/${data.photo.replace(/^\//, '')}`);
    }
  }
}

// ─── Report ─────────────────────────────────────────────────────────────────

if (issues.length > 0) {
  console.error(`\ncontent:check failed — ${issues.length} problem(s) in ${checked} file(s):\n`);
  for (const { file, message } of issues) {
    console.error(`  ✗ ${file}\n      ${message}`);
  }
  process.exit(1);
} else {
  console.log(`content:check passed — ${checked} file(s) OK.`);
}
