# Publicar na Hostinger

O site é estático: o servidor só entrega arquivos, sem PHP nem banco. Roda em
qualquer plano de hospedagem compartilhada da Hostinger.

## Como funciona

A hospedagem compartilhada da Hostinger **clona um branch do Git, mas não
compila nada** — não há Node no servidor para rodar `npm run build`. Por isso o
fluxo separa as duas coisas:

```
você dá push em  main          (código-fonte: design/src, design/public…)
        │
        ▼
GitHub Actions                 npm ci → astro check → npm run build
        │
        ▼
branch  deploy                 SÓ o conteúdo de design/dist, na raiz do branch
        │
        ▼
Hostinger (git pull)           clona/atualiza o branch dentro de public_html
```

O branch `deploy` nunca recebe código-fonte — só o HTML, o CSS, as imagens já
convertidas em WebP e o `.htaccess`. É o branch que fica exposto na web.

O workflow está em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

---

## Configuração inicial (uma vez)

### 1. Definir o endereço do site no GitHub

O build precisa saber o endereço final para gerar a URL canônica, o
`sitemap.xml`, o `robots.txt` e as tags de compartilhamento do WhatsApp.

No GitHub: **Settings → Secrets and variables → Actions → aba Variables →
New repository variable**

| Campo | Valor |
| --- | --- |
| Name | `SITE_URL` |
| Value | `https://seusite.hostingersite.com` |

Use primeiro o endereço provisório que a Hostinger mostra no hPanel. Quando o
domínio próprio estiver ativo, volte aqui e troque — o workflow reconstrói o
site com o endereço novo.

> Sem essa variável o workflow falha de propósito, com a mensagem dizendo o que
> fazer. É melhor falhar do que publicar um site com URL canônica errada.

### 2. Gerar o branch `deploy`

Dê push na `main` (ou rode o workflow à mão em **Actions → Publicar na
Hostinger → Run workflow**). Ao terminar, o branch `deploy` existe com os
arquivos do site na raiz. Confira em **Code → alternar branch → deploy**: você
deve ver `index.html`, `_astro/`, `og.jpg` e nada de `src/`.

### 3. Ligar o Git no hPanel

No hPanel: **Avançado → GIT** (em alguns planos aparece como *Git Version
Control*).

| Campo | Valor |
| --- | --- |
| Repositório | `https://github.com/NeoFahrenheit/new-moto-point.git` |
| Branch | `deploy` |
| Diretório | deixe **vazio** para instalar na raiz do `public_html` |

Depois clique em **Criar**.

Dois detalhes que costumam travar aqui:

- **O `public_html` precisa estar vazio.** Se já houver arquivos (o
  `default.php` que vem de fábrica, por exemplo), apague pelo Gerenciador de
  Arquivos antes de criar o repositório.
- **Se o repositório do GitHub for privado**, a URL HTTPS não autentica. O
  hPanel mostra uma chave SSH pública na tela do Git: copie e adicione no
  GitHub em **Settings → Deploy keys → Add deploy key** (sem permissão de
  escrita). Aí use a URL SSH: `git@github.com:NeoFahrenheit/new-moto-point.git`.

### 4. Ligar o deploy automático

Ainda na tela do Git no hPanel, ative **Auto Deployment** e copie a URL de
webhook que ela gera.

No GitHub: **Settings → Webhooks → Add webhook**

| Campo | Valor |
| --- | --- |
| Payload URL | a URL copiada do hPanel |
| Content type | `application/json` |
| Eventos | *Just the push event* |

A partir daí: push na `main` → o Actions compila e atualiza a `deploy` → o
webhook avisa a Hostinger → o `public_html` é atualizado. Sem passo manual.

### 5. Primeiro deploy e SSL

Na tela do Git no hPanel, clique em **Deploy** para puxar a primeira vez. Abra
o site no endereço provisório e confira se carrega.

Depois de apontar o domínio, instale o certificado em **Segurança → SSL**. Só
faça isso *depois* do domínio resolver, senão a emissão falha.

---

## Rotina do dia a dia

Mudar preço, adicionar produto ou trocar texto:

1. Edite o arquivo em `design/src/data/` (veja [design/README.md](design/README.md)).
2. `git commit` e `git push` na `main`.
3. Acompanhe em **Actions**. Em ~1 minuto está no ar.

Para conferir antes de publicar:

```bash
cd design
npm run dev       # http://localhost:4321
npm run build && npm run preview   # confere o resultado final
```

---

## Domínio com ou sem www

Duas coisas precisam concordar, senão o site responde nos dois endereços e o
Google divide a autoridade entre eles:

| Onde | O que ajustar |
| --- | --- |
| Variável `SITE_URL` no GitHub | `https://newmotopoint.com.br` **ou** `https://www.newmotopoint.com.br` |
| `design/public/.htaccess` | bloco **OPÇÃO A** (sem www, é o ativo) ou **OPÇÃO B** (com www) |

O arquivo tem as duas opções comentadas, com instrução de qual linha trocar.

---

## O que o `.htaccess` já resolve

Ele está em `design/public/.htaccess` e é copiado para a raiz do site no build.

- Redireciona HTTP → HTTPS e unifica o domínio (com ou sem www)
- **Bloqueia o acesso web ao `.git`** — obrigatório, porque o deploy por Git
  deixa a pasta `.git` dentro do `public_html`. Sem isso o histórico do
  repositório fica baixável pela internet.
- Cache de 1 ano para `/_astro/` (os arquivos têm hash no nome, então trocar o
  conteúdo troca o nome) e revalidação imediata do HTML — o visitante nunca
  pega uma página velha apontando para um CSS que não existe mais
- Compressão gzip de HTML, CSS, JS, SVG e XML
- `404.html` como página de erro
- Cabeçalhos de segurança: `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `X-Frame-Options`
- Desliga a listagem de diretórios

---

## Publicar uma versão numa subpasta

As versões de avaliação convivem no mesmo domínio, cada uma na sua pasta
(`/asfalto/`, `/editorial/`). Nesse caso o build precisa saber a pasta, senão
o menu aponta para a raiz do domínio e o visitante cai na versão errada:

```bash
cd design
npm install
SITE_URL=https://newmotopoint.umbrastudio.com.br BASE_PATH=editorial npm run build
```

O conteúdo de `dist/` vai para `public_html/editorial/` — a pasta do
`BASE_PATH` é onde o site é servido, não uma pasta a mais dentro do `dist/`.

| Versão | Branch | `BASE_PATH` | Destino |
| --- | --- | --- | --- |
| 1 — Grafite | `main` | *(vazio)* | `public_html/` |
| 2 — Asfalto | `versao-2-asfalto` | `asfalto` | `public_html/asfalto/` |
| 3 — Editorial | `versao-3-editorial` | `editorial` | `public_html/editorial/` |

Duas ressalvas enquanto as três versões estiverem no ar juntas:

- **Conteúdo repetido.** São três cópias do mesmo texto no mesmo domínio. Para
  a escolha final não atrapalhar a busca, o ideal é bloquear as pastas de
  avaliação no `robots.txt` da **raiz** (`Disallow: /asfalto/` e
  `Disallow: /editorial/`) — o `robots.txt` de dentro da subpasta é ignorado
  pelos buscadores.
- **O `.htaccess` da raiz vale para todas.** Não é preciso repetir um em cada
  subpasta.

---

## Problemas comuns

| Sintoma | Causa provável |
| --- | --- |
| Workflow falha com "A variável SITE_URL não está definida" | Faltou o passo 1. É variável (*Variables*), não segredo (*Secrets*). |
| hPanel não deixa criar o repositório | `public_html` não está vazio, ou o repositório é privado e falta a Deploy key. |
| Site publicado mostra `SEU-DOMINIO-AQUI` no código | Build rodou sem `SITE_URL`. Confira a variável e rode o workflow de novo. |
| Alterei e o site não mudou | Veja se o Actions passou; depois clique em **Deploy** no hPanel para forçar o pull. Se persistir, é cache do navegador (`Ctrl+Shift+R`). |
| Aparece `/src/` ou `package.json` no site | A Hostinger está apontada para a `main` em vez da `deploy`. Corrija o branch na tela do Git. |
| Numa subpasta, o menu leva para a outra versão | O build rodou sem `BASE_PATH`. Refaça com `BASE_PATH=editorial` (ou `asfalto`). |
| Numa subpasta, o CSS e as imagens dão 404 | Mesma causa: sem `BASE_PATH` o site procura os arquivos na raiz do domínio. |
| CSS ou fontes não carregam | Confira se o `.htaccess` chegou na raiz do `public_html` (é arquivo oculto — ligue "mostrar arquivos ocultos" no Gerenciador de Arquivos). |
| Miniatura errada ao compartilhar no WhatsApp | O WhatsApp guarda a prévia em cache por bastante tempo. Teste em https://developers.facebook.com/tools/debug/ e use "Scrape Again". |
