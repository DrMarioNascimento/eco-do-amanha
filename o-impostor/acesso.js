/* O Eco do Amanhã · acesso restrito à versão solo (15/10/2026).
   A versão em grupo já exige o Google do Mestre (firebase-room.js). A solo abria para qualquer um;
   agora pede uma conta Google que esteja na lista de mestres do projeto (Firestore: config/mestres,
   campo "emails"). Usa o mesmo app ("dragon-vestchip") da sala em grupo, para o login valer nas duas. */
import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';

const Q = new URLSearchParams(location.search);
const GRUPO = Q.get('grupo') === '1' || !!Q.get('sala');
if (!GRUPO) iniciar();

function iniciar() {
  const cfg = { apiKey: 'AIzaSyCVFRwufDXTY6qVaBKrToGCHd5CS35obWE', authDomain: 'vestchip.firebaseapp.com', projectId: 'vestchip',
    storageBucket: 'vestchip.firebasestorage.app', messagingSenderId: '688895060786', appId: '1:688895060786:web:336053a414675f6edc452b' };
  const app = getApps().find(a => a.name === 'dragon-vestchip') || initializeApp(cfg, 'dragon-vestchip');
  const auth = getAuth(app), db = getFirestore(app);

  const st = document.createElement('style');
  st.textContent = `#ecoAcesso{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(900px 600px at 50% -10%,#10232a 0,transparent 60%),#04090c;color:#e8f4f6;font-family:Inter,system-ui,sans-serif}
#ecoAcesso .cx{width:min(420px,100%);padding:24px 20px;border:1px solid #2f6b78;border-radius:16px;background:linear-gradient(170deg,#0f2630,#0a1a21);box-shadow:0 18px 50px #000c;text-align:center}
#ecoAcesso small{display:block;font:700 11px/1 ui-monospace,monospace;letter-spacing:.2em;text-transform:uppercase;color:#6fd6e6}
#ecoAcesso h2{margin:12px 0 8px;font:700 26px Georgia,serif;color:#f4fbfc}
#ecoAcesso p{margin:0 0 16px;color:#a9c3c9;line-height:1.5}
#ecoAcesso button{width:100%;min-height:52px;border:0;border-radius:10px;font:800 14px/1 Inter,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;background:linear-gradient(180deg,#f3d078,#e0b13a);color:#1a1206;box-shadow:0 4px 0 #6b5220}
#ecoAcesso button[disabled]{opacity:.6;cursor:wait}
#ecoAcesso .erro{margin-top:12px;padding:10px;border-left:3px solid #e56b52;background:#28110e;color:#ffd4ca;text-align:left;font-size:14px}
#ecoAcesso .erro:empty{display:none}`;
  document.head.appendChild(st);
  const box = document.createElement('div');
  box.id = 'ecoAcesso';
  box.innerHTML = `<div class="cx"><small>O Eco do Amanhã · acesso restrito</small><h2>Entre para jogar</h2>
<p>O jogo está em fase de testes e só abre para contas autorizadas. Entre com a sua conta Google.</p>
<button type="button" id="ecoAcessoBtn">Entrar com Google</button><div class="erro" id="ecoAcessoErro"></div></div>`;
  const montar = () => { if (!document.getElementById('ecoAcesso')) document.body.appendChild(box); };
  if (document.body) montar(); else document.addEventListener('DOMContentLoaded', montar);
  const btn = () => document.getElementById('ecoAcessoBtn');
  const erro = t => { const e = document.getElementById('ecoAcessoErro'); if (e) e.textContent = t || ''; };

  async function autorizado(user) {
    if (!user || user.isAnonymous || !user.email) return false;
    try {
      const s = await getDoc(doc(db, 'config', 'mestres'));
      const lista = (s.exists() && Array.isArray(s.data().emails)) ? s.data().emails.map(e => String(e).toLowerCase()) : [];
      return lista.includes(user.email.toLowerCase());
    } catch (e) { console.warn('Eco: lista de acesso', e); return false; }
  }
  async function conferir(user) {
    if (await autorizado(user)) { box.remove(); return; }
    if (user && !user.isAnonymous) {
      erro(`A conta ${user.email} não está autorizada. Entre com outra conta.`);
      await signOut(auth);
    }
  }
  onAuthStateChanged(auth, user => { if (user) conferir(user); });
  box.addEventListener('click', async ev => {
    if (ev.target.id !== 'ecoAcessoBtn') return;
    const b = btn(); b.disabled = true; erro('');
    try {
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
      await conferir(user);
    } catch (e) {
      const c = e && e.code || '';
      erro(c === 'auth/popup-blocked' ? 'O navegador bloqueou a janela do Google. Libere pop-ups para este site e tente de novo.'
        : (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request') ? 'A janela do Google foi fechada antes de terminar.'
        : c === 'auth/unauthorized-domain' ? 'Este endereço ainda não foi autorizado no Firebase.'
        : 'Não foi possível entrar. Tente de novo.');
    } finally { const b2 = btn(); if (b2) b2.disabled = false; }
  });
}
