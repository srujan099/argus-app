/* ===================== DATA ===================== */

const INTEGRATIONS = [
  { id:'meta',       name:'Meta Ads Manager', cat:'Marketing', initials:'Mt', color:'#1877F2', auth:'meta',   connected:false },
  { id:'google',     name:'Google Ads',       cat:'Marketing', initials:'G',  color:'#EA4335', auth:'google', connected:false },
  { id:'ga4',        name:'Google Analytics 4', cat:'Marketing', initials:'A', color:'#F9AB00', auth:'apikey', connected:false },
  { id:'hubspot',    name:'HubSpot',          cat:'Sales',     initials:'H',  color:'#FF7A59', auth:'apikey', connected:false },
  { id:'salesforce', name:'Salesforce',       cat:'Sales',     initials:'Sf', color:'#00A1E0', auth:'apikey', connected:false },
  { id:'zoho',       name:'Zoho CRM',         cat:'Sales',     initials:'Z',  color:'#C8202F', auth:'apikey', connected:false },
  { id:'shopify',    name:'Shopify',          cat:'Ecommerce', initials:'S',  color:'#95BF47', auth:'apikey', connected:false },
  { id:'stripe',     name:'Stripe',           cat:'SaaS',      initials:'$',  color:'#635BFF', auth:'apikey', connected:false },
  { id:'zendesk',    name:'Zendesk',          cat:'Ops',       initials:'Zd', color:'#03363D', auth:'apikey', connected:false },
  { id:'slack',      name:'Slack',            cat:'Delivery',  initials:'#',  color:'#4A154B', auth:'apikey', connected:true  },
  { id:'whatsapp',   name:'WhatsApp Business',cat:'Delivery',  initials:'W',  color:'#25D366', auth:'apikey', connected:true  },
];

const PLATFORMS = ['Meta Ads', 'Google Ads', 'Shopify', 'Salesforce', 'HubSpot'];
const SEVERITIES = ['alert', 'info', 'ok'];

const ALERT_TEMPLATES = [
  { p:'Meta Ads', sev:'alert', msg:'Campaign spend dropped 70%', why:'Payment method failed 2h ago.', impact:18200 },
  { p:'Meta Ads', sev:'alert', msg:'Pixel stopped receiving events', why:'Site deploy 3 days ago likely broke tracking.', impact:9400 },
  { p:'Google Ads', sev:'alert', msg:'CPC up 38% vs 7-day average', why:'Audience overlap increased across 2 ad sets.', impact:12600 },
  { p:'Google Ads', sev:'info', msg:'Budget 80% exhausted', why:'On pace to exhaust by 6pm, 3h earlier than usual.', impact:0 },
  { p:'Shopify', sev:'alert', msg:'Checkout conversion fell to 0.8%', why:'Down from a 2.3% 7-day average.', impact:31000 },
  { p:'Shopify', sev:'ok', msg:'Inventory sync healthy', why:'412 SKUs checked, no mismatches.', impact:0 },
  { p:'Salesforce', sev:'alert', msg:'Leads unassigned for 3+ hours', why:'Routing rule may be misconfigured.', impact:0 },
  { p:'HubSpot', sev:'alert', msg:'Lead sync stalled 43 minutes', why:'API token expired, leads queued not lost.', impact:0 },
  { p:'Meta Ads', sev:'ok', msg:'Campaign A back to normal spend', why:'Payment method updated, spend resumed.', impact:0 },
  { p:'Google Ads', sev:'ok', msg:'Search Brand campaign healthy', why:'Conversions tracking within normal range.', impact:0 },
];

let alerts = [];
let alertIdCounter = 0;

function genAlert(minutesAgo){
  const tpl = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
  const d = new Date(Date.now() - minutesAgo * 60000);
  return {
    id: alertIdCounter++,
    time: d.toTimeString().slice(0,5),
    ts: d.getTime(),
    platform: tpl.p,
    severity: tpl.sev,
    msg: tpl.msg,
    why: tpl.why,
    impact: tpl.impact,
    resolved: false
  };
}

// seed initial history
for(let i = 22; i >= 1; i--){ alerts.push(genAlert(i * 14)); }

/* ===================== TAB SWITCHING ===================== */

function initTabs(){
  const links = document.querySelectorAll('.side-nav a[data-tab]');
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('tab-' + link.dataset.tab).classList.add('active');
      document.getElementById('pageTitle').textContent = link.dataset.title;
      document.getElementById('sidebar').classList.remove('open');
      if(link.dataset.tab === 'overview') renderCharts();
    });
  });
}

/* ===================== SIDEBAR MOBILE ===================== */

function initMobileSidebar(){
  const btn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if(!btn) return;
  btn.addEventListener('click', () => sidebar.classList.toggle('open'));
}

/* ===================== DROPDOWNS ===================== */

function initDropdowns(){
  document.querySelectorAll('.dropdown').forEach(dd => {
    const btn = dd.querySelector('.dropdown-btn');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      document.querySelectorAll('.dropdown').forEach(o => { if(o !== dd) o.classList.remove('open'); });
      dd.classList.toggle('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(dd => dd.classList.remove('open'));
  });
}

function renderAccountDropdown(){
  const menu = document.getElementById('accountMenu');
  const all = INTEGRATIONS.filter(i => i.connected);
  menu.innerHTML = all.length
    ? all.map((a,idx) => `
      <div class="dropdown-item ${idx===0?'selected':''}" data-acc="${a.id}">
        <span class="dot ok"></span> ${a.name}
        <span class="dropdown-check">✓</span>
      </div>`).join('')
    : `<div class="dropdown-item" style="opacity:.6;cursor:default;">No accounts connected yet</div>`;

  menu.querySelectorAll('.dropdown-item[data-acc]').forEach(item => {
    item.addEventListener('click', () => {
      menu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      document.getElementById('accountLabel').textContent = item.dataset.acc ?
        INTEGRATIONS.find(i => i.id === item.dataset.acc).name : 'All accounts';
      showToast('Viewing ' + INTEGRATIONS.find(i => i.id === item.dataset.acc).name);
    });
  });
}

/* ===================== INTEGRATIONS ===================== */

function renderIntegrations(){
  const grid = document.getElementById('integrationsGrid');
  grid.innerHTML = INTEGRATIONS.map(i => `
    <div class="integ-card">
      <div class="integ-top">
        <div class="integ-icon" style="background:${i.color}22;color:${i.color};border:1px solid ${i.color}55;">${i.initials}</div>
        <div>
          <div class="integ-name">${i.name}</div>
          <div class="integ-cat">${i.cat}</div>
        </div>
      </div>
      <div class="integ-status ${i.connected ? 'connected' : ''}">
        <span class="dot"></span> ${i.connected ? 'Connected' : 'Not connected'}
      </div>
      <button class="btn-sm ${i.connected ? '' : 'ok'}" data-connect="${i.id}">
        ${i.connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  `).join('');

  grid.querySelectorAll('[data-connect]').forEach(btn => {
    btn.addEventListener('click', () => handleConnect(btn.dataset.connect));
  });
}

function handleConnect(id){
  const integ = INTEGRATIONS.find(i => i.id === id);
  if(integ.connected){
    integ.connected = false;
    renderIntegrations();
    renderAccountDropdown();
    showToast(`Disconnected ${integ.name}`);
    return;
  }
  if(integ.auth === 'meta'){
    if(isPlaceholder(ARGUS_OAUTH_CONFIG.meta.appId)){
      openConfigModal('Meta Ads Manager', 'meta');
    } else {
      window.location.href = buildMetaAuthUrl();
    }
    return;
  }
  if(integ.auth === 'google'){
    if(isPlaceholder(ARGUS_OAUTH_CONFIG.google.clientId)){
      openConfigModal('Google Ads', 'google');
    } else {
      window.location.href = buildGoogleAuthUrl();
    }
    return;
  }
  // apikey type
  openApiKeyModal(integ);
}

function openConfigModal(name, type){
  document.getElementById('modalTitle').textContent = `Connect ${name}`;
  document.getElementById('modalBody').innerHTML = `
    <p>This button is wired to open the real ${name} login screen — it just needs your own app credentials first, since those can't ship inside a public repo.</p>
    <p>Open <code>js/oauth-config.js</code> and fill in your ${type === 'meta' ? 'Meta App ID' : 'Google OAuth Client ID'}. Full steps are in <strong>README.md</strong> under "Making Connect buttons real".</p>
    <div class="modal-actions"><button class="btn-secondary" data-close>Got it</button></div>
  `;
  openModal();
}

function openApiKeyModal(integ){
  document.getElementById('modalTitle').textContent = `Connect ${integ.name}`;
  document.getElementById('modalBody').innerHTML = `
    <p>Paste your ${integ.name} API key or access token. This demo stores it only in memory for this session — nothing is sent anywhere.</p>
    <input type="text" id="apiKeyInput" placeholder="${integ.name} API key">
    <div class="modal-actions">
      <button class="btn-secondary" data-close>Cancel</button>
      <button class="btn-primary" id="apiKeyConfirm">Connect</button>
    </div>
  `;
  openModal();
  document.getElementById('apiKeyConfirm').addEventListener('click', () => {
    const val = document.getElementById('apiKeyInput').value.trim();
    if(!val){ showToast('Enter a key to continue', true); return; }
    integ.connected = true;
    closeModal();
    renderIntegrations();
    renderAccountDropdown();
    showToast(`Connected ${integ.name}`);
  });
}

/* ===================== MODAL / TOAST ===================== */

function openModal(){ document.getElementById('modalOverlay').classList.add('open'); }
function closeModal(){ document.getElementById('modalOverlay').classList.remove('open'); }

function initModal(){
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if(e.target.id === 'modalOverlay') closeModal();
  });
  document.body.addEventListener('click', e => {
    if(e.target.matches('[data-close]')) closeModal();
  });
}

let toastTimer;
function showToast(msg, isWarning){
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.borderColor = isWarning ? 'var(--alert)' : 'var(--ok)';
  toast.style.color = isWarning ? 'var(--alert)' : 'var(--ok)';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ===================== ALERTS TAB ===================== */

function renderAlerts(){
  const list = document.getElementById('alertsList');
  const platFilter = document.getElementById('filterPlatform').value;
  const sevFilter = document.getElementById('filterSeverity').value;
  const search = document.getElementById('filterSearch').value.toLowerCase();

  const filtered = alerts
    .filter(a => platFilter === 'all' || a.platform === platFilter)
    .filter(a => sevFilter === 'all' || a.severity === sevFilter)
    .filter(a => a.msg.toLowerCase().includes(search) || a.platform.toLowerCase().includes(search))
    .sort((a,b) => b.ts - a.ts)
    .slice(0, 40);

  list.innerHTML = filtered.length ? filtered.map(a => `
    <div class="log-line">
      <div class="log-time">${a.time}</div>
      <div class="log-tag ${a.severity}">${a.severity.toUpperCase()}</div>
      <div class="log-msg">
        ${a.msg}${a.resolved ? ' <span style="color:var(--ok);font-size:11px;">(resolved)</span>' : ''}
        <span class="why">${a.why}${a.impact ? ` · Est. impact ₹${a.impact.toLocaleString('en-IN')}` : ''}</span>
      </div>
      <div class="log-plat">${a.platform}</div>
      ${a.severity === 'alert' && !a.resolved ? `<div class="log-actions"><button class="btn-sm" data-resolve="${a.id}">Mark resolved</button></div>` : ''}
    </div>
  `).join('') : `<div style="padding:30px;text-align:center;color:var(--muted-2);font-family:var(--mono);font-size:13px;">No alerts match these filters.</div>`;

  list.querySelectorAll('[data-resolve]').forEach(btn => {
    btn.addEventListener('click', () => {
      const a = alerts.find(x => x.id == btn.dataset.resolve);
      a.resolved = true;
      renderAlerts();
      showToast('Alert marked resolved');
    });
  });
}

function initAlertFilters(){
  const platSel = document.getElementById('filterPlatform');
  platSel.innerHTML = `<option value="all">All platforms</option>` + PLATFORMS.map(p => `<option value="${p}">${p}</option>`).join('');
  document.getElementById('filterPlatform').addEventListener('change', renderAlerts);
  document.getElementById('filterSeverity').addEventListener('change', renderAlerts);
  document.getElementById('filterSearch').addEventListener('input', renderAlerts);
}

/* ===================== OVERVIEW / KPIs / CHARTS ===================== */

function renderKPIs(){
  const today = alerts.filter(a => Date.now() - a.ts < 12 * 3600000);
  const alertCount = today.filter(a => a.severity === 'alert').length;
  const spendProtected = alerts.reduce((s,a) => s + (a.impact || 0), 0);
  const connectedCount = INTEGRATIONS.filter(i => i.connected).length;

  document.getElementById('kpiAccounts').textContent = connectedCount;
  document.getElementById('kpiAlerts').textContent = alertCount;
  document.getElementById('kpiSpend').textContent = '₹' + spendProtected.toLocaleString('en-IN');
  document.getElementById('kpiResponse').textContent = '4.2 min';
}

let spendChart, platformChart;
function renderCharts(){
  renderKPIs();
  const ctx1 = document.getElementById('spendChart');
  const ctx2 = document.getElementById('platformChart');
  if(!ctx1 || !window.Chart) return;

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const spendData = [12000, 8400, 31000, 4200, 18200, 6000, 9400];

  if(spendChart) spendChart.destroy();
  spendChart = new Chart(ctx1, {
    type: 'line',
    data: { labels: days, datasets: [{
      label: 'Spend protected (₹)',
      data: spendData,
      borderColor: '#3ddc97',
      backgroundColor: 'rgba(61,220,151,0.12)',
      tension: 0.35,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: '#3ddc97'
    }]},
    options: {
      plugins:{legend:{display:false}},
      scales:{
        x:{ticks:{color:'#8a94a0'},grid:{color:'#232a31'}},
        y:{ticks:{color:'#8a94a0'},grid:{color:'#232a31'}}
      }
    }
  });

  const platCounts = {};
  alerts.forEach(a => { platCounts[a.platform] = (platCounts[a.platform] || 0) + 1; });

  if(platformChart) platformChart.destroy();
  platformChart = new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: Object.keys(platCounts),
      datasets: [{
        data: Object.values(platCounts),
        backgroundColor: ['#3ddc97','#f0a030','#ff6b4a','#5c9eff','#b98bff'],
        borderColor: '#12161b',
        borderWidth: 2
      }]
    },
    options: { plugins:{legend:{position:'bottom',labels:{color:'#8a94a0',boxWidth:10,padding:14}}} }
  });
}

/* ===================== SETTINGS ===================== */

function initSettings(){
  document.getElementById('saveSettings').addEventListener('click', () => {
    showToast('Settings saved');
  });
  document.querySelectorAll('input[type=range]').forEach(r => {
    const out = document.getElementById(r.dataset.out);
    r.addEventListener('input', () => { out.textContent = r.value + '%'; });
  });
}

/* ===================== LIVE FEED SIMULATION ===================== */

function startLiveFeed(){
  setInterval(() => {
    alerts.unshift(genAlert(0));
    if(alerts.length > 120) alerts.pop();
    const activeTab = document.querySelector('.tab-panel.active').id;
    if(activeTab === 'tab-alerts') renderAlerts();
    if(activeTab === 'tab-overview') renderKPIs();
  }, 9000);
}

/* ===================== INIT ===================== */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initMobileSidebar();
  initDropdowns();
  initModal();
  initAlertFilters();
  initSettings();
  renderIntegrations();
  renderAccountDropdown();
  renderAlerts();
  renderCharts();
  startLiveFeed();
});
