/**
 * Estrutura de navegação do site — fonte única para o menu do topo, o menu do
 * celular, o rodapé e os atalhos da página 404.
 *
 * Os endereços levam barra no fim (`/loja/`) porque o Astro gera as páginas
 * como diretório (`dist/loja/index.html`). Sem a barra o Apache responde com
 * um redirecionamento 301 antes de servir a página — funciona, mas cobra um
 * salto extra em cada clique.
 */

export interface SubItem {
  href: string;
  rotulo: string;
}

export interface ItemNav {
  href: string;
  rotulo: string;
  /** Submenu: aparece como dropdown no desktop e como lista recuada no celular. */
  sub?: SubItem[];
}

export const navegacao: ItemNav[] = [
  { href: '/', rotulo: 'Início' },
  {
    href: '/loja/',
    rotulo: 'Loja',
    sub: [
      { href: '/loja/#ofertas', rotulo: 'Ofertas' },
      { href: '/loja/#chuva', rotulo: 'Chuva e frio' },
      { href: '/loja/#baus', rotulo: 'Baús e grelhas' },
      { href: '/loja/#viseiras', rotulo: 'Viseiras' },
      { href: '/loja/#pecas', rotulo: 'Peças de reposição' },
      { href: '/loja/#oleos', rotulo: 'Óleos 20W50' },
    ],
  },
  {
    href: '/oficina/',
    rotulo: 'Oficina',
    sub: [
      { href: '/oficina/#servicos', rotulo: 'Serviços' },
      { href: '/oficina/#especialidades', rotulo: 'Especialidades' },
      { href: '/oficina/#como-funciona', rotulo: 'Como funciona' },
    ],
  },
  { href: '/contato/', rotulo: 'Contato' },
];

/**
 * Pasta em que o site foi publicado, sem a barra final: `''` na raiz do
 * domínio e `'/editorial'` quando o build roda com `BASE_PATH=/editorial`.
 *
 * O Astro prefixa sozinho o que ele mesmo gera (CSS, imagens processadas),
 * mas não mexe nos endereços escritos à mão. Por isso os itens acima guardam
 * sempre o caminho puro e quem monta o link chama `url()`.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Converte um caminho do site no endereço real, já com a pasta de instalação. */
export function url(href: string): string {
  return href.startsWith('/') ? `${BASE}${href}` : href;
}

/**
 * Diz se um item do menu corresponde à página aberta.
 * Compara só o primeiro trecho do caminho, para `/loja/` continuar marcado
 * mesmo quando a URL traz uma âncora ou um subcaminho. O `href` recebido é o
 * caminho puro, então a pasta de instalação sai do `pathname` antes.
 */
export function ehAtivo(pathname: string, href: string): boolean {
  const semBase = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const raiz = (s: string) => s.split('/').filter(Boolean)[0] ?? '';
  if (href === '/') return raiz(semBase) === '';
  return raiz(semBase) === raiz(href);
}
