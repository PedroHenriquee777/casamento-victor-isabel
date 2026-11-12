# Convite de Casamento — Victor & Isabel

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Prisma 7 (PostgreSQL) · zod.

## Rodando agora (modo demonstração, sem banco)

```bash
npm install
npm run dev
```

Sem `DATABASE_URL`, o app usa um repositório em memória com convidados de exemplo
(os dados reiniciam quando o servidor reinicia). Abra:

| Link | O que testa |
|---|---|
| `/c/demo-convidado` | Convidado comum |
| `/c/demo-sozinho` | Outro convidado comum |
| `/c/demo-padrinho` | Padrinho — mensagem, orientações e vestimenta próprias |
| `/c/demo-madrinha` | Madrinha — idem, no feminino |
| `/c/demo-outro-convidado` | Para testar presentes já escolhidos por outra pessoa (Liquidificador esgotado e Jogo de panelas com 1 de 2 vagas) |

A página `/` lista os quatro primeiros em desenvolvimento (ou com `SHOW_DEMO_LINKS=true`).
Em produção sem `DATABASE_URL`, desligue a demo definindo o banco — os tokens demo só existem no modo memória.
Qualquer token inexistente cai em uma página 404 elegante.

## Personalizando o conteúdo

Tudo que é texto/data/local/presente está em **`src/lib/wedding-config.ts`**:
nomes, data e fuso, local, endereço, `mapMode` (mapa ilustrado ou Google embed; no ilustrado,
`streetLabel` é a rua escrita no mapa, `marker: "church"` troca o pino por uma igrejinha e as
coordenadas `lat`/`lng` aparecem no rodapé do mapa e definem a rota do Google Maps),
horários, informações importantes, mensagens dos padrinhos, presentes.

Com banco, o conteúdo da tabela `Wedding` (`content` JSON) e os presentes (`Gift`)
passam a valer; o `wedding-config.ts` alimenta o `db:seed`.

### Painel dos noivos (`/admin`)

Página só de leitura para os noivos acompanharem as respostas, dentro do mesmo projeto:
- **Padrinhos e madrinhas**: quem aceitou, recusou ou ainda não respondeu, e os presentes de cada um;
- **Convidados**: quem confirmou presença e quais presentes escolheu (e, em listas recolhidas, quem
  não poderá ir e quem ainda não respondeu);
- **Presentes**: cada item com as vagas ocupadas e o nome de quem escolheu.

Para ativar, defina `ADMIN_PASSWORD` no `.env` (sem ela o painel fica desativado) e reinicie o servidor.
Acesse `https://seu-site/admin`, entre com a senha e use **Atualizar** para ver as respostas mais recentes.
O acesso usa um cookie assinado (12 h) e limita tentativas de senha por IP; a página não é indexada.

### Lista de presentes (livro interativo)

A lista fica em `GIFT_LIST` (`src/lib/wedding-config.ts`): `[id, nome, categoria, ícone, quantidade]`.
- **Quantidade** = quantas pessoas *diferentes* podem escolher o presente (cada escolha é uma reserva
  individual). Ao chegar no limite o presente aparece como **Esgotado** e ninguém mais consegue marcá-lo.
- **Categoria** agrupa os presentes nas páginas do livro; as páginas são distribuídas de forma
  equilibrada conforme o tamanho da tela.
- **Ícone** (`imageUrl: "glyph:<nome>"`): ilustração desenhada em SVG (`src/components/book/GiftGlyph.tsx`).
  Para usar uma foto no lugar, coloque o arquivo em `public/gifts/` e use `imageUrl: "/gifts/arquivo.jpg"`
  (ou uma URL completa) no seed/tabela `Gift`.
- O limite de presentes por pessoa (`maxGiftsPerGuest`, hoje 2) continua valendo.
- Navegação do livro: botões ‹ ›, arrastar a folha, setas do teclado (← →) ou PageUp/PageDown.
  Com *reduzir movimento* ativo no sistema, as animações viram trocas instantâneas.

## Banco de dados (PostgreSQL + Prisma)

```bash
cp .env.example .env              
npm run db:migrate -- --name init 
npm run db:seed                   

```

Modelo (`prisma/schema.prisma`): `Wedding`, `Guest` (token único, tipo
`GUEST`/`GODPARENT`, papel), `Rsvp`, `Gift` (categoria, quantidade), `GiftReservation`.
O `postinstall` roda `prisma generate`.

> **Já tinha um banco da versão anterior?** Esta versão removeu os acompanhantes
> (`Companion`, `Guest.maxCompanions`) e o campo `Gift.exclusive`, e adicionou `Gift.category`.
> Rode `npm run db:migrate -- --name lista_presentes_livro` (confirme a remoção das colunas/tabela
> de acompanhantes, que perde esses dados) e depois `npm run db:seed`. O seed **substitui a lista de
> presentes antiga pela nova** (presentes que não estão na lista, e as reservas deles, são removidos).

Regras garantidas no servidor (`src/lib/rsvp-rules.ts` + repositório Prisma):
- quem responde que **não vai comparecer** não escolhe presentes (o app pula o livro e o servidor
  descarta qualquer presente enviado e libera as reservas anteriores daquela pessoa);
- presentes por convidado ≤ `maxGiftsPerGuest`;
- cada presente tem `quantity` vagas; uma vaga ocupada nunca é dada a outra pessoa
  (garantido no banco: `slotKey` único por vaga, transação Serializable com retry —
  vários convidados escolhendo ao mesmo tempo nunca ultrapassam o limite);
- reenviar o RSVP substitui a resposta anterior daquele convidado.

## Importar convidados e gerar os links

1. Crie um CSV (separador `;` ou `,`) com cabeçalho `nome;tipo;papel;telefone`
   (`tipo`: `convidado` ou `padrinho`; `papel`: `padrinho` ou `madrinha`, só para padrinhos;
   telefone com DDI+DDD, ex. `5521999990000`; colunas extras, como o antigo `acompanhantes`, são ignoradas).
2. `npm run guests:import -- caminho/convidados.csv`
3. O script cria os convidados com tokens aleatórios e gera `links-convidados.csv`
   com o link individual e um link `wa.me` já com a mensagem pronta para WhatsApp
   (o arquivo está no `.gitignore`: contém dados pessoais).

Rodar o import de novo é seguro: quem já existe (mesmo nome) é atualizado e **mantém o mesmo link**.
Para conferir o que está no banco e recuperar os links a qualquer momento: `npm run guests:list`
(mostra em qual banco está agindo, quantos convidados existem e quem já abriu/respondeu).

Cada convidado recebe `https://SEU-DOMINIO/c/<token>`. O tipo de convite (comum ou
padrinhos) vem do cadastro, não do link — não há como um convidado "trocar de modalidade".

### "Convite não encontrado"?

O token do link não existe no banco **que o servidor está usando**. Confira, nesta ordem:
1. `npm run guests:list` — se der 0 convidados, falta `npm run guests:import -- arquivo.csv`.
2. Os links `/c/demo-*` só existem com `SEED_DEMO_GUESTS=true npm run db:seed` (ou sem banco, em modo memória).
3. O servidor precisa ter `DATABASE_URL` (reinicie `npm run dev` / `npm start` depois de editar o `.env`;
   em hospedagem, defina a variável no painel). O log do servidor diz qual é o caso:
   `[convite] token "…" não encontrado — app em MODO DEMONSTRAÇÃO` ou `— não existe na tabela guests`.
4. O banco do `guests:import` e o do servidor devem ser o mesmo (os scripts imprimem `Banco: host:porta/nome`).

## Prévia no WhatsApp

`src/app/opengraph-image.png` (1200×630) é a imagem do link; o título usa o nome do
convidado. Regenere com `npm run art` (precisa de Playwright instalado; o resultado
já está versionado em `public/art/` e não é necessário para rodar o app).

## Estrutura

```
src/components/invitation/   capa, selo, portas 3D, moldura, controles, gestos, fluxo do RSVP
src/components/pages/        as 7 páginas (+ orientações dos padrinhos) e o registry
src/components/ornaments/    ícones, divisores, cartuchos, mapa ilustrado
src/components/book/         livro de presentes (capa, folhas 3D, paginação, ícones)
src/lib/                     config, regras, validação, repositórios (memória/Prisma)
src/app/api/                 POST /api/rsvp · GET /api/invite/[token]
scripts/                     importação de convidados e geração da arte
```

Toda a composição usa uma unidade fluida (`--u`) baseada na largura da folha
(máx. 460 px) e na altura da tela, então o layout se mantém de 360×640 a desktop.
