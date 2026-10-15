# O Eco do Amanhã · Dragon Games

Jogo MOSAICO publicado em **https://eco-do-amanha.dragongames.dev.br** (GitHub Pages).
Separado do repositório `Dragon` em 14/10/2026 — regra "um jogo = um repositório = um subdomínio"
(ver `documentos/ORGANIZACAO-DRAGON.md` no Dragon).

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
