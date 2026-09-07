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

/**
 * Pasta em que o site vive dentro do domínio. Vazio publica na raiz.
 *
 * As versões alternativas ficam em subpastas do mesmo domínio
 * (`/asfalto/`, `/editorial/`), e aí o build precisa saber disso:
 *
 *   BASE_PATH=editorial npm run build
 *
 * Sem isso o site sobe com links para a raiz e a navegação cai na versão
 * errada. Todo link interno passa por `url()` em src/data/navegacao.ts.
 *
 * A barra do começo é opcional de propósito: no Git Bash do Windows um valor
 * que começa com `/` é reescrito para um caminho do disco (`C:/Program
 * Files/Git/editorial`) antes de chegar aqui, e o build quebra.
 */
const basePath = (process.env.SITE_BASE_PATH || process.env.BASE_PATH || env.SITE_BASE_PATH || env.BASE_PATH || '').trim().replace(/^\/+|\/+$/g, '');
const base = basePath ? `/${basePath}` : '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
