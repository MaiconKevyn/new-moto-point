import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(project, 'dist');
const repository = 'https://github.com/MaiconKevyn/new-moto-point.git';
const variants = [
  { branch: 'versao-2-asfalto', path: 'asfalto' },
  { branch: 'versao-3-editorial', path: 'editorial' },
];
const fileEnv = loadEnv('production', project, 'SITE_');
const site = (process.env.SITE_URL || fileEnv.SITE_URL || '').replace(/\/+$/, '');

if (!site || !/^https?:\/\//.test(site)) {
  throw new Error('Defina SITE_URL no ambiente ou em design/.env antes de compilar as três versões.');
}

function run(command, args, cwd, base = '/') {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, SITE_URL: site, SITE_BASE_PATH: base },
  });
}

// Each branch has its own dependencies, styles, fonts, and sharing image.
// Checkouts are isolated and removed after the build, including on failure.
const temporary = await mkdtemp(join(tmpdir(), 'new-moto-point-build-'));
const published = [{ branch: 'main', path: '/' }];

try {
  run('npm', ['run', 'build:single'], project);
  let sitemap = await readFile(join(output, 'sitemap-index.xml'), 'utf8');

  for (const variant of variants) {
    console.log(`\nBuilding ${variant.branch} at /${variant.path}/`);
    const checkout = join(temporary, variant.path);
    run('git', ['clone', '--depth', '1', '--single-branch', '--branch', variant.branch, repository, checkout], project);
    const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: checkout, encoding: 'utf8' }).trim();
    const source = join(checkout, 'design');
    const base = `/${variant.path}/`;

    run('npm', ['ci', '--no-audit', '--no-fund'], source, base);
    run('npm', ['run', 'astro', '--', 'check'], source, base);
    // Invoke Astro directly through its existing npm script, even if this branch
    // later merges the main branch's multi-version build command.
    run('npm', ['run', 'astro', '--', 'build'], source, base);

    const destination = join(output, variant.path);
    await cp(join(source, 'dist'), destination, { recursive: true });
    const htaccess = await readFile(join(destination, '.htaccess'), 'utf8');
    await writeFile(join(destination, '.htaccess'), htaccess.replace(/^ErrorDocument 404 .+$/m, `ErrorDocument 404 ${base}404.html`));

    const variantIndex = await readFile(join(destination, 'sitemap-index.xml'), 'utf8');
    const entries = variantIndex.match(/<sitemap>[\s\S]*?<\/sitemap>/g);
    if (!entries?.length) throw new Error(`Missing sitemap entries for ${variant.branch}`);
    sitemap = sitemap.replace('</sitemapindex>', `${entries.join('')}</sitemapindex>`);
    published.push({ branch: variant.branch, path: base, commit });
  }

  await writeFile(join(output, 'sitemap-index.xml'), sitemap);
  await writeFile(join(output, 'versions.json'), `${JSON.stringify(published, null, 2)}\n`);
  console.log('\nAll three frontends are ready in dist/.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
