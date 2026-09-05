# New Moto Point — site novo

Redesenho do site da **New Moto Point**, loja de peças, acessórios e oficina de
motos na Av. Farrapos, 1255 — Bairro Floresta, Porto Alegre/RS.

Substitui o site atual em Google Sites
(`sites.google.com/view/newmotopoint`), de onde foram extraídos todo o
conteúdo, as fotos dos produtos, os serviços da oficina, os preços e os links.

## Stack

| Peça | Escolha | Motivo |
| --- | --- | --- |
| Framework | **Astro 7** | Site estático: HTML pronto no servidor, ótimo para SEO local e para celular. |
| Estilo | **Tailwind CSS 4** | Tokens de marca no `@theme`, sem arquivo de config. |
| Tipografia | **Barlow Condensed + Inter** (Fontsource) | Auto-hospedadas — sem requisição ao Google Fonts. |
| Imagens | `astro:assets` | WebP + `srcset` responsivo gerados no build. |
| Linguagem | TypeScript | `astro check` sem erros. |

O site publicado **não carrega nenhum arquivo JavaScript**: os dois scripts
(menu do celular e revelação ao rolar) são pequenos e ficam embutidos no HTML.

- `index.html`: ~19 KB comprimido
- CSS: ~10 KB comprimido
- Build inteiro: 4,5 MB, quase tudo imagem de produto já otimizada

## Rodando

```bash
npm install
cp .env.example .env   # e ajuste SITE_URL
npm run dev            # http://localhost:4321
npm run build          # gera dist/
npm run preview        # serve o dist/
npx astro check        # tipos e diagnósticos
```

`SITE_URL` define a URL canônica, o `sitemap.xml`, o `robots.txt` e as tags de
compartilhamento. Sem ela o build avisa e usa um endereço de exemplo.

## Onde mexer no conteúdo

Todo o texto e o catálogo estão em três arquivos — não é preciso tocar em
componente para atualizar preço, produto ou serviço:

| Arquivo | O que tem |
| --- | --- |
| `src/data/site.ts` | Endereço, telefones, WhatsApp, e-mail, horários, redes, marcas. Também gera os links de WhatsApp com mensagem pronta (`zap`, `zapProduto`, `zapServico`). |
| `src/data/catalogo.ts` | Ofertas e vitrines (chuva, baús, viseiras, óleos), com preço, tamanho e marca. |
| `src/data/servicos.ts` | Serviços da oficina, especialidades, diferenciais, depoimentos e as 4 etapas do atendimento. |

### Adicionar um produto

1. Coloque a foto em `src/assets/img/<categoria>/`.
2. Importe a imagem no topo de `src/data/catalogo.ts`.
3. Acrescente o item na vitrine correspondente:

```ts
{ nome: 'Baú 52L', marca: 'Pro Tork', preco: 289, img: bau52 }
```

`preco` é opcional — sem ele o cartão mostra “Consulte o valor”. Com
`precoAntigo` o cartão ganha o selo de desconto automaticamente.

## Estrutura

```
public/              vai direto para a raiz do site
  .htaccess          HTTPS, cache, segurança (ver DEPLOY.md)
  og.jpg             imagem de compartilhamento (WhatsApp, Facebook)
  favicon.*, icon-*  ícones gerados a partir do logo da loja
  site.webmanifest
src/
  assets/img/        fotos extraídas do site atual (otimizadas no build)
  components/        seções da página + Icone.astro (SVGs inline)
  data/              conteúdo e catálogo
    navegacao.ts     menu, submenus e item ativo — fonte única
  layouts/Base.astro <head>, JSON-LD, header/footer, script de revelação
  pages/
    index.astro      home: topo, diferenciais, resumo, 4 ofertas, a loja
    loja.astro       catálogo inteiro (ofertas, acessórios, peças, óleos)
    oficina.astro    serviços, especialidades e como funciona
    contato.astro    canais, horários, endereço e mapa
    404.astro        página de erro, com atalhos e WhatsApp
    robots.txt.ts    gerado no build a partir do SITE_URL
  styles/global.css  tokens de cor, tipografia e utilitários
```

## As quatro páginas

| URL | O que tem |
| --- | --- |
| `/` | Topo, diferenciais, resumo das três áreas, 4 ofertas em destaque, a loja e os depoimentos. |
| `/loja/` | Catálogo completo, com âncora por categoria: `#ofertas`, `#chuva`, `#baus`, `#viseiras`, `#pecas`, `#oleos`. |
| `/oficina/` | Os 6 serviços, as especialidades e os 4 passos do atendimento. |
| `/contato/` | Canais, horários, endereço e mapa. |

O menu sai de `src/data/navegacao.ts` — mexer ali muda o topo, o menu do
celular, o rodapé e os atalhos da 404 de uma vez.

O submenu do desktop abre no passar do mouse **e** ao receber foco pelo
teclado, só com CSS. Enquanto fechado ele usa `invisible`, então os links de
dentro ficam fora da ordem de tabulação até o item de cima ser focado.

Os endereços levam barra no fim (`/loja/`) porque o Astro gera cada página
como diretório. Sem a barra o Apache responde um 301 antes de servir.

## Publicação

Push na `main` compila e publica sozinho. O passo a passo da Hostinger, a
configuração do Git no hPanel e a lista de problemas comuns estão em
[../DEPLOY.md](../DEPLOY.md).

## Decisões que valem saber

- **Todo botão leva ao WhatsApp com a mensagem já escrita**, incluindo o nome e
  o preço do produto ou o serviço a agendar. Era o principal atrito do site
  antigo, que só mostrava fotos sem caminho para comprar.
- **Dados estruturados `MotorcycleRepair`** em `Base.astro` (endereço, horários,
  geolocalização, redes) para aparecer melhor na busca local e no Maps.
- **Nenhuma nota ou média de avaliação é afirmada.** Os dois depoimentos são
  transcrições das avaliações públicas do Google; as estrelas aparecem apenas
  por depoimento, que são de 5 estrelas.
- **A animação de entrada é enfeite.** O estado escondido só é aplicado depois
  que o script confirma que consegue revelá-lo; sem JS, sem
  `IntersectionObserver` ou com `prefers-reduced-motion`, o conteúdo aparece
  normalmente.
- **O mapa é o embed sem chave de API do Google Maps**, com aviso de
  carregamento atrás e botão “Traçar rota” como alternativa.

## Pendências para a loja confirmar

- A página de ofertas do site antigo publica **dois anúncios de “Luva Gutti Fem
  tam. P”** com preços diferentes (R$ 99 e R$ 89). Foram mantidos como estão —
  vale conferir qual é o correto.
- Falta preço de baús, grelhas e viseiras; hoje esses cartões mostram “Consulte
  o valor”.
- O endereço final do site ainda não foi definido. Ele vem da variável
  `SITE_URL` (veja [../DEPLOY.md](../DEPLOY.md)) — comece com o domínio
  provisório da Hostinger e troque quando o domínio próprio estiver ativo.
