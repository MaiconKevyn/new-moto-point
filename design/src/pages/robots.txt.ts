import type { APIRoute } from 'astro';
import { url } from '../data/navegacao';

/**
 * Gerado no build para o sitemap sempre apontar para o SITE_URL em uso.
 *
 * Numa instalação em subpasta este arquivo é publicado junto, mas os
 * buscadores só leem o robots.txt da raiz do domínio — quem manda ali é o
 * robots.txt do site principal.
 */
export const GET: APIRoute = ({ site }) => {
  const corpo = [
    'User-agent: *',
    `Allow: ${url('/')}`,
    '',
    `Sitemap: ${new URL(url('/sitemap-index.xml'), site)}`,
    '',
  ].join('\n');

  return new Response(corpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
