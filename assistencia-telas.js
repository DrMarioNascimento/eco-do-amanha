/* Assistência de uso da tela. Não altera pistas, tempo, permissões ou fases. */
(function (global) {
  'use strict';
  if (global.AssistenciaTela) return;
  var atual = null, indice = 0, aberto = false, focoAnterior = null, quadro = 0;
  var memoria = {}, dispensados = {}, raiz, painel, resumo, anel, titulo, texto, contador, voltar, seguir, localizar;
  function ler(chave) { try { var valor=JSON.parse(localStorage.getItem('tela-guia:v2:' + chave) || '{}'); return valor && typeof valor==='object' ? valor : {}; } catch (_) { return memoria[chave] || {}; } }
  function guardar(chave, valor) { memoria[chave] = valor; try { localStorage.setItem('tela-guia:v2:' + chave, JSON.stringify(valor)); } catch (_) {} }
  function elemento(alvo) { try { return typeof alvo === 'function' ? alvo() : typeof alvo === 'string' ? document.querySelector(alvo) : alvo; } catch (_) { return null; } }
  function visivel(alvo) {
    var e = elemento(alvo); if (!e || !e.isConnected || e.closest('[hidden]')) return false;
    var r = e.getBoundingClientRect(), s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
  }
  function no(tag, classe, conteudo) { var e = document.createElement(tag); e.className = classe || ''; if (conteudo) e.textContent = conteudo; return e; }
  function botao(label, classe, acao) { var b = no('button', classe, label); b.type = 'button'; b.onclick = acao; return b; }
  function montar() {
    if (raiz) return;
    var css = no('style'); css.textContent = `
      #tela-guia{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:calc(12px + env(safe-area-inset-bottom) + var(--tela-guia-pe,0px));z-index:2147482000;width:min(360px,calc(100vw - 24px));color:#eef7fb;font:15px/1.45 system-ui,sans-serif;text-align:left;letter-spacing:normal;pointer-events:none}
      #tela-guia *{box-sizing:border-box}#tela-guia [hidden]{display:none!important}
      #tela-guia button{font:700 14px/1.2 system-ui,sans-serif;letter-spacing:normal;text-transform:none;min-height:44px;padding:10px 13px;border-radius:10px;cursor:pointer;border:1px solid #7894a6;background:linear-gradient(#243f52,#142c3b);color:#eef7fb;box-shadow:inset 0 1px #ffffff26,0 3px 0 #06121b;pointer-events:auto}
      #tela-guia button:focus-visible{outline:3px solid #f4cf80;outline-offset:3px}#tela-guia button:disabled{opacity:.45;cursor:default}#tela-guia button:active:not(:disabled){transform:translateY(2px)}
      #tela-guia .tg-resumo{display:block;margin-left:auto;max-width:100%;white-space:normal}
      #tela-guia .tg-painel{pointer-events:auto;max-height:min(470px,55dvh);overflow:auto;overscroll-behavior:contain;padding:16px;border:1px solid #88c8e7;border-radius:16px;background:linear-gradient(155deg,#203e52,#102531);box-shadow:inset 0 1px #ffffff30,0 12px 30px #0008}
      #tela-guia .tg-contexto{font-size:12px;color:#bcdceb;margin:0 0 5px}#tela-guia h2{font:600 21px/1.2 Georgia,serif;color:#f4d79a;margin:0 0 8px}#tela-guia p{margin:0 0 12px;color:#eef7fb}
      #tela-guia .tg-contador{font-size:12px;color:#bcdceb;margin-bottom:12px}#tela-guia .tg-acoes{display:flex;flex-wrap:wrap;gap:8px}#tela-guia .tg-proximo{background:linear-gradient(#f7d690,#dba94f);color:#201604;border-color:#f3d697;flex:1;box-shadow:inset 0 1px #fff1ce,0 3px 0 #7a5018}
      #tela-guia .tg-localizar{margin:0 0 12px;width:100%}#tela-guia .tg-fechar{margin-top:12px;width:100%;background:#102531;box-shadow:none}
      .tg-anel{position:fixed;z-index:2147481999;border:2px solid #f4cf80;border-radius:10px;box-shadow:0 0 0 3px #f4cf8033;pointer-events:none}
      @media(max-width:600px){#tela-guia{width:min(340px,calc(100vw - 24px))}#tela-guia .tg-painel{max-height:48dvh;padding:13px}}
      @media(prefers-reduced-motion:reduce){#tela-guia *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
    `; document.head.appendChild(css);
    raiz = no('aside'); raiz.id = 'tela-guia'; raiz.setAttribute('aria-label', 'Ajuda de uso da tela');
    resumo = botao('Ajuda da tela', 'tg-resumo', function () { indice = 0; abrir(true); }); resumo.setAttribute('aria-expanded', 'false'); resumo.setAttribute('aria-controls', 'tg-painel');
    painel = no('section', 'tg-painel'); painel.id = 'tg-painel'; painel.hidden = true;
    var contexto = no('p', 'tg-contexto'); contexto.id = 'tg-contexto';
    titulo = no('h2'); titulo.id = 'tg-titulo'; painel.setAttribute('aria-labelledby', 'tg-titulo');
    texto = no('p'); texto.setAttribute('aria-live', 'polite');
    contador = no('div', 'tg-contador');
    localizar = botao('Mostrar controle', 'tg-localizar', function () { var e = elemento(passos()[indice].alvo); if(e) { recolher(false); e.scrollIntoView({block:'center',behavior:'auto'}); } });
    var acoes = no('div', 'tg-acoes');
    voltar = botao('Voltar', '', function () { indice = Math.max(0, indice - 1); pintar(); });
    seguir = botao('Próximo', 'tg-proximo', function () { concluirPasso(); });
    var fechar = botao('Agora não', 'tg-fechar', function () { recolher(true); });
    acoes.append(voltar, seguir); painel.append(contexto, titulo, texto, contador, localizar, acoes, fechar);
    raiz.append(resumo, painel); anel = no('div', 'tg-anel'); anel.hidden = true; anel.setAttribute('aria-hidden', 'true');
    document.body.append(anel, raiz);
    raiz.addEventListener('keydown', function (e) { if(e.key === 'Escape' && aberto) { e.preventDefault(); e.stopPropagation(); recolher(true); } });
    document.addEventListener('click', function (e) { if(!aberto || !atual || raiz.contains(e.target)) return; var p = passos()[indice], a = p && elemento(p.alvo); if(p && p.feito && a && a.contains(e.target)) concluirPasso(false); }, true);
    addEventListener('resize', agendar); addEventListener('scroll', agendar, true);
    if(global.visualViewport) { visualViewport.addEventListener('resize', agendar); visualViewport.addEventListener('scroll', agendar); }
  }
  function passos() { return atual ? atual.passos : []; }
  function container() { var d = document.querySelector('dialog[open]'); return d || document.body; }
  function definir(id, lista, op) {
    op = op || {}; if(!lista || !lista.length) return;
    montar();
    var candidatos = lista.filter(function(p) { return !p.alvo || p.semAlvoOk || visivel(p.alvo); });
    if(!candidatos.length) { suspender(op.dono); return; }
    if(atual && atual.id === id) { atual.op = op; atual.passos = candidatos; indice = Math.min(indice,candidatos.length-1); if(raiz.parentElement !== container()) { container().append(anel,raiz); } posicionar(); return; }
    recolher(false); atual = {id:id,passos:candidatos,op:op}; indice = 0;
    container().append(anel, raiz); raiz.hidden = false;
    resumo.textContent = 'Ajuda da tela · ' + (op.titulo || 'Como usar');
    var vistos = ler(id); while(indice < candidatos.length-1 && vistos[candidatos[indice].id || indice]) indice++;
    if(op.automatico !== false && !dispensados[id] && candidatos.some(function(p,i){return !vistos[p.id || i];})) abrir(false);
    posicionar();
  }
  function abrir(focar) { if(!atual) return; focoAnterior = document.activeElement; aberto = true; painel.hidden = false; resumo.hidden = true; resumo.setAttribute('aria-expanded','true'); pintar(); if(focar) seguir.focus({preventScroll:true}); }
  function recolher(restaurar) {
    aberto = false; if(!raiz) return; painel.hidden = true; resumo.hidden = false; resumo.setAttribute('aria-expanded','false'); anel.hidden = true;
    if(atual) dispensados[atual.id] = true;
    if(restaurar) { resumo.focus({preventScroll:true}); }
  }
  function concluirPasso(focar) {
    if(!atual) return; var p = passos()[indice], vistos = ler(atual.id); vistos[p.id || indice] = true; guardar(atual.id,vistos);
    if(indice < passos().length-1) { indice++; pintar(); } else { recolher(focar !== false); }
  }
  function pintar() {
    if(!atual || !aberto) return; var p = passos()[indice];
    document.getElementById('tg-contexto').textContent = 'Você está: ' + (atual.op.titulo || 'Exploração');
    titulo.textContent = p.rot || 'O que fazer agora'; texto.textContent = p.txt;
    contador.textContent = 'Orientação ' + (indice+1) + ' de ' + passos().length + ' · no seu ritmo';
    voltar.disabled = indice === 0; seguir.textContent = indice === passos().length-1 ? 'Entendi' : 'Próximo';
    posicionar();
  }
  function agendar() { if(quadro) return; quadro = requestAnimationFrame(function(){quadro=0;posicionar();}); }
  function posicionar() {
    if(!raiz || !atual || raiz.hidden) return;
    var pe = 0;
    document.querySelectorAll('.tools,.dock,#barra-jogo,#dragonSalaBtn,.compor,.composer').forEach(function(e) { if(!visivel(e)) return; var r=e.getBoundingClientRect(), s=getComputedStyle(e); if((s.position==='fixed'||s.position==='sticky') && r.bottom>=innerHeight-8 && r.height<innerHeight*.3) pe=Math.max(pe,innerHeight-r.top); });
    raiz.style.setProperty('--tela-guia-pe', Math.round(pe)+'px');
    var p = passos()[indice], e = p && elemento(p.alvo); anel.hidden = true; localizar.hidden = true;
    if(!aberto || !visivel(e)) return;
    var r = e.getBoundingClientRect(), h = global.visualViewport ? visualViewport.height : innerHeight;
    if(r.width*r.height > innerWidth*h*.55) return;
    var fora = r.top < 0 || r.bottom > h || r.left<0 || r.right>innerWidth;
    // Compare sempre com a posição à direita, evitando alternar de lado a cada atualização.
    var b = raiz.getBoundingClientRect(), direita=innerWidth-12;
    var cobre = direita-b.width < r.right && direita > r.left && b.top < r.bottom && b.bottom > r.top;
    localizar.hidden = !(fora || (cobre && innerWidth <= 760));
    if(cobre && innerWidth > 760) raiz.style.left = '12px'; else raiz.style.left = '';
    if(fora) return;
    anel.hidden=false; anel.style.left=(r.left-3)+'px'; anel.style.top=(r.top-3)+'px'; anel.style.width=(r.width+6)+'px'; anel.style.height=(r.height+6)+'px';
  }
  function suspender(dono) { if(!atual || (dono && atual.op.dono!==dono)) return; recolher(false); atual=null; raiz.hidden=true; }
  global.AssistenciaTela = {definir:definir,suspender:suspender,visivel:visivel,rever:function(){indice=0;abrir(true);},atual:function(){return atual && atual.id;},aberta:function(){return aberto;},esquecer:function(id){guardar(id,{});delete dispensados[id];}};
  global.GuiaRA = {
    mostrar:function(chave,lista,op){op=op||{};definir('ra:'+chave,lista,{titulo:op.titulo||'Exploração 3D / RA',dono:'ra',automatico:op.automatico});return true;},
    fechar:function(){suspender('ra');},
    esquecer:function(chave){global.AssistenciaTela.esquecer('ra:'+chave);}
  };
})(window);
