# New Moto Point

Site institucional da **New Moto Point**, loja de peças, acessórios e oficina
para motos em Porto Alegre/RS. O projeto foi redesenhado para oferecer uma
experiência rápida no celular e facilitar o contato direto pelo WhatsApp.

## Visão geral

- Catálogo de peças, acessórios e ofertas
- Serviços da oficina com atalhos para agendamento
- Dados de contato, horários, localização e rota no Google Maps
- Links de WhatsApp com mensagens prontas para cada produto ou serviço
- SEO local, dados estruturados e imagem de compartilhamento
- Site estático, com pequenos scripts de interação e sem servidor de aplicação

## Tecnologias

O site fica na pasta [`design/`](design/) e usa:

- [Astro](https://astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- TypeScript
- `astro:assets` para otimização de imagens e imagens responsivas

## Desenvolvimento local

Pré-requisito: Node.js 22.12 ou superior.

```bash
cd design
npm install
cp .env.example .env
npm run dev
```

O servidor de desenvolvimento fica disponível em `http://localhost:4321`.

Para validar e gerar a versão de produção:

```bash
cd design
npx astro check
npm run build
npm run preview
```

Defina `SITE_URL` no arquivo `design/.env` para gerar URL canônica, sitemap,
`robots.txt` e metadados de compartilhamento com o endereço final do site.

## Atualização de conteúdo

Os dados da loja e o catálogo ficam centralizados em `design/src/data/`:

| Arquivo | Conteúdo |
| --- | --- |
| [`site.ts`](design/src/data/site.ts) | Contatos, endereço, horários, redes sociais e links do WhatsApp |
| [`catalogo.ts`](design/src/data/catalogo.ts) | Produtos, ofertas e preços |
| [`servicos.ts`](design/src/data/servicos.ts) | Serviços, diferenciais e depoimentos da oficina |

As fotos de produtos ficam em `design/src/assets/img/`. Para cadastrar uma
nova foto, adicione-a na categoria adequada, importe-a em `catalogo.ts` e
inclua o item na vitrine desejada.

## Publicação

Este fork, [`MaiconKevyn/new-moto-point`](https://github.com/MaiconKevyn/new-moto-point),
é usado para publicar pela integração de aplicações Node.js da Hostinger.
O projeto original permanece em
[`NeoFahrenheit/new-moto-point`](https://github.com/NeoFahrenheit/new-moto-point).

Configuração no hPanel:

| Opção | Valor |
| --- | --- |
| Repositório | `MaiconKevyn/new-moto-point` |
| Branch | `main` |
| Framework | Astro |
| Node.js | 24.x |
| Diretório raiz | `design` |
| Gerenciador de pacotes | npm |
| Comando de build | `npm run build` |
| Diretório de saída | `dist` |
| Variável `SITE_URL` | `https://dimgrey-bat-359770.hostingersite.com` |

A Hostinger executa `npm run build` na `main`. Esse comando compila a versão
principal e busca as duas branches do fork para compilar os outros layouts:

| Branch no fork | Endereço |
| --- | --- |
| `main` | [Versão original](https://dimgrey-bat-359770.hostingersite.com/) |
| `versao-2-asfalto` | [Asfalto](https://dimgrey-bat-359770.hostingersite.com/asfalto/) |
| `versao-3-editorial` | [Editorial](https://dimgrey-bat-359770.hostingersite.com/editorial/) |

As três versões usam uma única aplicação da Hostinger. Cada uma mantém seus
próprios estilos, fontes, imagens, sitemap e caminhos de navegação. O build
requer Git e acesso ao GitHub e ao npm; cada branch instala suas dependências
com `npm ci`. Os commits das versões adicionais ficam registrados em
`dist/versions.json`.

Novos pushes na `main` geram uma publicação automática. Depois de alterar
`versao-2-asfalto` ou `versao-3-editorial`, use **Redeploy** no hPanel: o build
da `main` buscará as versões mais recentes das duas branches. Alterações no
repositório original precisam ser sincronizadas com o fork primeiro.

Para compilar apenas o frontend do checkout atual, use `npm run build:single`
na `main` ou `npm run astro -- build` em qualquer uma das branches.

Ao adotar um domínio próprio, atualize `SITE_URL` no hPanel e publique novamente.

O arquivo [DEPLOY.md](DEPLOY.md) e o workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) descrevem o fluxo
alternativo de Git clássico com uma branch `deploy`. Eles não são necessários
para a publicação direta pela integração Node.js configurada neste fork.

## Estrutura do repositório

```text
.
├── design/                 # Aplicação Astro
│   ├── public/             # Ícones, OG image e regras do Apache
│   └── src/
│       ├── assets/img/     # Fotos do catálogo e da marca
│       ├── components/     # Seções e componentes da página
│       ├── data/           # Conteúdo editável
│       └── pages/          # Páginas e robots.txt
├── .github/workflows/      # Build e deploy automáticos
└── DEPLOY.md               # Manual de publicação
```
