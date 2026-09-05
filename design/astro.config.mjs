// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * Endereço público do site. É daqui que saem a URL canônica, o sitemap.xml,
 * o robots.txt e as tags og: usadas no compartilhamento (WhatsApp, Facebook).
 *
 * Defina em `design/.env` (local) ou como variável SITE_URL no GitHub Actions:
 *
 *   SITE_URL=https://newmotopoint.com.br
 *
 * Enquanto o domínio definitivo não estiver apontado, use o endereço
 * provisório que a Hostinger entrega no hPanel (algo como
 * https://seusite.hostingersite.com).
 */
const PLACEHOLDER = 'https://SEU-DOMINIO-AQUI.com.br';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const site = (process.env.SITE_URL || env.SITE_URL || PLACEHOLDER).replace(/\/+$/, '');

if (site === PLACEHOLDER) {
  console.warn(
    '\n  ⚠  SITE_URL não definida — usando um endereço de exemplo.' +
      '\n     A URL canônica, o sitemap e as tags de compartilhamento vão sair erradas.' +
      '\n     Defina SITE_URL em design/.env antes de publicar.\n',
  );
}

export default defineConfig({
  site,
  base: process.env.SITE_BASE_PATH || '/',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
