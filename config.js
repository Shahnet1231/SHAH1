// ============================================================
// SHAH Group — Config v3.0
// ============================================================

// ── API URL — New v3.0 ────────────────────────────────────────
const DEFAULT_API_URL = "https://script.google.com/macros/s/AKfycbx3OCgp79JfQo-YyY231HsnmKFrhTwsW_6kJk2kfjvmAZdcxGYmgYUMIJPhyxXi2JDM/exec";
const API_URL = localStorage.getItem('bms_apiUrl') || DEFAULT_API_URL;

// ── Dark Mode Auto Apply ──────────────────────────────────────
(function(){
  if(localStorage.getItem('bms_darkMode')==='1'){
    document.documentElement.setAttribute('data-theme','dark');
  }
})();

// ── Auth ──────────────────────────────────────────────────────
function getUser(){
  try{ return JSON.parse(sessionStorage.getItem('bms_user')); }
  catch(e){ return null; }
}
function requireLogin(){
  if(!getUser()) window.location.href='login.html';
}
function logout(){
  sessionStorage.removeItem('bms_user');
  window.location.href='login.html';
}

// ── API Calls ─────────────────────────────────────────────────
async function apiGet(action, params={}){
  const url = new URL(API_URL);
  url.searchParams.set('action', action);
  Object.keys(params).forEach(k=>{
    if(params[k]!==undefined && params[k]!=='') url.searchParams.set(k, params[k]);
  });
  const res = await fetch(url.toString());
  return res.json();
}

async function apiPost(body){
  const res = await fetch(API_URL, {
    method:  'POST',
    headers: {'Content-Type':'text/plain'},
    body:    JSON.stringify(body)
  });
  return res.json();
}

// ── Formatters ────────────────────────────────────────────────
function fmtMoney(n){
  return 'Rs. ' + Number(n||0).toLocaleString('en-PK',{minimumFractionDigits:0,maximumFractionDigits:0});
}
function fmtDate(d){
  if(!d) return '—';
  return new Date(d).toLocaleDateString('en-PK');
}
function fmtDateTime(d){
  if(!d) return '—';
  return new Date(d).toLocaleString('en-PK');
}

// ── Toast Notification ────────────────────────────────────────
function toast(msg, type='success'){
  document.querySelectorAll('.shah-toast').forEach(t=>t.remove());
  const t = document.createElement('div');
  t.className = 'shah-toast ' + type;
  t.innerHTML = (type==='success'?'✅ ':'⚠️ ') + msg;
  Object.assign(t.style,{
    position:'fixed', bottom:'24px', right:'24px',
    background: type==='success'?'#059669':'#dc2626',
    color:'#fff', padding:'12px 20px', borderRadius:'10px',
    fontSize:'13px', fontWeight:'700', zIndex:'9999',
    fontFamily:'Nunito,sans-serif', maxWidth:'320px',
    boxShadow:'0 4px 16px rgba(0,0,0,0.15)',
    transform:'translateY(20px)', opacity:'0',
    transition:'all 0.3s'
  });
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.transform='translateY(0)'; t.style.opacity='1'; }, 10);
  setTimeout(()=>{ t.style.transform='translateY(20px)'; t.style.opacity='0';
    setTimeout(()=>t.remove(), 300); }, 3500);
}

// ── Confirm Dialog ────────────────────────────────────────────
function confirmDialog(msg){
  return new Promise(resolve=>{
    const overlay = document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center';
    overlay.innerHTML=`
      <div style="background:#fff;border-radius:16px;padding:24px;max-width:340px;width:90%;font-family:Nunito,sans-serif;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.2)">
        <div style="font-size:32px;margin-bottom:12px">⚠️</div>
        <p style="font-size:14px;color:#374151;margin-bottom:20px;line-height:1.6">${msg}</p>
        <div style="display:flex;gap:10px;justify-content:center">
          <button id="cd-no"  style="padding:10px 24px;border-radius:8px;border:1.5px solid #e5e7eb;background:#f9fafb;font-family:Nunito,sans-serif;font-size:13px;font-weight:700;cursor:pointer;color:#374151">Nahi</button>
          <button id="cd-yes" style="padding:10px 24px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-family:Nunito,sans-serif;font-size:13px;font-weight:700;cursor:pointer">Haan, Karen</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#cd-yes').onclick=()=>{ overlay.remove(); resolve(true); };
    overlay.querySelector('#cd-no').onclick =()=>{ overlay.remove(); resolve(false); };
  });
}

// ── WhatsApp Link ─────────────────────────────────────────────
function waLink(phone, msg){
  const p   = String(phone||'').replace(/\D/g,'');
  const num = p.startsWith('0') ? '92'+p.slice(1) : (p.length===10?'92'+p:p);
  return `https://wa.me/${num}?text=${encodeURIComponent(msg||'')}`;
}

// ── Print ─────────────────────────────────────────────────────
function printDiv(id){
  const el = document.getElementById(id);
  if(!el){ toast('Print area nahi mila','error'); return; }
  const w = window.open('','_blank','width=600,height=800');
  w.document.write(`<!DOCTYPE html><html><head><title>SHAH Group</title>
    <style>
      body{font-family:'Nunito',sans-serif;padding:20px;font-size:13px;color:#333}
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
      table{width:100%;border-collapse:collapse}
      th{background:#f3f0ff;color:#4c1d95;padding:8px;text-align:left;border:1px solid #ddd}
      td{padding:7px 8px;border:1px solid #ddd}
      @media print{body{padding:8px}}
    </style></head><body>`);
  w.document.write(el.innerHTML);
  w.document.write('</body></html>');
  w.document.close();
  setTimeout(()=>w.print(), 500);
}

// ── Payment Method Labels ─────────────────────────────────────
const PM_LABELS = {
  cash:   '💵 Cash',
  online: '📱 Online Transfer',
  cheque: '🏦 Cheque',
  credit: '📒 Udhaar'
};
const PM_COLORS = {
  cash:   {bg:'#d1fae5', c:'#065f46'},
  online: {bg:'#dbeafe', c:'#1e40af'},
  cheque: {bg:'#ede9fe', c:'#4c1d95'},
  credit: {bg:'#fef3c7', c:'#92400e'}
};

// ── Sale Type Labels ──────────────────────────────────────────
const ST_LABELS = {
  retail:    '🏪 Retail',
  wholesale: '🏭 Wholesale'
};
const ST_COLORS = {
  retail:    {bg:'#fef3c7', c:'#92400e'},
  wholesale: {bg:'#d1fae5', c:'#065f46'}
};

// ── Customer Type Colors ──────────────────────────────────────
const CT_COLORS = {
  Regular:   {bg:'#ede9fe', c:'#4c1d95'},
  Wholesale: {bg:'#fff7ed', c:'#c2410c'},
  Retail:    {bg:'#dbeafe', c:'#1e40af'},
  VIP:       {bg:'#fef3c7', c:'#92400e'},
  'Walk-in': {bg:'#f3f4f6', c:'#4b5563'}
};

// ── Highlight search match ────────────────────────────────────
function hlText(text, query){
  if(!query) return String(text||'');
  const re = new RegExp('('+query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
  return String(text||'').replace(re,'<mark style="background:#fde68a;border-radius:3px;padding:0 2px;color:#92400e;font-weight:700">$1</mark>');
}

// ── Debounce ──────────────────────────────────────────────────
function debounce(fn, delay=300){
  let t;
  return function(...args){
    clearTimeout(t);
    t = setTimeout(()=>fn.apply(this,args), delay);
  };
}
