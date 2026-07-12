// Live alert console demo on the landing page
const heroLogs = [
  {t:'10:02', tag:'ok', tagText:'OK', msg:'Meta Ads — Campaign A', why:'Spend on pace, CPC within normal range.'},
  {t:'10:47', tag:'ok', tagText:'OK', msg:'Google Ads — Search Brand', why:'Conversions tracking normally.'},
  {t:'11:04', tag:'alert', tagText:'ALERT', msg:'Meta Ads — Campaign spend dropped 70%', why:'Payment method failed 2h ago. Est. lost spend: ₹18,200.'},
  {t:'12:15', tag:'info', tagText:'INFO', msg:'Shopify — checkout conversion dipped', why:'0.6pt below 7-day average. Watching.'},
  {t:'13:12', tag:'alert', tagText:'ALERT', msg:'Meta Pixel — no events received in 40 min', why:'Site deploy 3 days ago likely broke tracking.'},
  {t:'14:30', tag:'alert', tagText:'ALERT', msg:'Google Ads — CPC up 38% vs 7-day avg', why:'Audience overlap increased across 2 ad sets.'},
  {t:'15:05', tag:'ok', tagText:'OK', msg:'Salesforce — lead sync healthy', why:'142 leads routed in the last hour.'},
  {t:'16:15', tag:'alert', tagText:'ALERT', msg:'HubSpot — lead sync stalled 43 min', why:'API token expired. Leads queued, not lost — yet.'},
];

(function initHeroConsole(){
  const body = document.getElementById('consoleBody');
  if(!body) return;
  let i = 0;
  function renderLine(entry){
    const line = document.createElement('div');
    line.className = 'log-line';
    line.style.gridTemplateColumns = '70px 60px 1fr';
    line.innerHTML = `
      <div class="log-time">${entry.t}</div>
      <div class="log-tag ${entry.tag}">${entry.tagText}</div>
      <div class="log-msg">${entry.msg}<span class="why">${entry.why}</span></div>
    `;
    body.appendChild(line);
    while(body.children.length > 5){ body.removeChild(body.firstChild); }
    body.scrollTop = body.scrollHeight;
  }
  function tick(){ renderLine(heroLogs[i % heroLogs.length]); i++; }
  tick();
  setInterval(tick, 2200);
})();

// Waitlist form — front-end only. See README for wiring to Formspree/Web3Forms.
(function initWaitlistForm(){
  const form = document.getElementById('waitlistForm');
  if(!form) return;
  const success = document.getElementById('formSuccess');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    form.style.display = 'none';
    success.style.display = 'block';
  });
})();

// Mobile nav toggle (landing page)
(function initMobileNav(){
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  if(!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('mobile-open'));
})();
