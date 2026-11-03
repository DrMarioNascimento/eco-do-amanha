# Assistência de telas — 3 de novembro de 2026

O percurso de entrada apresenta a diferença entre participação, condução e telão, quando aplicável. A ajuda contextual permanece acessível durante o jogo e nas peças 3D/RA.

- Voltar, Próximo, Entendi e Agora não controlam a leitura. Gestos de exploração não avançam o guia.
- A leitura não tem prazo e só é marcada ao confirmar. Reabrir a ajuda permite rever os passos.
- O destaque acompanha o controle. A página não é rolada automaticamente pela ajuda; Mostrar controle é uma ação explícita.
- Os três Impostores preservam a posição de leitura ao receber mensagens. Quem já está perto do fim continua acompanhando as novas falas.
- Carro-Forte distingue a planta do prólogo da maquete liberada no Capítulo 1.
- Ajuda de uso não altera pistas, pontuação, cronômetros, acesso ou decisões. O relógio da partida continua valendo.

## Verificação

`npm ci && npm test` executa integridade de caminhos, carregamento sob demanda de RA e os testes de comportamento da assistência. A dependência jsdom é somente de desenvolvimento; não é carregada pelo jogo.

A prévia foi inspecionada em navegador, incluindo quadros de 360 e 390 px, navegação da ajuda, recolhimento e reabertura. A partida autenticada completa e a câmera em iPhone/Android físicos permanecem pendentes de validação. Não houve alteração das regras de acesso.
