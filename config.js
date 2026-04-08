// ============================================================
// SHAH Group — Config v2.0
// ============================================================

// API URL — localStorage se override possible
const DEFAULT_API_URL = "https://script.google.com/macros/s/AKfycbyG4sce-iVMvxekaMy1acoSImgVB8--GEEGiU18z_5UrNNivs6jHLDpNiSMUvtfebYQAw/exec";
const API_URL = localStorage.getItem('bms_apiUrl') || DEFAULT_API_URL;

// Dark mode auto apply
(function() {
  if (localStorage.getItem('bms_darkMode')==='1') {
    document.documentElement.setAttribute('data-theme','dark');
    document.documentElement.style.setProperty('--bg','#0f1117');
    document.documentElement.style.setProperty('--card','#1a1d27');
    document.documentElement.style.setProperty('--sidebar-bg','#1a1d27');
    document.documentElement.style.setProperty('--text','#f0f2ff');
    document.documentElement.style.setProperty('--muted','#8892aa');
    document.documentElement.style.setProperty('--border','rgba(255,255,255,0.1)');
    document.documentElement.style.setProperty('--purple-ll','rgba(124,58,237,0.15)');
  }
})();

// ── Auth ──────────────────────────────────────────────────────
function getUser() {
  try { return JSON.parse(sessionStorage.getItem('bms_user')); } catch(e) { return null; }
}
function requireLogin() {
  if (!getUser()) { window.location.href = 'login.html'; }
}
function logout() {
  sessionStorage.removeItem('bms_user');
  window.location.href = 'login.html';
}

// ── API Calls ─────────────────────────────────────────────────
async function apiGet(action, params = {}) {
  const url = new URL(API_URL);
  url.searchParams.set('action', action);
  Object.keys(params).forEach(k => { if(params[k]!==undefined && params[k]!=='') url.searchParams.set(k, params[k]); });
  const res = await fetch(url.toString());
  return res.json();
}

async function apiPost(body) {
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'text/plain' },
    body:    JSON.stringify(body)
  });
  return res.json();
}

// ── Formatters ────────────────────────────────────────────────
function fmtMoney(n) {
  return 'Rs. ' + Number(n||0).toLocaleString('en-PK', {minimumFractionDigits:0, maximumFractionDigits:0});
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PK');
}

// ── Toast ─────────────────────────────────────────────────────
function toast(msg, type='success') {
  // Remove existing toasts
  document.querySelectorAll('.shah-toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'shah-toast ' + type;
  t.innerHTML = (type==='success' ? '✅ ' : '⚠️ ') + msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3500);
}

// ── Confirm Dialog ────────────────────────────────────────────
function confirmDialog(msg) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'shah-overlay';
    overlay.innerHTML = `
      <div class="shah-confirm">
        <div class="sc-icon">⚠️</div>
        <p>${msg}</p>
        <div class="sc-btns">
          <button class="sc-no">Nahi</button>
          <button class="sc-yes">Haan, Karen</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.sc-yes').onclick = () => { overlay.remove(); resolve(true); };
    overlay.querySelector('.sc-no').onclick  = () => { overlay.remove(); resolve(false); };
  });
}

// ── WhatsApp Link ─────────────────────────────────────────────
function waLink(phone, msg) {
  const p = String(phone||'').replace(/\D/g,'');
  const num = p.startsWith('0') ? '92' + p.slice(1) : (p.length===10 ? '92'+p : p);
  return `https://wa.me/${num}?text=${encodeURIComponent(msg||'')}`;
}

// ── Print ─────────────────────────────────────────────────────
function printDiv(id) {
  const el = document.getElementById(id);
  if (!el) { toast('Print area nahi mila','error'); return; }
  const w = window.open('','_blank','width=600,height=800');
  w.document.write(`<!DOCTYPE html><html><head><title>SHAH Group</title>
    <style>
      body{font-family:Arial,sans-serif;padding:20px;font-size:13px;color:#333}
      table{width:100%;border-collapse:collapse;margin:8px 0}
      th{background:#f3f0ff;color:#4c1d95;padding:8px;text-align:left;border:1px solid #ddd;font-size:12px}
      td{padding:7px 8px;border:1px solid #ddd;font-size:12px}
      h1,h2{color:#4c1d95}
      @media print{body{padding:8px}}
    </style></head><body>`);
  w.document.write(el.innerHTML);
  w.document.write('</body></html>');
  w.document.close();
  setTimeout(() => w.print(), 500);
}
