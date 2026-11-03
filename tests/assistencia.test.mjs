import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';

const repos=['.'];
function preparar(repo){
 const dom=new JSDOM('<!doctype html><html><head></head><body><button id="controle">Controle</button><div id="cena">Cena</div><dialog id="dialogo"></dialog></body></html>',{runScripts:'outside-only',url:'https://teste.example/',pretendToBeVisual:true});
 const w=dom.window;
 w.HTMLElement.prototype.getBoundingClientRect=function(){return {x:10,y:20,left:10,top:20,right:210,bottom:80,width:200,height:60};};
 w.HTMLElement.prototype.scrollIntoView=function(){w.rolagens=(w.rolagens||0)+1;};
 w.eval(readFileSync(new URL('../'+repo+'/assistencia-telas.js',import.meta.url),'utf8'));
 return {w,d:w.document,close:()=>w.close()};
}
const passos=[{id:'cena',rot:'Explorar',txt:'Use gestos',alvo:'#cena'},{id:'controle',rot:'Controle',txt:'Use o controle',alvo:'#controle'},{id:'fim',rot:'Voltar ao jogo',txt:'Volte quando quiser'}];
for(const repo of repos){
 test(repo+': mensagens preservam leitura acima e acompanham o fim quando apropriado',()=>{
  const {w,close}=preparar(repo);const html=readFileSync(new URL('../'+repo+'/o-impostor/mesa.html',import.meta.url),'utf8');
  w.eval(html.match(/function posicaoLeitura[^\n]+\nfunction restaurarLeitura[^\n]+/)[0]);
  const el={scrollTop:200,scrollHeight:1200,clientHeight:400,dataset:{}};
  let pos=w.posicaoLeitura(el);el.scrollHeight=1400;w.restaurarLeitura(el,pos);assert.equal(el.scrollTop,200);
  el.scrollTop=980;pos=w.posicaoLeitura(el);el.scrollHeight=1600;w.restaurarLeitura(el,pos);assert.equal(el.scrollTop,1600);
  el.scrollTop=200;pos=w.posicaoLeitura(el,'outra-conversa');assert.equal(pos.fim,true);
  pos=w.posicaoLeitura(el,'outra-conversa');assert.equal(pos.fim,false);close();
 });
 test(repo+': caminho distingue planta, maquete e acesso restrito sem executar ações',()=>{
  const {w,d,close}=preparar(repo);d.body.innerHTML='<div id="abertura" hidden></div><div id="dgAcesso" hidden><button id="dgAcessoBtn">Entrar com Google</button></div><button class="orelha ativa" data-aba="ra">RA</button><section id="v-ra"><div id="gradeRA">Planta</div></section>';
  let tick;w.setInterval=fn=>{tick=fn;};const tag=d.createElement('script');tag.dataset.guia='impostor';tag.dataset.jogo='carro';Object.defineProperty(d,'currentScript',{value:tag,configurable:true});
  w.eval(readFileSync(new URL('../'+repo+'/caminho-ra.js',import.meta.url),'utf8'));
  d.querySelector('.tg-resumo').click();assert.match(d.querySelector('#tg-painel').textContent,/planta de evacuação/);assert.match(d.querySelector('#tg-painel').textContent,/Capítulo 1/);
  d.querySelector('#dgAcesso').hidden=false;tick();assert.match(w.AssistenciaTela.atual(),/acesso/);
  assert.equal(d.querySelector('#dgAcesso').hidden,false);assert.equal(d.querySelector('#dgAcessoBtn').disabled,false);close();
 });
 test(repo+': gestos não avançam, botões navegam e rever retorna ao primeiro passo',()=>{
  const {w,d,close}=preparar(repo);w.GuiaRA.mostrar('teste',passos);
  d.querySelector('#cena').dispatchEvent(new w.Event('pointerdown',{bubbles:true}));d.querySelector('#cena').click();
  assert.equal(d.querySelector('h2').textContent,'Explorar');
  d.querySelector('.tg-proximo').click();assert.equal(d.querySelector('h2').textContent,'Controle');
  d.querySelector('.tg-acoes button').click();assert.equal(d.querySelector('h2').textContent,'Explorar');
  d.querySelector('.tg-fechar').click();assert.equal(d.querySelector('#tg-painel').hidden,true);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('tela-guia:v2:ra:teste')),{cena:true});
  d.querySelector('.tg-resumo').click();assert.equal(d.querySelector('h2').textContent,'Explorar');
  assert.equal(w.rolagens,undefined);close();
 });
 test(repo+': um toque só conclui passos que declaram a ação esperada',()=>{
  const {w,d,close}=preparar(repo);w.GuiaRA.mostrar('teste',[{...passos[1],feito:true},passos[2]]);
  d.querySelector('#cena').click();assert.equal(d.querySelector('h2').textContent,'Controle');
  d.querySelector('#controle').click();assert.equal(d.querySelector('h2').textContent,'Voltar ao jogo');close();
 });
 test(repo+': não há temporizador de conclusão e contexto fecha junto com a cena',()=>{
  const {w,d,close}=preparar(repo);let timers=0;w.setTimeout=()=>{timers++;};w.GuiaRA.mostrar('teste',passos);
  assert.equal(timers,0);w.GuiaRA.fechar();assert.equal(d.querySelector('#tela-guia').hidden,true);
  assert.equal(w.localStorage.getItem('tela-guia:v2:ra:teste'),null);
  w.GuiaRA.mostrar('teste',passos);assert.equal(d.querySelector('#tela-guia').hidden,false);assert.equal(d.querySelector('#tg-painel').hidden,true);close();
 });
 test(repo+': ajuda permanece acessível após concluir e armazenamento indisponível não quebra',()=>{
  const {w,d,close}=preparar(repo);Object.defineProperty(w,'localStorage',{get(){throw new Error('bloqueado');}});
  w.GuiaRA.mostrar('teste',[passos[0]]);d.querySelector('.tg-proximo').click();
  assert.equal(d.querySelector('.tg-resumo').hidden,false);d.querySelector('.tg-resumo').click();
  assert.equal(d.querySelector('#tg-painel').hidden,false);close();
 });
 test(repo+': alvo oculto não entra na contagem; foco e Escape funcionam',()=>{
  const {w,d,close}=preparar(repo);d.querySelector('#controle').hidden=true;w.GuiaRA.mostrar('teste',passos);
  assert.match(d.querySelector('.tg-contador').textContent,/1 de 2/);
  d.querySelector('.tg-proximo').focus();d.querySelector('.tg-proximo').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  assert.equal(d.activeElement,d.querySelector('.tg-resumo'));close();
 });
 test(repo+': um controlador não apaga a ajuda de outro; dialog usa a mesma camada',()=>{
  const {w,d,close}=preparar(repo);d.querySelector('dialog').open=true;w.GuiaRA.mostrar('teste',passos);
  assert.equal(d.querySelector('#tela-guia').parentElement,d.querySelector('dialog'));
  w.AssistenciaTela.suspender('caminho');assert.equal(w.AssistenciaTela.atual(),'ra:teste');close();
 });
}
