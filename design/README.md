# New Moto Point — versão 3 (“Editorial”)

Terceira proposta visual para o site da **New Moto Point**, loja de peças,
acessórios e oficina de motos na Av. Farrapos, 1255 — Bairro Floresta, Porto
Alegre/RS.

Mesmo conteúdo e mesma stack das outras versões. O que muda é a linguagem
visual: fundo de papel, serifa editorial, âmbar no lugar do vermelho e listas
em fio de régua.

## O que diferencia esta versão

| | `main` (v1) | `versao-2-asfalto` | `versao-3-editorial` |
| --- | --- | --- | --- |
| Base | grafite escuro | preto puro | **papel creme** |
| Acento | vermelho chapado | vermelho em gradiente | **âmbar** |
| Título | Barlow Condensed, caixa alta | Montserrat 900, caixa alta | **Playfair Display, caixa normal** |
| Ênfase | palavra em vermelho | palavra em vermelho | **palavra em itálico âmbar** |
| Cantos | arredondados | retos | **pílula (botões redondos)** |
| Ritmo | seções escuras | cortes diagonais | **faixas alternadas papel/tinta** |

Blocos que só existem aqui, vindos da referência: a **abertura com foto
atravessando a borda** entre o preto e o papel, a **lista de serviços em fio de
régua** com botão redondo de seta, a **lista de especialidades dividida em
torno de uma foto torta** e os **depoimentos como cartões de papel** sobre a
faixa preta.

## Stack

| Peça | Escolha | Motivo |
| --- | --- | --- |
| Framework | **Astro 7** | Site estático: HTML pronto no servidor, ótimo para SEO local e para celular. |
| Estilo | **Tailwind CSS 4** | Tokens de marca no `@theme`, sem arquivo de config. |
| Tipografia | **Playfair Display + Inter** (Fontsource) | Auto-hospedadas — sem requisição ao Google Fonts. |
| Imagens | `astro:assets` | WebP + `srcset` responsivo gerados no build. |
| Linguagem | TypeScript | `astro check` sem erros. |

O site publicado **não carrega nenhum arquivo JavaScript**: os dois scripts
(menu do celular e revelação ao rolar) são pequenos e ficam embutidos no HTML.

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

### Publicar numa subpasta

Na raiz do domínio não há nada a fazer. Para publicar dentro de uma pasta —
é o caso das versões de avaliação, que convivem no mesmo domínio — informe a
pasta no build:

```bash
SITE_URL=https://newmotopoint.umbrastudio.com.br BASE_PATH=editorial npm run build
```

O conteúdo de `dist/` vai para `public_html/editorial/`. Sem o `BASE_PATH` o
menu aponta para a raiz do domínio e o visitante cai na outra versão do site.

> No Git Bash do Windows escreva `BASE_PATH=editorial`, sem a barra inicial:
> um valor começando com `/` é convertido em caminho de disco antes de chegar
> ao Node e o build quebra.

> Cada versão usa uma fonte de título diferente, mas as três declaram as três
> fontes no `package.json`. É de propósito: assim as dependências são iguais
> nas três branches e trocar de versão **não exige `npm install` de novo** —
> antes disso, quem trocava sem reinstalar batia num erro de `.css` de fonte
> que não explicava nada. A fonte que não é importada no `global.css` não entra
> no build: o `dist/` sai do mesmo tamanho.

## Onde mexer no conteúdo

Os dados são exatamente os mesmos das outras versões — trocar de branch não
exige reescrever nada de conteúdo:

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
    Especialidades.astro  lista dividida em torno da foto torta
    Servicos.astro        lista de serviços em fio de régua
    Numeros.astro         números da loja + diferenciais
  data/              conteúdo e catálogo
    navegacao.ts     menu, submenus e item ativo — fonte única
  layouts/Base.astro <head>, JSON-LD, header/footer, script de revelação
  pages/
    index.astro      home: topo, números, resumo, 4 ofertas, a loja
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
| `/` | Topo, números da loja, diferenciais, resumo das três áreas, 4 ofertas em destaque, a loja e os depoimentos. |
| `/loja/` | Catálogo completo, com âncora por categoria: `#ofertas`, `#chuva`, `#baus`, `#viseiras`, `#pecas`, `#oleos`. |
| `/oficina/` | Os 6 serviços em fio de régua, as especialidades e os 4 passos do atendimento. |
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

> Para publicar **esta** versão em vez da `main`, ajuste o gatilho do workflow
> em `.github/workflows/deploy.yml` (a lista `branches:`) ou faça o merge desta
> branch na `main`.

## Decisões que valem saber

- **Todo botão leva ao WhatsApp com a mensagem já escrita**, incluindo o nome e
  o preço do produto ou o serviço a agendar. Na lista de serviços, a linha
  inteira é clicável — por isso o botão redondo é `<span>`, e não um segundo
  link dentro do primeiro.
- **Dados estruturados `MotorcycleRepair`** em `Base.astro` (endereço, horários,
  geolocalização, redes) para aparecer melhor na busca local e no Maps.
- **Nenhuma nota ou média de avaliação é afirmada.** Os dois depoimentos são
  transcrições das avaliações públicas do Google; as estrelas aparecem apenas
  por depoimento, que são de 5 estrelas.
- **A foto da abertura atravessa a borda com margem negativa**, não com altura
  fixa: o tamanho da faixa preta vem do texto, então nada é cortado se a
  manchete quebrar em mais linhas.
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
  `SITE_URL` (veja [../DEPLOY.md](../DEPLOY.md)).
