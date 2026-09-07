# new-moto-point

Redesenho do site da **New Moto Point** — peças, acessórios e oficina de motos
na Av. Farrapos, 1255, Porto Alegre/RS.

| | |
| --- | --- |
| [`design/`](design/README.md) | O site novo: Astro 7 + Tailwind 4, estático, sem JavaScript de runtime. |
| [`DEPLOY.md`](DEPLOY.md) | Como publicar na Hostinger (GitHub Actions compila, branch `deploy` vira o `public_html`). |
| `.github/workflows/deploy.yml` | Build e publicação automáticos a cada push na `main`. |

As imagens na raiz são as referências visuais usadas como inspiração.

## As três versões

Mesmo conteúdo, mesmos dados, mesma stack — três linguagens visuais. Cada uma
vive na sua branch:

| Branch | Nome | Cara |
| --- | --- | --- |
| `main` | Versão 1 | Grafite escuro, vermelho chapado, Barlow Condensed. |
| `versao-2-asfalto` | Versão 2 | Preto puro, vermelho em gradiente, cortes na diagonal, Montserrat 900. |
| `versao-3-editorial` | Versão 3 | Papel creme, âmbar, serifa Playfair, listas em fio de régua. |

### Trocando de versão

As três branches declaram as mesmas dependências, então trocar de versão não
exige reinstalar nada:

```bash
git checkout versao-2-asfalto
cd design
npm run dev     # http://localhost:4321
```

O `package.json` fica em **`design/`**, não na raiz do repositório — rodar
`npm install` na raiz dá `ENOENT: package.json`.

> Cada versão importa uma fonte de título diferente, mas as três a declaram no
> `package.json` de propósito. Antes, trocar de branch sem reinstalar parava o
> build num `Can't resolve '@fontsource/...'` que não dizia o que fazer. A
> fonte que o `global.css` não importa não entra no build.

## Rodando

```bash
cd design
npm install
cp .env.example .env    # e ajuste SITE_URL
npm run dev             # http://localhost:4321
```
