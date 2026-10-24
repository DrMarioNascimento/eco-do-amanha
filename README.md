# O Eco do Amanhã · Dragon Games

## Disponibilidade e novidades — 24 de outubro de 2026

**O Eco do Amanhã permanece em testes fechados.** A página de apresentação não constitui liberação geral da atividade. A condução e a participação seguem os controles e convites do projeto. A abertura pública do Eita! e dos recursos educacionais do portfólio não altera este estágio nem as condições de uso desta obra.

Mantida a autoria conjunta de **Mário César Nascimento e Osana Melo Nascimento**.

[Ver todos os recursos públicos](https://www.drmarionascimento.com.br/#acesso-publico). O acesso respeita [LICENSE.md](LICENSE.md).

## Contexto técnico — registro de 19 de outubro de 2026

O Eco do Amanhã é mantido neste repositório, com entrada em `index.html` e experiência O Impostor em `o-impostor/`. O portal Dragon apresenta o projeto e preserva material da organização anterior. Antes de publicar alterações, execute `npm test` e confira os caminhos das mídias locais. A disponibilidade de páginas de apresentação não abre a participação externa.

## Desenvolvimento e acesso

Os jogos estão em diferentes etapas de desenvolvimento, teste e aperfeiçoamento e ainda não foram lançados ao público. Nesta fase, os testes são realizados internamente, sem participação externa.

Enquanto os jogos estiverem em desenvolvimento, regras, interfaces e funcionalidades poderão mudar. Algumas páginas poderão apresentar demonstrações do projeto, mas isso não significa que os jogos estejam disponíveis para participação do público.

Mário César Nascimento estuda **Game Design e desenvolvimento de jogos**. Estes projetos acompanham esse percurso de formação e experimentação. As autorias e condições de uso de cada projeto estão identificadas em [LICENSE.md](LICENSE.md).

**Development status:** internal testing only; external participation is not open. Demonstration pages do not constitute a public game launch. Rules, interfaces and features may change.


Projeto MOSAICO em desenvolvimento, com endereço oficial em **https://eco-do-amanha.dragongames.dev.br** (GitHub Pages).
Separado do repositório `Dragon` em 14/10/2026 — regra "um jogo = um repositório = um subdomínio"
(ver [organização dos jogos](https://github.com/DrMarioNascimento/Dragon/blob/main/documentos/ORGANIZACAO-DRAGON.md)).

| Endereço | Conteúdo | Origem no Dragon |
|---|---|---|
| `/` | apresentação do jogo | — |
| `/o-impostor/` | entrada do Impostor; jogo em `/o-impostor/mesa.html` | `historias/o-eco-do-amanha/o-impostor/` + `jogos/o-eco-do-amanha/o-impostor/` |

Arquivos comuns copiados do Dragon (cópia própria deste jogo): `firebase-room.js`, `papel-camada.js`, `brand/`.
A RA, o QR e o three.js já moravam dentro do jogo, em `o-impostor/lib/`.

Firebase: projeto `vestchip` — o mesmo de antes.
O domínio `eco-do-amanha.dragongames.dev.br` precisa estar em *Authentication → Domínios autorizados*.

Atenção: `o-impostor/media/abertura.mp4` tem 99 MB, perto do limite de 100 MB por arquivo do GitHub.

Testes: `npm test` (integridade dos caminhos).

## Autoria e licença

Criação de **Mário César Nascimento e Osana Melo Nascimento**. As condições do projeto de origem Dragon/MOSAICO acompanham esta separação em [LICENSE.md](LICENSE.md); as licenças e os créditos de terceiros permanecem nos respectivos arquivos.

Portal Dragon Games: https://dragongames.dev.br/
