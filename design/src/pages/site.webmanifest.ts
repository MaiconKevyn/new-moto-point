import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { url } from '../data/navegacao';

/**
 * Gerado no build em vez de ficar parado em public/, para os caminhos
 * acompanharem a pasta de instalação (BASE_PATH). Publicado numa subpasta, um
 * manifesto com `start_url: "/"` mandaria quem instala o atalho para a versão
 * errada do site.
 */
export const GET: APIRoute = () => {
  const manifesto = {
    name: `${site.nome} — Peças, Acessórios e Oficina`,
    short_name: site.nome,
    description:
      'Loja de peças e acessórios para motos com oficina própria na Av. Farrapos, Porto Alegre/RS.',
    lang: 'pt-BR',
    start_url: url('/'),
    scope: url('/'),
    display: 'standalone',
    background_color: '#050506',
    theme_color: '#050506',
    icons: [
      { src: url('/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: url('/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };

  return new Response(JSON.stringify(manifesto, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
