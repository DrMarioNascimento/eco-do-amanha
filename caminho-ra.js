/* Orienta o percurso existente; nenhuma ação de jogo é executada pela ajuda. */
(function () {
  'use strict';
  var tag = document.currentScript, modo = tag.dataset.guia || '', jogo = tag.dataset.jogo || 'casa';
  var A = window.AssistenciaTela; if(!A) return;
  var v = A.visivel;
  function p(id, rot, txt, alvo) { return {id:id,rot:rot,txt:txt,alvo:alvo,semAlvoOk:true}; }
  function mostrar(id,titulo,passos,auto) { A.definir('caminho:'+jogo+':'+id,passos,{titulo:titulo,dono:'caminho',automatico:auto}); }
  function suspender() { A.suspender('caminho'); }
  function atualizar() {
    if(document.hidden) return;
    if(modo.indexOf('entrada')===0) {
      mostrar(modo,'Antes de entrar',[
        p('escolha','Escolha a sua entrada',modo==='entrada-mesa'?'Jogar A Mesa abre o celular de quem participa. Abrir telão serve apenas para acompanhar a mesma sala na tela grande.':'Jogar começa neste aparelho. Jogar em grupo permite abrir uma sala ou entrar com o código recebido.','.choices'),
        p('acesso','Quem abre e quem entra','Quem conduz abre a sala. Os demais usam o código ou QR dessa sala. Quando o jogo pedir uma conta Google, use uma conta autorizada.'),
        p('caminho','Até a primeira exploração',modo==='entrada-mesa'?'Entre na sala, confirme seu nome e acompanhe a apresentação. As atividades aparecem na ordem da partida. A ajuda de uso da tela continua disponível em cada etapa.':primeira()),
        p('camera','3D e câmera são etapas diferentes','Primeiro abra a peça na tela. Quando houver a opção de RA, use o botão da câmera e autorize o acesso solicitado. Se ela não funcionar, consulte as opções de visualização disponíveis; a ajuda não libera peças bloqueadas.')
      ],false); return;
    }
    if(v('#dgAcesso')||v('#ecoAcesso')||v('#oiAcesso')) {
      mostrar('acesso','Acesso ao jogo',[p('conta','Entrar com uma conta autorizada','O jogo está em testes fechados. Use o botão Entrar com Google com uma conta autorizada. Depois da entrada, a apresentação conduz até a primeira exploração.','#dgAcessoBtn,#ecoAcessoBtn,#oiAcessoBtn')],false);return;
    }
    if(v('#drCode')||v('#drName')) {
      mostrar('identificacao','Entrada na sala',[
        p('codigo','Confira o código','Use o código da sala de quem conduz. Ao entrar por convite, confira o código já preenchido.','#drCode'),
        p('nome','Como a mesa vai chamar você','Preencha o nome que aparecerá nesta partida e escolha a forma de tratamento.','#drName'),
        p('papel','Papel e assistência','O papel cognitivo orienta sua participação na investigação. Livre, Assistida e Guiada mudam o apoio para pensar o caso. A ajuda de uso dos botões continua disponível em todos eles.'),
        p('entrar','Entre e aguarde a mesa','Toque em Entrar. Na sala, acompanhe a preparação e as orientações de quem conduz. A RA aparece quando a atividade correspondente for liberada.','#drEnter')
      ],false);return;
    }
    if(v('#drOpen')||v('#drJoin')) {
      mostrar('porta','Escolha de entrada',[
        p('mestre','Vou conduzir a partida','Use Abrir uma mesa. O aparelho de quem conduz reúne os controles da sala.','#drOpen'),
        p('participante','Recebi um código ou convite','Use Entrar em uma mesa e informe o código recebido. Cada participante joga no próprio aparelho.','#drJoin'),
        p('primeira','O que vem depois','Você confirma sua identificação, entra na sala e acompanha a apresentação. As atividades são liberadas durante a partida. Ajuda da tela explica os controles quando você precisar.')
      ],false);return;
    }
    if(v('#drGoogle')) { mostrar('mestre','Abertura da sala',[p('autorizacao','Conta de quem conduz','Use a conta autorizada para abrir a sala. Depois compartilhe o código ou QR com os participantes.','#drGoogle')],false);return; }
    if(v('#dragonRoomGate')) { mostrar('sala','Preparação da sala',[p('espera','Acompanhe a preparação','Confira os participantes e as orientações na tela. Quem conduz libera o início. Não abra outra sala para tentar avançar.')],false);return; }
    if(v('#abertura')||v('#abCasa')||v('#mosaicoOpening')||v('#mosaicoPrep')||v('#portao')) { suspender(); return; }
    if(modo==='impostor') { impostor();return; }
    if(modo==='objeto') { objeto();return; }
    if(v('#mosaico-ra-app')) {
      mostrar('sala3d','Exploração da casa',[
        p('cena','Explore a sala','Siga a orientação da atividade e toque nos objetos para inspecioná-los. Arrastar a cena não avança esta ajuda.','#mosaico-ra-app'),
        p('modos','Escolha a visualização','Sala 3D mantém a cena na tela. Investigar solicita a câmera quando disponível. Anamorfose tem uma visualização própria; acompanhe a instrução que aparece na tela.','.mosaico-ra-tabs'),
        p('voltar','Retorne à partida','Use Sair para voltar à tela do jogo. A ajuda ensina os controles; as evidências e as decisões continuam com você.','.mosaico-ra-btn-fechar')
      ],false);return;
    }
    // A Mesa tem instruções específicas de cada fase no aprendizado do jogo.
    suspender();
  }
  function primeira() {
    return jogo==='carro'?'No prólogo, abra a aba RA e a planta de evacuação. A planta apresenta a agência; a maquete em 3D é liberada a partir do Capítulo 1.':jogo==='eco'?'No prólogo, abra a aba RA e explore a torre conforme as instruções. Os andares e objetos ficam disponíveis no ritmo da história.':'No prólogo, siga a apresentação até a aba RA e abra a maquete da casa. Explore os controles e acompanhe as instruções da peça.';
  }
  function impostor() {
    if(v('#maqPalco')) return; // A maquete mantém a sua própria ajuda, inclusive ao rever.
    if(v('#telaRA iframe')) { suspender();return; }
    if(v('#telaRA')) {
      mostrar('primeira-peca','Primeira exploração',[
        p('explorar','Siga a instrução da peça','Leia o que a peça está pedindo agora e toque no local indicado. Abrir a aba RA não ativa a câmera automaticamente.','#plantaTarefa'),
        p('retorno','Voltar ao jogo','Use Voltar para retornar à conversa e às outras abas. Você pode reabrir as peças que continuarem disponíveis.','#sairRA')
      ],false);return;
    }
    if(v('#janela')) {
      mostrar('orientacao','Apresentação do jogo',[
        p('ler','Leia esta orientação','Esta janela explica a etapa atual. Entendi continua a apresentação do jogo. A ajuda de uso dos controles pode ser reaberta depois.','#janelaOk'),
        p('ra','Caminho até a RA',primeira())
      ],false);return;
    }
    if(v('dialog[open]')) { suspender(); return; }
    if(v('#v-ra')) {
      mostrar('pecas','Aba RA',[
        p('disponivel','Escolha uma peça disponível',primeira(),'#gradeRA'),
        p('cadeado','O cadeado acompanha a história','As peças bloqueadas são liberadas pelo jogo. Reveja uma peça disponível ou retorne ao Grupo enquanto a história avança.'),
        p('camera','Da peça para a câmera','Na visualização 3D, procure Pôr na mesa ou Ver na sala, quando disponível. Use uma superfície com luz e espaço. Negar a câmera não deve ser confundido com uma peça ainda bloqueada.'),
        p('voltar','Retorne à investigação','Use Voltar para sair da peça e Grupo para retomar a conversa. As descobertas devem ser interpretadas junto com as falas.','[data-aba="grupo"]')
      ],false);return;
    }
    var aba=document.querySelector('.orelha.ativa'), nome=aba?aba.textContent.trim():'Investigação';
    mostrar('abas:'+nome,nome,[
      p('agora','O que fazer agora',nome.indexOf('Privadas')===0?'Escolha uma conversa para ler ou enviar uma mensagem só para aquele contato.':nome.indexOf('Nota')===0?'Consulte suas falas marcadas e registre suas suspeitas. Confira antes de enviar uma decisão.':'Leia a conversa do Grupo e acompanhe as orientações da história. As outras abas organizam sua investigação.'),
      p('abas','Cada aba tem uma função','Grupo reúne a conversa; Privadas reúne as conversas individuais; Nota guarda suas anotações e suspeitas.','.orelhas'),
      p('ra','Encontrar as peças',primeira(),'[data-aba="ra"]'),
      p('tempo','Tempo, envios e ajuda','O prólogo é uma apresentação sem relógio. Nos capítulos, observe tempo e envios no alto. Abrir esta ajuda não pausa a partida. Como jogar reúne as regras.','#infoBtn')
    ],false);
  }
  function objeto() {
    if(v('#portal')||v('dialog#portal-ra')) {
      mostrar('portal','Preparar a exploração',[
        p('superficie','Prepare o espaço','Escolha uma superfície plana e iluminada. Ao abrir a RA, autorize a câmera quando o navegador solicitar. Mova o celular devagar para reconhecer o espaço.','button#portal-ra,#ra-entrar'),
        p('alternativa','Se a câmera não abrir','Confira a permissão de câmera do navegador. Use a opção de continuar na tela, quando disponível, ou Voltar à escolha para tentar novamente.','#portal-mesa,#ra-tela')
      ],false);return;
    }
    if(v('dialog[open]')) { suspender();return; }
    mostrar('objeto:'+location.pathname,'Exploração 3D / RA',[
      p('gestos','Observe e explore','Na tela, arraste para girar e use dois dedos para aproximar. Na câmera, mova o celular com cuidado ao redor da peça. Toque nos detalhes para examinar.','#scene'),
      p('orientacao','Sua próxima ação','Leia a orientação da etapa. As instruções do caso e a ajuda de uso da tela têm funções diferentes. Esta ajuda não indica a solução.','.instruction'),
      p('camera','Posicionar ou tentar novamente','Use Reposicionar se precisar mudar a posição da maquete. Voltar à escolha retorna às opções de visualização.','#reposition'),
      p('retorno','Continuar a partida','Use o controle de retorno da atividade. Se a peça abriu em outra aba, retorne à aba da partida. Não recarregue a página para sair da RA.')
    ],false);
  }
  atualizar(); setInterval(atualizar,700);
})();
