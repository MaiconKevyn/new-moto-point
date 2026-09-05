import type { APIRoute } from 'astro';

/** Gerado no build para o sitemap sempre apontar para o SITE_URL em uso. */
export const GET: APIRoute = ({ site }) => {
  const basePath = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const corpo = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${new URL(`${basePath}sitemap-index.xml`, site)}`,
    '',
  ].join('\n');

  return new Response(corpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
