// ============================================================
// SHAH Group — Shared Config & API Helper
// ============================================================

const API_URL = "https://script.google.com/macros/s/AKfycbyG4sce-iVMvxekaMy1acoSImgVB8--GEEGiU18z_5UrNNivs6jHLDpNiSMUvtfebYQAw/exec";

// ── Auth helpers ─────────────────────────────────────────────
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

// ── API calls ─────────────────────────────────────────────────
async function apiGet(action, params = {}) {
  const url = new URL(API_URL);
  url.searchParams.set('action', action);
  Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));
  const res = await fetch(url.toString());
  return res.json();
}

async function apiPost(body) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body)
  });
  return res.json();
}

// ── Format helpers ────────────────────────────────────────────
function fmtMoney(n) {
  return 'Rs. ' + Number(n||0).toLocaleString('en-PK', {minimumFractionDigits:0});
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PK');
}
function today() {
  return new Date().toLocaleDateString('en-PK');
}

// ── Toast notification ────────────────────────────────────────
function toast(msg, type='success') {
  const t = document.createElement('div');
  t.className = 'shah-toast ' + type;
  t.innerHTML = (type==='success'?'✅':'⚠️') + ' ' + msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(()=>t.remove(),400); }, 3000);
}

// ── Confirm dialog ────────────────────────────────────────────
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

// ── WhatsApp link helper ──────────────────────────────────────
function waLink(phone, msg) {
  const p = String(phone||'').replace(/\D/g,'');
  const num = p.startsWith('0') ? '92' + p.slice(1) : p;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

// ── Print / PDF helper ────────────────────────────────────────
function printDiv(id) {
  const el = document.getElementById(id);
  const w  = window.open('','_blank');
  w.document.write('<html><head><title>SHAH Group</title>');
  w.document.write('<style>body{font-family:Arial;padding:20px;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;font-size:12px;} th{background:#f3f0ff;}</style>');
  w.document.write('</head><body>');
  w.document.write(el.innerHTML);
  w.document.write('</body></html>');
  w.document.close();
  w.print();
}
