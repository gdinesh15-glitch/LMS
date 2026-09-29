// ═══════════════════════════════════════════════════════════
//  VEMU INSTITUTE OF TECHNOLOGY — LIBRARY MANAGEMENT SYSTEM
//  Complete JS v3 — All Bugs Fixed, Full Features
// ═══════════════════════════════════════════════════════════

// ─── STORAGE ───────────────────────────────────────────────
const DB = {
  get(k)  { try{ return JSON.parse(localStorage.getItem('vemu3_'+k)); }catch(e){ return null; } },
  set(k,v){ localStorage.setItem('vemu3_'+k, JSON.stringify(v)); },
  del(k)  { localStorage.removeItem('vemu3_'+k); }
};

// ─── DATE HELPERS ──────────────────────────────────────────
const today    = ()=> new Date().toISOString().split('T')[0];
const addDays  = (d,n)=>{ const dt=new Date(d); dt.setDate(dt.getDate()+n); return dt.toISOString().split('T')[0]; };
const daysDiff = (a,b)=> Math.round((new Date(b)-new Date(a))/(86400000));
const fmtDate  = s=>{ if(!s) return '—'; return new Date(s).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); };
const timeAgo  = ts=>{ if(!ts) return 'just now'; const s=Math.floor((Date.now()-ts)/1000); if(s<60) return s+'s ago'; if(s<3600) return Math.floor(s/60)+'m ago'; if(s<86400) return Math.floor(s/3600)+'h ago'; return Math.floor(s/86400)+'d ago'; };
const uid      = ()=> 'TX'+Date.now().toString().slice(-7);
const val      = id=>{ const e=document.getElementById(id); return e?e.value.trim():''; };
const setVal   = (id,v)=>{ const e=document.getElementById(id); if(e) e.value=v; };
const getEl    = id=> document.getElementById(id);

// ─── SEED DATA ─────────────────────────────────────────────
function seedData(){
  if(DB.get('seeded')) return;

  DB.set('users',[
    {id:'VEMU@admin', name:'Dr. K. Subba Reddy',   password:'admin123', role:'admin',      email:'admin@vemu.ac.in',   dept:'Administration',              phone:'9876543200', joined:'2020-01-01'},
    {id:'LIB001',     name:'Smt. Padmavathi Devi', password:'lib123',   role:'librarian',  email:'padmavathi@vemu.ac.in', dept:'Library',                 phone:'9876543201', joined:'2021-03-15'},
    {id:'FAC001',     name:'Dr. Ramesh Kumar',      password:'fac123',   role:'faculty',    email:'ramesh@vemu.ac.in',  dept:'Computer Science & Engineering', phone:'9876543202', joined:'2019-07-01'},
    {id:'FAC002',     name:'Dr. Anitha Devi',       password:'fac123',   role:'faculty',    email:'anitha@vemu.ac.in',  dept:'Electronics & Communication', phone:'9876543203', joined:'2020-06-01', addedBy:'VEMU@admin'},
    {id:'21VE1A0501', name:'Aditya Sharma',          password:'stu123',   role:'student',    email:'aditya@student.vemu.ac.in',  dept:'B.Tech CSE', year:'3rd Year', phone:'9876543210', joined:'2021-11-01', addedBy:'FAC001'},
    {id:'21VE1A0502', name:'Priya Nair',             password:'stu123',   role:'student',    email:'priya@student.vemu.ac.in',   dept:'B.Tech CSE', year:'3rd Year', phone:'9876543211', joined:'2021-11-01', addedBy:'FAC001'},
    {id:'21VE1A0601', name:'Suresh Babu',            password:'stu123',   role:'student',    email:'suresh@student.vemu.ac.in',  dept:'B.Tech ECE', year:'3rd Year', phone:'9876543212', joined:'2021-11-01', addedBy:'FAC002'},
  ]);

  DB.set('books',[
    {id:'BK001',title:'Java: The Complete Reference',   author:'Herbert Schildt',  category:'Java',            qty:5,available:3,shelf:'A-01',isbn:'978-0071606301',year:2018,desc:'Comprehensive Java guide',       borrow:32},
    {id:'BK002',title:'Head First Java',               author:'Kathy Sierra',     category:'Java',            qty:4,available:2,shelf:'A-02',isbn:'978-0596009205',year:2015,desc:'Beginner-friendly Java',           borrow:27},
    {id:'BK003',title:'Python Crash Course',           author:'Eric Matthes',     category:'Python',          qty:5,available:4,shelf:'B-01',isbn:'978-1593279288',year:2019,desc:'Learn Python fast',               borrow:28},
    {id:'BK004',title:'Fluent Python',                 author:'Luciano Ramalho',  category:'Python',          qty:3,available:3,shelf:'B-02',isbn:'978-1491946008',year:2021,desc:'Effective Python patterns',       borrow:18},
    {id:'BK005',title:'AI: A Modern Approach',         author:'Russell & Norvig', category:'AI/ML',           qty:4,available:2,shelf:'C-01',isbn:'978-0136042594',year:2020,desc:'AI fundamentals',                 borrow:25},
    {id:'BK006',title:'Machine Learning Yearning',     author:'Andrew Ng',        category:'AI/ML',           qty:3,available:3,shelf:'C-02',isbn:'978-1491950357',year:2022,desc:'ML strategy guide',               borrow:20},
    {id:'BK007',title:'Introduction to Algorithms',    author:'Cormen et al.',    category:'Data Structures', qty:6,available:5,shelf:'D-01',isbn:'978-0262033848',year:2009,desc:'Classic algorithms textbook',      borrow:22},
    {id:'BK008',title:'Data Structures in C++',       author:'Mark Allen Weiss', category:'Data Structures', qty:4,available:4,shelf:'D-02',isbn:'978-0321441461',year:2013,desc:'DS with C++',                     borrow:15},
    {id:'BK009',title:'JavaScript: The Good Parts',   author:'Douglas Crockford',category:'Web Development', qty:3,available:2,shelf:'E-01',isbn:'978-0596517748',year:2008,desc:'Core JS concepts',                borrow:19},
    {id:'BK010',title:'HTML & CSS Design',             author:'Jon Duckett',      category:'Web Development', qty:5,available:5,shelf:'E-02',isbn:'978-1118008188',year:2011,desc:'Web design basics',               borrow:16},
    {id:'BK011',title:'Computer Networks',             author:'Tanenbaum',        category:'Networks',        qty:4,available:3,shelf:'F-01',isbn:'978-0132126953',year:2010,desc:'Networking concepts',              borrow:14},
    {id:'BK012',title:'Operating System Concepts',    author:'Silberschatz',     category:'Operating Systems',qty:5,available:5,shelf:'G-01',isbn:'978-1118063330',year:2018,desc:'OS fundamentals',                borrow:12},
    {id:'BK013',title:'Engineering Mathematics',       author:'B.S. Grewal',      category:'Mathematics',     qty:6,available:6,shelf:'H-01',isbn:'978-8121902915',year:2020,desc:'Engineering math reference',      borrow:30},
    {id:'BK014',title:'Engineering Physics',           author:'Gaur & Gupta',     category:'Physics',         qty:4,available:4,shelf:'H-02',isbn:'978-8121901441',year:2019,desc:'Physics for engineers',            borrow:11},
  ]);

  const t = today();
  DB.set('issued',[
    {txId:'TX0000001',studentId:'21VE1A0501',studentName:'Aditya Sharma',   bookId:'BK001',bookTitle:'Java: The Complete Reference',issueDate:addDays(t,-20),dueDate:addDays(t,-6), status:'overdue',fine:0,issuedBy:'LIB001',ts:Date.now()-20*86400000},
    {txId:'TX0000002',studentId:'21VE1A0502',studentName:'Priya Nair',      bookId:'BK005',bookTitle:'AI: A Modern Approach',       issueDate:addDays(t,-8), dueDate:addDays(t,6),  status:'issued', fine:0,issuedBy:'LIB001',ts:Date.now()-8*86400000},
    {txId:'TX0000003',studentId:'21VE1A0601',studentName:'Suresh Babu',     bookId:'BK003',bookTitle:'Python Crash Course',         issueDate:addDays(t,-3), dueDate:addDays(t,11), status:'issued', fine:0,issuedBy:'FAC001',ts:Date.now()-3*86400000},
    {txId:'TX0000004',studentId:'21VE1A0501',studentName:'Aditya Sharma',   bookId:'BK013',bookTitle:'Engineering Mathematics',     issueDate:addDays(t,-1), dueDate:addDays(t,2),  status:'issued', fine:0,issuedBy:'LIB001',ts:Date.now()-86400000},
  ]);
  DB.set('returned',[]);
  DB.set('activity',[
    {icon:'fa-book',        bg:'rgba(125,211,252,.15)',color:'#7dd3fc',text:'Java: The Complete Reference added to catalog',         ts:Date.now()-5*86400000},
    {icon:'fa-user-plus',   bg:'rgba(110,231,183,.15)',color:'#6ee7b7',text:'Student Aditya Sharma registered (21VE1A0501)',         ts:Date.now()-4*86400000},
    {icon:'fa-arrow-up',    bg:'rgba(253,186,116,.15)',color:'#fdba74',text:'Book issued to Aditya Sharma — Java: The Complete Ref.',ts:Date.now()-3*86400000},
    {icon:'fa-hand-heart',  bg:'rgba(196,181,253,.15)',color:'#c4b5fd',text:'Donation received: Engineering Physics by Priya Nair',  ts:Date.now()-2*86400000},
  ]);
  DB.set('notifications',[]);
  DB.set('bookRequests',[]);
  DB.set('donations',[
    {donId:'DON001',studentId:'21VE1A0502',studentName:'Priya Nair',rollNo:'21VE1A0502',studentDept:'B.Tech CSE',title:'Engineering Physics',author:'Gaur & Gupta',category:'Physics',condition:'Good',copies:1,notes:'Good condition',status:'approved',date:addDays(today(),-2),ts:Date.now()-2*86400000},
  ]);
  DB.set('seeded', true);
}

// ─── NOTIFICATION HELPERS ──────────────────────────────────
function pushNotif(icon,bg,color,text,type='info'){
  const notifs = DB.get('notifications')||[];
  // De-dupe same text within 1 min
  const recent = notifs.find(n=>n.text===text&&Date.now()-n.ts<60000);
  if(recent) return;
  notifs.unshift({icon,bg,color,text,type,ts:Date.now()});
  if(notifs.length>30) notifs.pop();
  DB.set('notifications',notifs);
  refreshNotifBadge();
  refreshNotifPanel();
}
function addNotif(icon,color,text,type){ pushNotif(icon,'rgba(61,50,88,.6)',color,text,type); }

function refreshNotifBadge(){
  const badge = getEl('notifBadge');
  if(!badge) return;
  const notifs = DB.get('notifications')||[];
  if(notifs.length===0){ badge.style.display='none'; return; }
  badge.style.display='flex';
  badge.textContent = notifs.length>9?'9+':notifs.length;
}

function refreshNotifPanel(){
  const list = getEl('notifList'); if(!list) return;
  const notifs = DB.get('notifications')||[];
  if(!notifs.length){
    list.innerHTML='<div class="notif-empty"><i class="fas fa-bell-slash"></i><p>All caught up! No notifications.</p></div>';
    return;
  }
  list.innerHTML = notifs.map(n=>`
    <div class="notif-item">
      <div class="ni-icon" style="background:${n.bg||'rgba(61,50,88,.6)'};color:${n.color}"><i class="fas ${n.icon}"></i></div>
      <div style="flex:1">
        <strong>${n.text}</strong>
        <span>${timeAgo(n.ts)}</span>
      </div>
    </div>`).join('');
}

function renderNotifications(){ refreshNotifBadge(); refreshNotifPanel(); }

window.clearNotifs = function(){
  DB.set('notifications',[]);
  refreshNotifBadge();
  refreshNotifPanel();
  document.getElementById('notifPanel')?.classList.remove('open');
};

window.toggleNotif = function(){
  const p = getEl('notifPanel');
  if(p){ p.classList.toggle('open'); refreshNotifPanel(); }
};

// ─── ACTIVITY ──────────────────────────────────────────────
function addActivity(icon,color,text,bg){
  const acts = DB.get('activity')||[];
  acts.unshift({icon, bg:bg||'rgba(61,50,88,.6)', color, text, ts:Date.now()});
  if(acts.length>40) acts.pop();
  DB.set('activity',acts);
}

function renderDashActivity(){
  const acts = (DB.get('activity')||[]).slice(0,8);
  const g = getEl('dashActivity'); if(!g) return;
  if(!acts.length){ g.innerHTML='<div class="empty"><i class="fas fa-history"></i><p>No recent activity</p></div>'; return; }
  g.innerHTML = acts.map(a=>`
    <div class="act-row">
      <div class="act-dot" style="background:${a.bg||'rgba(61,50,88,.6)'};color:${a.color}"><i class="fas ${a.icon}"></i></div>
      <div class="act-txt"><div class="act-main">${a.text}</div><div class="act-sub">${timeAgo(a.ts)}</div></div>
    </div>`).join('');
}

function renderFullActivity(){
  const acts = DB.get('activity')||[];
  const g = getEl('fullActivity'); if(!g) return;
  if(!acts.length){ g.innerHTML='<div class="empty"><i class="fas fa-history"></i><p>No activity yet</p></div>'; return; }
  g.innerHTML = acts.map(a=>`
    <div class="act-row">
      <div class="act-dot" style="background:${a.bg||'rgba(61,50,88,.6)'};color:${a.color}"><i class="fas ${a.icon}"></i></div>
      <div class="act-txt"><div class="act-main">${a.text}</div><div class="act-sub">${timeAgo(a.ts)}</div></div>
    </div>`).join('');
}

// ─── ANIMATED COUNTER ──────────────────────────────────────
function animateNum(id,target){
  const el=getEl(id); if(!el) return;
  let cur=0; const step=Math.max(1,Math.ceil(target/55));
  const t=setInterval(()=>{ cur=Math.min(cur+step,target); el.textContent=cur.toLocaleString('en-IN'); if(cur>=target) clearInterval(t); },18);
}

// ─── CLOCK ─────────────────────────────────────────────────
function startClock(){
  const tick=()=>{ const n=new Date(); const el=getEl('tbClock'); if(el) el.textContent=n.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}); };
  tick(); setInterval(tick,1000);
}

// ─── TOAST ─────────────────────────────────────────────────
window.showToast = function(msg,type='info'){
  const wrap = getEl('toastWrap'); if(!wrap) return;
  const icons={success:'✅',error:'❌',info:'ℹ️',warn:'⚠️'};
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerHTML=`<span>${icons[type]||'ℹ️'}</span><span style="flex:1">${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(()=>{ t.classList.add('exit'); setTimeout(()=>t.remove(),400); },3400);
};

// ─── MODAL ─────────────────────────────────────────────────
window.openModal  = id=>{ const e=getEl(id); if(e) e.classList.add('open'); };
window.closeModal = id=>{ const e=getEl(id); if(e) e.classList.remove('open'); };
document.addEventListener('click',e=>{ if(e.target.classList.contains('modal-overlay')) e.target.classList.remove('open'); });

let _confirmCb = null;
window.openConfirm = function(msg,cb){
  _confirmCb=cb;
  const m=getEl('confirmMsg'); if(m) m.textContent=msg;
  const y=getEl('confirmYes'); if(y){ y.onclick=()=>{ if(_confirmCb) _confirmCb(); closeModal('confirmModal'); }; }
  openModal('confirmModal');
};

// ─── SIDEBAR ───────────────────────────────────────────────
window.openSidebar  = ()=> getEl('sidebar')?.classList.add('open');
window.closeSidebar = ()=> getEl('sidebar')?.classList.remove('open');
window.toggleDark   = ()=>{
  document.body.classList.toggle('lm');
  const isLight = document.body.classList.contains('lm');
  const ic=getEl('darkIcon');
  if(ic) ic.className= isLight ? 'fas fa-sun' : 'fas fa-moon';
  DB.set('theme', isLight ? 'light' : 'dark');
  // Sync settings toggle if present
  const settingsToggle = getEl('darkModeToggle');
  if(settingsToggle) settingsToggle.checked = !isLight;
};

window.setPortalTheme = function(themeName) {
  DB.set('portalTheme', themeName);
  document.body.removeAttribute('data-theme');
  if (themeName !== 'default') {
    document.body.setAttribute('data-theme', themeName);
  }
  // Update swatches visually
  document.querySelectorAll('.theme-swatch').forEach(el => {
    el.classList.remove('active');
    if (el.dataset.tname === themeName) el.classList.add('active');
  });
};

window.logout = ()=>{ DB.del('session'); showToast('Logged out successfully.','info'); setTimeout(()=>window.location.href='/',700); };

// ─── SECTION NAVIGATION ────────────────────────────────────
const PAGE_TITLES = {
  dashboard:'Dashboard',addLibrarian:'Add Librarian',addFaculty:'Add Faculty',
  addStudent:'Add Student',allUsers:'All Users',activity:'Activity Log',
  profile:'My Profile',addBook:'Add New Book',manageBooks:'Manage Books',
  searchBooks:'Search Books',issueBook:'Issue Book',returnBook:'Return Book',
  issuedList:'Issued Books List',overdue:'Overdue Books',fines:'Fine Management',
  reports:'Reports',myStudents:'My Students',viewBooks:'Browse Books',
  availableBooks:'Available Books',myBooks:'My Issued Books',myFines:'My Fines',
  requestBook:'Request a Book',donateBook:'Donate a Book',donations:'Book Donations',
  bookRequests:'Student Book Requests',stats:'Library Statistics',
  adminBooks:'Library Books (Admin)',adminBrowseBooks:'Browse All Books (Admin)',
  systemSettings:'System Settings',quickActions:'Quick Actions',
  settings:'Settings',libraryInfo:'Library Info'
};

window.showSec = function(id){
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n=>n.classList.remove('active'));
  const sec=getEl('sec-'+id); if(sec) sec.classList.add('active');
  // Highlight active nav
  document.querySelectorAll(`.nav-link[data-sec="${id}"]`).forEach(n=>n.classList.add('active'));
  const pt=getEl('pageTitle'); if(pt) pt.textContent=PAGE_TITLES[id]||id;
  // Dynamic reloads
  const reloads={
    profile:renderProfile, allUsers:renderAllUsers, activity:renderFullActivity,
    manageBooks:renderBooksTable, issuedList:renderIssuedList,
    overdue:renderOverdue, fines:renderFines, reports:()=>renderReports('issued'),
    myStudents:renderMyStudents, myBooks:renderMyBooks, myFines:renderMyFines,
    searchBooks:()=>loadBooksGrid('searchBooksGrid'), viewBooks:()=>loadBooksGrid('facBooksGrid'),
    availableBooks:()=>loadBooksGrid('availBooksGrid'),
    returnBook:()=>{ const d=getEl('ret_date'); if(d) d.value=today(); renderReturnHistory(); },
    requestBook:()=>{ renderMyRequests(); const d=getEl('req_date');if(d)d.value=today(); },
    donateBook:()=>renderMyDonations(),
    donations:()=>renderAllDonations(),
    bookRequests:renderLibBookRequests,
    stats:renderLibraryStats,
    adminBooks:renderAdminBooksTable,
    adminBrowseBooks:()=>loadBooksGrid('adminBrowseGrid'),
    systemSettings:renderSystemSettings,
    quickActions:renderQuickActions,
    settings:renderSettings,
    dashboard:()=>{ refreshDashboard(); }
  };
  if(reloads[id]) reloads[id]();
  // Scroll main area to top when switching sections
  const mainArea = document.querySelector('.main-area');
  if(mainArea) mainArea.scrollTo({top:0, behavior:'smooth'});
  if(window.innerWidth<900) closeSidebar();
};

function refreshDashboard(){
  const CU=DB.get('session'); if(!CU) return;
  if(CU.role==='admin')     { renderAdminStats(); renderUserDist(); renderDashActivity(); }
  if(CU.role==='librarian') { renderLibStats(); renderCatChart(); renderMostBorrowed(); renderDashActivity(); }
  if(CU.role==='faculty')   { renderFacStats(CU); renderFacStudents(CU); renderDashActivity(); }
  if(CU.role==='student')   { renderStuStats(CU); renderStuCurrentBooks(CU); renderDueDateAlerts(CU); renderMostBorrowed(); }
}

// ─── LOGIN PAGE ────────────────────────────────────────────
if(getEl('loginId')){
  seedData();
  const rem=DB.get('remember');
  if(rem){ setVal('loginId',rem.id||''); setVal('loginPw',rem.pw||''); if(getEl('rememberMe')) getEl('rememberMe').checked=true; }

  window.doLogin = function(){
    const id=val('loginId'), pw=val('loginPw');
    const selRole=document.querySelector('.role-opt.active')?.dataset.role||'admin';
    const err=getEl('loginErr');
    if(!id||!pw){ err.textContent='Please enter User ID and password.'; return; }
    const users=DB.get('users')||[];
    const user=users.find(u=>u.id===id&&u.password===pw);
    if(!user){ err.textContent='Invalid User ID or password.'; shakeCard(); return; }
    if(user.role!==selRole){ err.textContent=`This ID is for role "${user.role}", not "${selRole}".`; return; }
    err.textContent='';
    if(getEl('rememberMe')?.checked) DB.set('remember',{id,pw});
    else DB.del('remember');
    DB.set('session',user);
    showToast('Welcome, '+user.name+'!','success');
    const pages={admin:'/admin',librarian:'/librarian',faculty:'/faculty',student:'/student'};
    setTimeout(()=>window.location.href=pages[user.role]||'/',800);
  };

  getEl('loginPw')?.addEventListener('keydown',e=>{ if(e.key==='Enter') doLogin(); });
  getEl('loginId')?.addEventListener('keydown',e=>{ if(e.key==='Enter') getEl('loginPw').focus(); });

  window.fillDemo=(role,id,pw)=>{
    document.querySelectorAll('.role-opt').forEach(o=>{ o.classList.remove('active'); if(o.dataset.role===role){o.classList.add('active');o.querySelector('input').checked=true;} });
    setVal('loginId',id); setVal('loginPw',pw);
  };
  window.togglePw=()=>{
    const i=getEl('loginPw'),ic=getEl('eyeIco');
    i.type=i.type==='password'?'text':'password';
    if(ic) ic.className=i.type==='password'?'fas fa-eye':'fas fa-eye-slash';
  };
  window.showForgotModal=()=>openModal('forgotModal');

  function shakeCard(){
    const el=document.querySelector('.login-card');
    if(!el) return;
    el.style.animation=''; void el.offsetWidth;
    el.style.animation='shake .45s ease';
    setTimeout(()=>el.style.animation='',500);
  }
  const ss=document.createElement('style');
  ss.textContent='@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-9px)}40%,80%{transform:translateX(9px)}}';
  document.head.appendChild(ss);

  // Floating book particles on login page
  const fb=getEl('floatingBooks');
  if(fb){ const emojis=['📚','📖','📗','📘','📙','✏️','🎓','🔖'];
    for(let i=0;i<14;i++){
      const d=document.createElement('div'); d.className='fb';
      d.textContent=emojis[Math.floor(Math.random()*emojis.length)];
      d.style.cssText=`left:${Math.random()*100}%;animation-duration:${Math.random()*18+12}s;animation-delay:${Math.random()*14}s;font-size:${Math.random()*18+12}px`;
      fb.appendChild(d);
    }
  }

  document.querySelectorAll('.role-opt').forEach(opt=>{
    opt.addEventListener('click',function(){
      document.querySelectorAll('.role-opt').forEach(o=>o.classList.remove('active'));
      this.classList.add('active');
      this.querySelector('input').checked=true;
    });
  });
}

// ─── DASHBOARD INIT ────────────────────────────────────────
window.initDashboard = function(role){
  seedData();
  const CU=DB.get('session');
  if(!CU||CU.role!==role){ window.location.href='/'; return; }

  // Sidebar user info
  const av=getEl('sbAvatar'); if(av) av.textContent=CU.name.charAt(0).toUpperCase();
  const sn=getEl('sbName');   if(sn) sn.textContent=CU.name;
  const sr=getEl('sbRoleBadge'); if(sr) sr.textContent=CU.role.charAt(0).toUpperCase()+CU.role.slice(1);

  // Theme
  if(DB.get('theme')==='light'){ document.body.classList.add('lm'); const ic=getEl('darkIcon'); if(ic) ic.className='fas fa-sun'; }
  const pTheme = DB.get('portalTheme') || 'default';
  if(pTheme !== 'default') document.body.setAttribute('data-theme', pTheme);

  // Date in header
  const sd=getEl('secDate');
  if(sd) sd.textContent=new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

  startClock();
  renderNotifications();

  // Role dashboards
  if(role==='admin')     setupAdmin(CU);
  if(role==='librarian') setupLibrarian(CU);
  if(role==='faculty')   setupFaculty(CU);
  if(role==='student')   setupStudent(CU);

  // Global clicks
  document.addEventListener('click',e=>{
    if(!e.target.closest('.sidebar')&&!e.target.closest('.hamburger')&&window.innerWidth<900) closeSidebar();
    if(!e.target.closest('.notif-panel')&&!e.target.closest('.notif-btn')) getEl('notifPanel')?.classList.remove('open');
  });

  // Mark nav links with data-sec
  document.querySelectorAll('.nav-link[onclick]').forEach(link=>{
    const m=link.getAttribute('onclick')?.match(/showSec\('([^']+)'\)/);
    if(m) link.dataset.sec=m[1];
  });
  // Mark first active
  const first=document.querySelector('.nav-link.active');
  if(first){ const m=first.getAttribute('onclick')?.match(/showSec\('([^']+)'\)/); if(m) first.dataset.sec=m[1]; }

  // Initialize portal background particles
  initPortalBackground();
};

// ═══════════════════════════════════════════════════════════
//  ADMIN
// ═══════════════════════════════════════════════════════════
function setupAdmin(CU){
  renderAdminGreeting(CU);
  renderLibTicker();
  renderAdminStats();
  renderUserDist();
  renderDashActivity();
  buildUserForm('addLibForm','librarian','LIB',false,CU.id);
  buildUserForm('addFacForm','faculty','FAC',false,CU.id);
  buildUserForm('addStuForm','student','21VE1A0',true,CU.id);
  // Pre-load all sections
  renderAdminBooksTable();
  renderQuickActions();
  renderMostBorrowed();
  loadBooksGrid('adminBrowseGrid');
}

function renderAdminGreeting(CU){
  const g=getEl('adminGreeting'); if(!g) return;
  const hr=new Date().getHours();
  const greet=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
  const emoji=hr<12?'☀️':hr<17?'🌤️':'🌙';
  g.innerHTML=`
    <div class="admin-greeting">
      <div class="ag-emoji">${emoji}</div>
      <div class="ag-text">
        <h3>${greet}, ${CU.name.split(' ')[0]}! Welcome to Admin Panel</h3>
        <p>VEMU Institute of Technology — Central Library Management System</p>
      </div>
      <div class="ag-time-pill" id="greetClock"></div>
    </div>`;
  const tick=()=>{ const t=new Date(); const el=getEl('greetClock'); if(el) el.textContent=t.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true})+' • '+t.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}); };
  tick(); setInterval(tick,1000);
}

function renderLibTicker(){
  const g=getEl('libTicker'); if(!g) return;
  const books=DB.get('books')||[], users=DB.get('users')||[];
  const issued=(DB.get('issued')||[]).filter(i=>i.status!=='returned');
  const overdue=issued.filter(i=>i.dueDate<today());
  const items=[
    {icon:'fa-books',text:`<strong>${books.length}</strong> titles in catalog`},
    {icon:'fa-copy',text:`<strong>${books.reduce((s,b)=>s+b.qty,0)}</strong> total copies`},
    {icon:'fa-check-circle',text:`<strong>${books.reduce((s,b)=>s+b.available,0)}</strong> copies available`},
    {icon:'fa-arrow-up',text:`<strong>${issued.length}</strong> books currently issued`},
    {icon:'fa-exclamation-triangle',text:`<strong>${overdue.length}</strong> overdue books`},
    {icon:'fa-users',text:`<strong>${users.filter(u=>u.role==='student').length}</strong> students registered`},
    {icon:'fa-chalkboard-teacher',text:`<strong>${users.filter(u=>u.role==='faculty').length}</strong> faculty members`},
    {icon:'fa-user-tie',text:`<strong>${users.filter(u=>u.role==='librarian').length}</strong> librarians`},
    {icon:'fa-university',text:'VEMU Institute of Technology — Est. 2005'},
    {icon:'fa-shield-alt',text:'AICTE Approved • JNTUA Affiliated'},
  ];
  const inner=items.concat(items).map(it=>`<span class="ticker-item"><i class="fas ${it.icon}"></i>${it.text}</span>`).join('');
  g.innerHTML=`<div class="lib-ticker-inner">${inner}</div>`;
}

function renderAdminStats(){
  const users=DB.get('users')||[];
  const books=DB.get('books')||[];
  const issued=(DB.get('issued')||[]).filter(i=>i.status!=='returned');
  const donations=(DB.get('donations')||[]).length;
  const stats=[
    {label:'Total Librarians',  val:users.filter(u=>u.role==='librarian').length, icon:'fa-user-tie',          color:'#7dd3fc', bg:'rgba(125,211,252,.15)', sc:'#7dd3fc'},
    {label:'Total Faculty',     val:users.filter(u=>u.role==='faculty').length,   icon:'fa-chalkboard-teacher',color:'#c4b5fd', bg:'rgba(196,181,253,.15)', sc:'#c4b5fd'},
    {label:'Total Students',    val:users.filter(u=>u.role==='student').length,   icon:'fa-user-graduate',     color:'#6ee7b7', bg:'rgba(110,231,183,.15)', sc:'#6ee7b7'},
    {label:'Total Books',       val:books.reduce((s,b)=>s+b.qty,0),               icon:'fa-books',             color:'#fde68a', bg:'rgba(253,230,138,.15)', sc:'#fde68a'},
    {label:'Books Issued',      val:issued.length,                                 icon:'fa-arrow-up',          color:'#fdba74', bg:'rgba(253,186,116,.15)', sc:'#fdba74'},
    {label:'Total Donations',   val:donations,                                     icon:'fa-hand-holding-heart',color:'#f9a8d4', bg:'rgba(249,168,212,.15)', sc:'#f9a8d4'},
    {label:'Total Users',       val:users.length,                                  icon:'fa-users',             color:'#a5b4fc', bg:'rgba(165,180,252,.15)', sc:'#a5b4fc'},
  ];
  const g=getEl('adminStats'); if(!g) return;
  g.innerHTML=stats.map((s,i)=>`
    <div class="stat-card" style="--sc-color:${s.sc};animation-delay:${i*.07}s">
      <div class="sc-icon" style="background:${s.bg};color:${s.color}"><i class="fas ${s.icon}"></i></div>
      <div class="sc-num" id="adm_n${i}">0</div>
      <div class="sc-label">${s.label}</div>
      <div class="sc-bg"><i class="fas ${s.icon}"></i></div>
    </div>`).join('');
  stats.forEach((s,i)=>animateNum(`adm_n${i}`,s.val));
}

function renderUserDist(){
  const users=DB.get('users')||[];
  const roles=[
    {r:'librarian',label:'Librarians',color:'#7dd3fc',bg:'rgba(125,211,252,.15)',icon:'fa-user-tie'},
    {r:'faculty',  label:'Faculty',   color:'#c4b5fd',bg:'rgba(196,181,253,.15)',icon:'fa-chalkboard-teacher'},
    {r:'student',  label:'Students',  color:'#6ee7b7',bg:'rgba(110,231,183,.15)',icon:'fa-user-graduate'},
  ];
  const total=users.filter(u=>u.role!=='admin').length||1;
  const g=getEl('userDist'); if(!g) return;
  g.innerHTML=roles.map(r=>{
    const cnt=users.filter(u=>u.role===r.r).length;
    const pct=Math.round(cnt/total*100);
    return`<div class="ud-row">
      <div class="ud-icon" style="background:${r.bg};color:${r.color}"><i class="fas ${r.icon}"></i></div>
      <div class="ud-label">${r.label}</div>
      <div class="ud-bar-wrap"><div class="ud-bar" style="width:0;background:${r.color}" data-w="${pct}"></div></div>
      <div class="ud-count">${cnt}</div>
    </div>`;
  }).join('');
  setTimeout(()=>document.querySelectorAll('.ud-bar').forEach(b=>b.style.width=b.dataset.w+'%'),120);
}

// ═══════════════════════════════════════════════════════════
//  LIBRARIAN
// ═══════════════════════════════════════════════════════════
function setupLibrarian(CU){
  renderLibStats();
  renderCatChart();
  renderMostBorrowed();
  renderDashActivity();
  buildUserForm('libAddStuForm','student','21VE1A0',true,CU.id);
  renderBooksTable();
  const id=getEl('is_date'),idue=getEl('is_due');
  if(id){ id.value=today(); if(idue) idue.value=addDays(today(),14); }
  const rd=getEl('ret_date'); if(rd) rd.value=today();
}

function renderLibStats(){
  const books=DB.get('books')||[];
  const users=DB.get('users')||[];
  const issued=DB.get('issued')||[];
  const active=issued.filter(i=>i.status!=='returned');
  const overdue=active.filter(i=>i.dueDate<today());
  const totalB=books.reduce((s,b)=>s+b.qty,0);
  const avail=books.reduce((s,b)=>s+b.available,0);
  const stats=[
    {label:'Total Books',    val:totalB,                                          icon:'fa-books',              color:'#fde68a',bg:'rgba(253,230,138,.15)',sc:'#fde68a'},
    {label:'Available Books',val:avail,                                            icon:'fa-check-circle',       color:'#6ee7b7',bg:'rgba(110,231,183,.15)',sc:'#6ee7b7'},
    {label:'Issued Books',   val:active.length,                                   icon:'fa-arrow-up',           color:'#fdba74',bg:'rgba(253,186,116,.15)',sc:'#fdba74'},
    {label:'Overdue Books',  val:overdue.length,                                  icon:'fa-exclamation-triangle',color:'#f87171',bg:'rgba(248,113,113,.15)',sc:'#f87171'},
    {label:'Total Students', val:users.filter(u=>u.role==='student').length,      icon:'fa-user-graduate',      color:'#c4b5fd',bg:'rgba(196,181,253,.15)',sc:'#c4b5fd'},
    {label:'Total Users',    val:users.filter(u=>u.role!=='admin').length,        icon:'fa-users',              color:'#a5b4fc',bg:'rgba(165,180,252,.15)',sc:'#a5b4fc'},
  ];
  const g=getEl('libStats'); if(!g) return;
  g.innerHTML=stats.map((s,i)=>`
    <div class="stat-card" style="--sc-color:${s.sc};animation-delay:${i*.07}s">
      <div class="sc-icon" style="background:${s.bg};color:${s.color}"><i class="fas ${s.icon}"></i></div>
      <div class="sc-num" id="lib_n${i}">0</div>
      <div class="sc-label">${s.label}</div>
      <div class="sc-bg"><i class="fas ${s.icon}"></i></div>
    </div>`).join('');
  stats.forEach((s,i)=>animateNum(`lib_n${i}`,s.val));
}

function renderCatChart(){
  const books=DB.get('books')||[];
  const cats={};
  books.forEach(b=>{ cats[b.category]=(cats[b.category]||0)+b.qty; });
  const catColors={'Java':'#fde68a','Python':'#7dd3fc','AI/ML':'#c4b5fd','Data Structures':'#6ee7b7','Web Development':'#f9a8d4','Networks':'#5eead4','Operating Systems':'#fdba74','Mathematics':'#a5b4fc','Physics':'#fca5a5','Other':'#d4d4d4'};
  const max=Math.max(...Object.values(cats),1);
  const g=getEl('catChart'); if(!g) return;
  g.innerHTML=Object.entries(cats).map(([k,v])=>`
    <div class="cat-item">
      <div class="cat-lbl"><span>${k}</span><span style="font-weight:600;color:${catColors[k]||'#d4d4d4'}">${v}</span></div>
      <div class="cat-track"><div class="cat-fill" style="width:0;background:${catColors[k]||'#d4d4d4'}" data-w="${Math.round(v/max*100)}"></div></div>
    </div>`).join('');
  setTimeout(()=>document.querySelectorAll('.cat-fill').forEach(b=>b.style.width=b.dataset.w+'%'),120);
}

function renderMostBorrowed(){
  const books=(DB.get('books')||[]).sort((a,b)=>b.borrow-a.borrow).slice(0,5);
  ['mostBorrowed','popularBooks'].forEach(id=>{
    const g=getEl(id); if(!g) return;
    g.innerHTML=books.map((b,i)=>`
      <div class="rank-row">
        <div class="rank-num ${['r1','r2','r3','',''][i]}">${i+1}</div>
        <div class="rank-info"><div class="rank-title">${b.title}</div><div class="rank-sub">${b.author} · ${b.category}</div></div>
        <span class="rank-count">${b.borrow}×</span>
      </div>`).join('');
  });
}

// ═══════════════════════════════════════════════════════════
//  FACULTY
// ═══════════════════════════════════════════════════════════
function setupFaculty(CU){
  renderFacStats(CU);
  renderDashActivity();
  buildUserForm('facAddStuForm','student','21VE1A0',true,CU.id);
  renderFacStudents(CU);
  loadBooksGrid('facBooksGrid');
  const id=getEl('is_date'),idue=getEl('is_due');
  if(id){ id.value=today(); if(idue) idue.value=addDays(today(),14); }
  const rd=getEl('ret_date'); if(rd) rd.value=today();
}

function renderFacStats(CU){
  const users=DB.get('users')||[];
  const issued=(DB.get('issued')||[]).filter(i=>i.issuedBy===CU.id&&i.status!=='returned');
  const myStu=users.filter(u=>u.role==='student'&&u.addedBy===CU.id);
  const allStu=users.filter(u=>u.role==='student').length;
  const stats=[
    {label:'My Students',    val:myStu.length,  icon:'fa-user-graduate',color:'#6ee7b7',bg:'rgba(110,231,183,.15)',sc:'#6ee7b7'},
    {label:'Books Issued',   val:issued.length,  icon:'fa-arrow-up',    color:'#fdba74',bg:'rgba(253,186,116,.15)',sc:'#fdba74'},
    {label:'Total Books',    val:(DB.get('books')||[]).reduce((s,b)=>s+b.qty,0), icon:'fa-books', color:'#fde68a',bg:'rgba(253,230,138,.15)',sc:'#fde68a'},
    {label:'All Students',   val:allStu,          icon:'fa-users',       color:'#c4b5fd',bg:'rgba(196,181,253,.15)',sc:'#c4b5fd'},
  ];
  const g=getEl('facStats'); if(!g) return;
  g.innerHTML=stats.map((s,i)=>`
    <div class="stat-card" style="--sc-color:${s.sc};animation-delay:${i*.07}s">
      <div class="sc-icon" style="background:${s.bg};color:${s.color}"><i class="fas ${s.icon}"></i></div>
      <div class="sc-num" id="fac_n${i}">0</div>
      <div class="sc-label">${s.label}</div>
      <div class="sc-bg"><i class="fas ${s.icon}"></i></div>
    </div>`).join('');
  stats.forEach((s,i)=>animateNum(`fac_n${i}`,s.val));
}

function renderFacStudents(CU){
  const users=DB.get('users')||[];
  const myStu=users.filter(u=>u.role==='student'&&u.addedBy===CU.id);
  const g=getEl('dashStudents'); if(!g) return;
  if(!myStu.length){ g.innerHTML='<div class="empty"><i class="fas fa-user-graduate"></i><p>No students added yet</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>ID</th><th>Name</th><th>Dept</th><th>Year</th></tr></thead><tbody>`+
    myStu.map(s=>`<tr>
      <td style="font-family:monospace;color:var(--gold2)">${s.id}</td>
      <td style="color:var(--t1);font-weight:600">${s.name}</td>
      <td>${s.dept||'—'}</td><td>${s.year||'—'}</td>
    </tr>`).join('')+'</tbody></table>';
}

function renderMyStudents(){
  const CU=DB.get('session');
  const users=DB.get('users')||[];
  const myStu=users.filter(u=>u.role==='student'&&u.addedBy===CU.id);
  const g=getEl('myStudentsTable'); if(!g) return;
  if(!myStu.length){ g.innerHTML='<div class="empty"><i class="fas fa-users"></i><p>No students found</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Year</th><th>Joined</th></tr></thead><tbody>`+
    myStu.map(s=>`<tr>
      <td style="font-family:monospace;color:var(--gold2)">${s.id}</td>
      <td style="color:var(--t1);font-weight:600">${s.name}</td>
      <td>${s.email||'—'}</td><td>${s.dept||'—'}</td><td>${s.year||'—'}</td><td>${fmtDate(s.joined)}</td>
    </tr>`).join('')+'</tbody></table>';
}

// ═══════════════════════════════════════════════════════════
//  STUDENT
// ═══════════════════════════════════════════════════════════
function setupStudent(CU){
  renderStuStats(CU);
  renderStuCurrentBooks(CU);
  renderMostBorrowed();
  renderDueDateAlerts(CU);
  loadBooksGrid('availBooksGrid');
  pushDueNotifications(CU);
}

function renderStuStats(CU){
  const issued=DB.get('issued')||[];
  const myIssued=issued.filter(i=>i.studentId===CU.id);
  const active=myIssued.filter(i=>i.status!=='returned');
  const returned=myIssued.filter(i=>i.status==='returned');
  const overdue=active.filter(i=>i.dueDate<today());
  const fine=overdue.reduce((s,i)=>s+daysDiff(i.dueDate,today())*5,0);
  const stats=[
    {label:'Books Issued',   val:active.length,  icon:'fa-bookmark',         color:'#7dd3fc',bg:'rgba(125,211,252,.15)',sc:'#7dd3fc'},
    {label:'Returned',       val:returned.length, icon:'fa-check-circle',    color:'#6ee7b7',bg:'rgba(110,231,183,.15)',sc:'#6ee7b7'},
    {label:'Overdue',        val:overdue.length,  icon:'fa-exclamation-triangle',color:'#f87171',bg:'rgba(248,113,113,.15)',sc:'#f87171'},
    {label:'Fine (₹)',       val:fine,            icon:'fa-rupee-sign',       color:'#fdba74',bg:'rgba(253,186,116,.15)',sc:'#fdba74'},
  ];
  const g=getEl('stuStats'); if(!g) return;
  g.innerHTML=stats.map((s,i)=>`
    <div class="stat-card" style="--sc-color:${s.sc};animation-delay:${i*.07}s">
      <div class="sc-icon" style="background:${s.bg};color:${s.color}"><i class="fas ${s.icon}"></i></div>
      <div class="sc-num" id="stu_n${i}">0</div>
      <div class="sc-label">${s.label}</div>
      <div class="sc-bg"><i class="fas ${s.icon}"></i></div>
    </div>`).join('');
  stats.forEach((s,i)=>animateNum(`stu_n${i}`,s.val));
  const w=getEl('stuWelcome');
  if(w) w.innerHTML=`<i class="fas fa-graduation-cap"></i><div><h3>Welcome back, ${CU.name.split(' ')[0]}! 👋</h3><p>ID: ${CU.id} &nbsp;•&nbsp; ${CU.dept||'VEMU'} &nbsp;•&nbsp; ${CU.year||'Student'}</p></div>`;
}

function renderStuCurrentBooks(CU){
  const issued=(DB.get('issued')||[]).filter(i=>i.studentId===CU.id&&i.status!=='returned');
  const g=getEl('stuCurrentBooks'); if(!g) return;
  if(!issued.length){ g.innerHTML='<div class="empty"><i class="fas fa-bookmark"></i><p>No books currently issued to you</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>Book</th><th>Due Date</th><th>Days Left</th><th>Status</th></tr></thead><tbody>`+
    issued.map(i=>{
      const late=i.dueDate<today();
      const days=late ? daysDiff(i.dueDate,today()) : daysDiff(today(),i.dueDate);
      const daysLabel=late ? `${days}d overdue` : days===0?'Due Today!': `${days}d left`;
      return`<tr class="${late?'overdue-tr':''}">
        <td style="color:var(--t1);font-weight:500;max-width:200px">${i.bookTitle}</td>
        <td>${fmtDate(i.dueDate)}</td>
        <td style="color:${late?'var(--red)':days<=3?'var(--orange)':'var(--green)'};font-weight:600">${daysLabel}</td>
        <td><span class="pill ${late?'pill-r':days<=3?'pill-o':'pill-g'}">${late?'Overdue':days===0?'Due Today!':'Active'}</span></td>
      </tr>`;
    }).join('')+'</tbody></table>';
}

function renderDueDateAlerts(CU){
  const issued=(DB.get('issued')||[]).filter(i=>i.studentId===CU.id&&i.status!=='returned');
  const g=getEl('dueDateAlerts'); if(!g) return;
  const overdue=issued.filter(i=>i.dueDate<today());
  const dueSoon=issued.filter(i=>{ const d=daysDiff(today(),i.dueDate); return d>=0&&d<=3; });
  let html='';
  if(overdue.length){
    html+=`<div class="due-alert-box due-overdue">
      <h4 style="color:var(--red)"><i class="fas fa-exclamation-triangle"></i> Overdue Books — Fine Accumulating!</h4>
      ${overdue.map(i=>{ const d=daysDiff(i.dueDate,today()); return`<div class="due-alert-item"><strong>${i.bookTitle}</strong><span style="color:var(--red);font-weight:700">${d} days late → Fine: ₹${d*5}</span></div>`; }).join('')}
    </div>`;
  }
  if(dueSoon.length){
    html+=`<div class="due-alert-box due-soon">
      <h4 style="color:var(--gold2)"><i class="fas fa-clock"></i> Due Soon — Please Return These Books!</h4>
      ${dueSoon.map(i=>{ const d=daysDiff(today(),i.dueDate); return`<div class="due-alert-item"><strong>${i.bookTitle}</strong><span style="color:var(--gold2);font-weight:700">${d===0?'Due TODAY!':d+' day(s) remaining'}</span></div>`; }).join('')}
    </div>`;
  }
  g.innerHTML=html;
}

function pushDueNotifications(CU){
  const issued=(DB.get('issued')||[]).filter(i=>i.studentId===CU.id&&i.status!=='returned');
  const overdue=issued.filter(i=>i.dueDate<today());
  const dueSoon=issued.filter(i=>{ const d=daysDiff(today(),i.dueDate); return d>=0&&d<=3; });
  overdue.forEach(i=>{ const d=daysDiff(i.dueDate,today()); pushNotif('fa-exclamation-triangle','rgba(248,113,113,.15)','#f87171',`OVERDUE: "${i.bookTitle}" — Fine: ₹${d*5}`,'error'); });
  dueSoon.forEach(i=>{ const d=daysDiff(today(),i.dueDate); pushNotif('fa-clock','rgba(240,180,41,.15)','#f0b429',`Due ${d===0?'TODAY':'in '+d+' days'}: "${i.bookTitle}"`,'warn'); });
}

function renderMyBooks(){
  const CU=DB.get('session');
  const issued=(DB.get('issued')||[]).filter(i=>i.studentId===CU.id&&i.status!=='returned');
  const g=getEl('myBooksTable'); if(!g) return;
  if(!issued.length){ g.innerHTML='<div class="empty"><i class="fas fa-bookmark"></i><p>No books currently issued to you</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>TX ID</th><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Days Left</th><th>Status</th><th>Action</th></tr></thead><tbody>`+
    issued.map(i=>{
      const late=i.dueDate<today();
      const days=late?daysDiff(i.dueDate,today()):daysDiff(today(),i.dueDate);
      return`<tr class="${late?'overdue-tr':''}">
        <td style="font-family:monospace;color:var(--gold2)">${i.txId}</td>
        <td style="color:var(--t1);font-weight:500">${i.bookTitle}</td>
        <td>${fmtDate(i.issueDate)}</td>
        <td>${fmtDate(i.dueDate)}</td>
        <td style="color:${late?'var(--red)':days<=3?'var(--orange)':'var(--green)'};font-weight:600">${late?days+'d late':days===0?'TODAY!':days+'d left'}</td>
        <td><span class="pill ${late?'pill-r':days<=3?'pill-o':'pill-g'}">${late?'Overdue':days===0?'Due Today':'Active'}</span></td>
        <td>${i.renewed?'<span style="font-size:11px;color:var(--t3)">Renewed</span>':`<button class="btn-ghost btn-sm" onclick="requestRenewal('${i.txId}','${i.bookTitle.replace(/'/g,"\\'")}')"><i class="fas fa-sync"></i> Renew</button>`}</td>
      </tr>`;
    }).join('')+'</tbody></table>';
}

function renderMyFines(){
  const CU=DB.get('session');
  const issued=(DB.get('issued')||[]).filter(i=>i.studentId===CU.id&&i.status!=='returned'&&i.dueDate<today());
  // Fine summary
  const total=issued.reduce((s,i)=>s+daysDiff(i.dueDate,today())*5,0);
  const summary=getEl('myFinesSummary');
  if(summary){
    if(total>0) summary.innerHTML=`<div class="fine-summary-box"><i class="fas fa-rupee-sign"></i><div><strong style="font-size:15px">Outstanding Fine: ₹${total}</strong><br><span style="font-size:12px;color:var(--t2)">Fine rate: ₹5 per day after due date. Please contact the librarian to pay.</span></div></div>`;
    else summary.innerHTML='';
  }
  const g=getEl('myFinesTable'); if(!g) return;
  if(!issued.length){ g.innerHTML='<div class="empty"><i class="fas fa-check-circle" style="color:var(--green)"></i><p>No fines! You\'re all clear. 🎉</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>Book</th><th>Due Date</th><th>Days Late</th><th>Fine (₹)</th></tr></thead><tbody>`+
    issued.map(i=>{ const d=daysDiff(i.dueDate,today()); return`<tr class="overdue-tr">
      <td style="color:var(--t1)">${i.bookTitle}</td>
      <td>${fmtDate(i.dueDate)}</td>
      <td><span class="pill pill-r">${d} days</span></td>
      <td><strong style="color:var(--red)">₹${d*5}</strong></td>
    </tr>`; }).join('')+'</tbody></table>';
}

// ═══════════════════════════════════════════════════════════
//  USER FORMS — ADD USER (Fixed counts!)
// ═══════════════════════════════════════════════════════════
function buildUserForm(containerId,role,prefix,isStudent,addedBy){
  const g=getEl(containerId); if(!g) return;
  const users=DB.get('users')||[];
  const existing=users.filter(u=>u.role===role);
  let sugId;
  if(isStudent){ const num=String(existing.length+1).padStart(2,'0'); sugId=`${prefix}0${num}`; }
  else { sugId=prefix.toUpperCase()+String(existing.length+1).padStart(3,'0'); }
  const label={librarian:'Librarian',faculty:'Faculty',student:'Student'}[role];
  g.innerHTML=`
    <div class="fg"><label>User ID *</label><input type="text" id="${containerId}_id" value="${sugId}"/></div>
    <div class="fg"><label>Full Name *</label><input type="text" id="${containerId}_name" placeholder="Full name"/></div>
    <div class="fg"><label>Email *</label><input type="email" id="${containerId}_email" placeholder="email@vemu.ac.in"/></div>
    <div class="fg"><label>Phone</label><input type="text" id="${containerId}_phone" placeholder="10-digit number"/></div>
    <div class="fg"><label>Department *</label><input type="text" id="${containerId}_dept" placeholder="${isStudent?'e.g. B.Tech CSE':'e.g. Computer Science'}"/></div>
    <div class="fg"><label>Password *</label><input type="password" id="${containerId}_pw" placeholder="Set password"/></div>
    ${isStudent?`<div class="fg"><label>Year</label><select id="${containerId}_year"><option>1st Year</option><option>2nd Year</option><option selected>3rd Year</option><option>4th Year</option></select></div>`:''}
  `;
  let ab=g.nextElementSibling;
  if(!ab||!ab.classList.contains('form-actions')){ ab=document.createElement('div'); ab.className='form-actions'; g.after(ab); }
  ab.innerHTML=`<button class="btn-primary" onclick="addUser('${containerId}','${role}','${addedBy||''}')"><i class="fas fa-user-plus"></i> Add ${label}</button><button class="btn-ghost" onclick="clearFormContainer('${containerId}')"><i class="fas fa-times"></i> Clear</button>`;
}

window.addUser = function(containerId,role,addedBy){
  const id=val(containerId+'_id'), name=val(containerId+'_name');
  const email=val(containerId+'_email'), pw=val(containerId+'_pw');
  const dept=val(containerId+'_dept'), phone=val(containerId+'_phone');
  const yearEl=getEl(containerId+'_year');
  const year=yearEl?yearEl.value:'';
  if(!id||!name||!email||!pw||!dept){ showToast('Please fill all required (*) fields.','error'); return; }
  const users=DB.get('users')||[];
  if(users.find(u=>u.id===id)){ showToast(`User ID "${id}" already exists!`,'error'); return; }
  const CU=DB.get('session');
  const newUser={id,name,password:pw,role,email,dept,phone,year,joined:today(),addedBy:addedBy||CU.id};
  users.push(newUser);
  DB.set('users',users);

  // Activity & Notification
  const iconMap={librarian:'fa-user-tie',faculty:'fa-chalkboard-teacher',student:'fa-user-graduate'};
  const colorMap={librarian:'#7dd3fc',faculty:'#c4b5fd',student:'#6ee7b7'};
  addActivity(iconMap[role]||'fa-user-plus',colorMap[role]||'#6ee7b7',`New ${role} "${name}" (${id}) added`,`rgba(110,231,183,.15)`);
  pushNotif('fa-user-plus','rgba(110,231,183,.15)',colorMap[role]||'#6ee7b7',`New ${role} added: ${name} (${id})`);
  showToast(`✅ ${name} added! ID: ${id}`,'success');

  // Rebuild form with new suggested ID
  const prefixMap={librarian:'LIB',faculty:'FAC',student:'21VE1A0'};
  buildUserForm(containerId,role,prefixMap[role]||'USR',role==='student',addedBy||CU.id);

  // ── FIX: Refresh ALL stat panels live ──
  if(getEl('adminStats')) renderAdminStats();
  if(getEl('libStats'))   renderLibStats();
  if(getEl('facStats'))   renderFacStats(CU);
  if(getEl('userDist'))   renderUserDist();
};

window.clearFormContainer = function(containerId){
  document.querySelectorAll(`[id^="${containerId}_"]`).forEach(el=>{
    if(el.tagName==='INPUT') el.value='';
    else if(el.tagName==='SELECT') el.selectedIndex=0;
  });
};

// ═══════════════════════════════════════════════════════════
//  BOOKS
// ═══════════════════════════════════════════════════════════
window.addBook = function(){
  const id=val('ab_id'),title=val('ab_title'),author=val('ab_author');
  const cat=val('ab_cat'),qty=parseInt(val('ab_qty')||'0');
  if(!id||!title||!author||!cat||!qty){ showToast('Fill all required fields.','error'); return; }
  const books=DB.get('books')||[];
  if(books.find(b=>b.id===id)){ showToast('Book ID already exists!','error'); return; }
  const CU=DB.get('session');
  const newBook={id,title,author,category:cat,qty,available:qty,shelf:val('ab_shelf')||'TBD',isbn:val('ab_isbn'),year:parseInt(val('ab_year'))||new Date().getFullYear(),desc:val('ab_desc'),borrow:0};
  books.push(newBook);
  DB.set('books',books);
  addActivity('fa-book','#fde68a',`Book "${title}" (${id}) added — ${qty} copies`,'rgba(253,230,138,.15)');
  pushNotif('fa-book','rgba(253,230,138,.15)','#fde68a',`New book added: "${title}" (${qty} copies)`);
  showToast(`✅ "${title}" added to catalog!`,'success');
  clearBookForm();
  // Live refresh
  if(getEl('libStats'))  renderLibStats();
  if(getEl('catChart'))  renderCatChart();
  if(getEl('booksTable')) renderBooksTable();
};

window.clearBookForm = function(){
  ['ab_id','ab_title','ab_author','ab_qty','ab_shelf','ab_isbn','ab_year','ab_desc'].forEach(id=>{ const e=getEl(id);if(e)e.value=''; });
  const c=getEl('ab_cat');if(c)c.value='';
};

function renderBooksTable(){
  const books=DB.get('books')||[];
  const g=getEl('booksTable'); if(!g) return;
  if(!books.length){ g.innerHTML='<div class="empty"><i class="fas fa-books"></i><p>No books in catalog yet</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>ID</th><th>Title</th><th>Author</th><th>Category</th><th>Total</th><th>Available</th><th>Shelf</th><th>Borrows</th><th>Actions</th></tr></thead><tbody>`+
    books.map(b=>`<tr>
      <td style="font-family:monospace;color:var(--gold2)">${b.id}</td>
      <td style="color:var(--t1);font-weight:500;max-width:180px;overflow:hidden;text-overflow:ellipsis">${b.title}</td>
      <td>${b.author}</td>
      <td><span class="pill pill-b">${b.category}</span></td>
      <td style="font-weight:600">${b.qty}</td>
      <td><span class="pill ${b.available>0?'pill-g':'pill-r'}">${b.available}</span></td>
      <td>${b.shelf}</td>
      <td><span style="color:var(--t2)">${b.borrow||0}×</span></td>
      <td style="display:flex;gap:6px">
        <button class="btn-icon edit" onclick="openEditBook('${b.id}')"><i class="fas fa-edit"></i></button>
        <button class="btn-icon del"  onclick="confirmDeleteBook('${b.id}','${b.title.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`).join('')+'</tbody></table>';
}

window.openEditBook = function(id){
  const books=DB.get('books')||[]; const b=books.find(x=>x.id===id); if(!b) return;
  setVal('eb_id',b.id); setVal('eb_title',b.title); setVal('eb_author',b.author);
  setVal('eb_qty',b.qty); setVal('eb_shelf',b.shelf);
  const s=getEl('eb_cat'); if(s) Array.from(s.options).forEach(o=>o.selected=o.value===b.category);
  openModal('editBookModal');
};

window.saveEditBook = function(){
  const id=val('eb_id'); const books=DB.get('books')||[];
  const idx=books.findIndex(b=>b.id===id); if(idx<0) return;
  const newQty=parseInt(val('eb_qty'))||books[idx].qty;
  const diff=newQty-books[idx].qty;
  books[idx]={...books[idx],title:val('eb_title'),author:val('eb_author'),category:val('eb_cat'),qty:newQty,available:Math.max(0,books[idx].available+diff),shelf:val('eb_shelf')};
  DB.set('books',books);
  closeModal('editBookModal');
  showToast('Book updated successfully!','success');
  renderBooksTable();
  renderLibStats();
};

window.confirmDeleteBook = function(id,title){
  openConfirm(`Delete "${title}" (${id}) from catalog? This cannot be undone.`,()=>{
    const books=(DB.get('books')||[]).filter(b=>b.id!==id);
    DB.set('books',books);
    showToast(`"${title}" deleted.`,'info');
    addActivity('fa-trash','#f87171',`Book "${title}" deleted from catalog`,'rgba(248,113,113,.15)');
    renderBooksTable(); renderLibStats(); renderCatChart();
  });
};

// Books grid (cards with request button for students)
window.loadBooksGrid = function loadBooksGrid(containerId, filter){
  let books=DB.get('books')||[];
  if(filter?.cat) books=books.filter(b=>b.category===filter.cat);
  if(filter?.q){
    const q=filter.q.toLowerCase();
    books=books.filter(b=>b.title.toLowerCase().includes(q)||b.author.toLowerCase().includes(q)||(b.isbn&&b.isbn.includes(q)));
  }
  if(filter?.avail==='yes') books=books.filter(b=>b.available>0);
  if(filter?.avail==='no')  books=books.filter(b=>b.available===0);
  if(filter?.sort==='title')    books=[...books].sort((a,b)=>a.title.localeCompare(b.title));
  if(filter?.sort==='borrow')   books=[...books].sort((a,b)=>b.borrow-a.borrow);
  if(filter?.sort==='available')books=[...books].sort((a,b)=>b.available-a.available);

  const g=getEl(containerId); if(!g) return;
  const CU=DB.get('session');
  const catEmoji={'Java':'☕','Python':'🐍','AI/ML':'🤖','Data Structures':'🌳','Web Development':'🌐','Networks':'🔗','Operating Systems':'💻','Mathematics':'📐','Physics':'⚛','Other':'📗'};
  const catBg={'Java':'bc-java','Python':'bc-python','AI/ML':'bc-ai','Data Structures':'bc-ds','Web Development':'bc-web','Networks':'bc-net','Operating Systems':'bc-os','Mathematics':'bc-math','Physics':'bc-math','Other':'bc-other'};
  if(!books.length){ g.innerHTML='<div class="empty" style="grid-column:1/-1"><i class="fas fa-search"></i><p>No books found matching your search</p></div>'; return; }
  g.innerHTML=books.map((b,i)=>`
    <div class="book-card" style="animation-delay:${i*.04}s">
      <div class="book-cover-ph ${catBg[b.category]||'bc-other'}">${catEmoji[b.category]||'📚'}</div>
      <div class="book-card-body">
        <div class="bc-title" title="${b.title}">${b.title}</div>
        <div class="bc-author">${b.author}</div>
        <div class="bc-footer">
          <span class="bc-cat">${b.category}</span>
          <span class="pill ${b.available>0?'pill-g':'pill-r'}">${b.available>0?b.available+' left':'Unavailable'}</span>
        </div>
        ${CU?.role==='student'?`<div class="bc-actions"><button class="btn-request btn-sm" onclick="openQuickRequest('${b.id}','${b.title.replace(/'/g,"\\'")}')"><i class="fas fa-hand-paper"></i> Request</button><button class="btn-ghost btn-sm" onclick="addToWishlist('${b.id}','${b.title.replace(/'/g,"\\'")}')"><i class="fas fa-heart"></i></button></div>`:''}
      </div>
    </div>`).join('');
}

// Live search handlers
window.liveBookSearch = function(q){
  const CU=DB.get('session');
  const containers={'student':['availBooksGrid','searchBooksGrid'],'faculty':['facBooksGrid'],'librarian':[]};
  const ids=(containers[CU?.role]||[]);
  ids.forEach(id=>loadBooksGrid(id,{q}));
  // Also for librarian search
  if(CU?.role==='librarian') loadBooksGrid('searchBooksGrid',{q});
};

window.filterBooksByCat = function(cat){
  const CU=DB.get('session');
  const ids=CU?.role==='student'?['availBooksGrid','searchBooksGrid']:CU?.role==='faculty'?['facBooksGrid']:['searchBooksGrid'];
  ids.forEach(id=>loadBooksGrid(id,{cat}));
};

window.filterByAvailability = function(avail){
  loadBooksGrid('availBooksGrid',{avail});
};

// Advanced search (student/librarian search page)
window.searchBooksAdvanced = function(){
  const q=val('srch_title')||val('srch_author'), cat=val('srch_cat'), avail=val('srch_avail')||val('srch_avail');
  const isbn=val('srch_isbn'), sort=val('srch_sort');
  let books=DB.get('books')||[];
  if(val('srch_title')) books=books.filter(b=>b.title.toLowerCase().includes(val('srch_title').toLowerCase()));
  if(val('srch_author')) books=books.filter(b=>b.author.toLowerCase().includes(val('srch_author').toLowerCase()));
  if(cat) books=books.filter(b=>b.category===cat);
  if(isbn) books=books.filter(b=>b.isbn&&b.isbn.includes(isbn));
  if(avail==='yes') books=books.filter(b=>b.available>0);
  if(avail==='no')  books=books.filter(b=>b.available===0);
  if(sort==='title') books=[...books].sort((a,b)=>a.title.localeCompare(b.title));
  if(sort==='borrow') books=[...books].sort((a,b)=>b.borrow-a.borrow);
  if(sort==='available') books=[...books].sort((a,b)=>b.available-a.available);

  const info=getEl('searchResultsInfo');
  if(info) info.textContent=`Found ${books.length} book(s)`;

  // Render into whichever grid is visible
  ['searchBooksGrid','libSearchGrid'].forEach(id=>{
    const g=getEl(id); if(!g) return;
    const CU=DB.get('session');
    const catEmoji={'Java':'☕','Python':'🐍','AI/ML':'🤖','Data Structures':'🌳','Web Development':'🌐','Networks':'🔗','Operating Systems':'💻','Mathematics':'📐','Physics':'⚛','Other':'📗'};
    const catBg={'Java':'bc-java','Python':'bc-python','AI/ML':'bc-ai','Data Structures':'bc-ds','Web Development':'bc-web','Networks':'bc-net','Operating Systems':'bc-os','Mathematics':'bc-math','Physics':'bc-math','Other':'bc-other'};
    if(!books.length){ g.innerHTML='<div class="empty" style="grid-column:1/-1"><i class="fas fa-search"></i><p>No books found</p></div>'; return; }
    g.innerHTML=books.map((b,i)=>`
      <div class="book-card" style="animation-delay:${i*.04}s">
        <div class="book-cover-ph ${catBg[b.category]||'bc-other'}">${catEmoji[b.category]||'📚'}</div>
        <div class="book-card-body">
          <div class="bc-title" title="${b.title}">${b.title}</div>
          <div class="bc-author">${b.author}</div>
          <div class="bc-footer">
            <span class="bc-cat">${b.category}</span>
            <span class="pill ${b.available>0?'pill-g':'pill-r'}">${b.available>0?b.available+' left':'Unavailable'}</span>
          </div>
          ${CU?.role==='student'?`<div class="bc-actions"><button class="btn-request btn-sm" onclick="openQuickRequest('${b.id}','${b.title.replace(/'/g,"\\'")}')"><i class="fas fa-hand-paper"></i> Request</button><button class="btn-ghost btn-sm" onclick="addToWishlist('${b.id}','${b.title.replace(/'/g,"\\'")}')"><i class="fas fa-heart"></i></button></div>`:''}
        </div>
      </div>`).join('');
  });
};

window.clearSearch = function(){
  ['srch_title','srch_author','srch_isbn'].forEach(id=>{ const e=getEl(id);if(e)e.value=''; });
  ['srch_cat','srch_avail','srch_sort'].forEach(id=>{ const e=getEl(id);if(e)e.value=''; });
  const info=getEl('searchResultsInfo'); if(info) info.textContent='';
  ['searchBooksGrid','libSearchGrid'].forEach(id=>loadBooksGrid(id));
};

// ═══════════════════════════════════════════════════════════
//  ISSUE / RETURN (Fixed!)
// ═══════════════════════════════════════════════════════════
window.previewIssue = function(){
  const sid=val('is_sid'), bid=val('is_bid');
  if(!sid||!bid) return;
  const users=DB.get('users')||[]; const books=DB.get('books')||[];
  const stu=users.find(u=>u.id===sid);
  const bk=books.find(b=>b.id===bid);
  const p=getEl('is_preview'); if(!p) return;
  p.style.display='block';
  if(!stu)  { p.innerHTML='<i class="fas fa-times-circle"></i> Student ID not found.'; return; }
  if(!bk)   { p.innerHTML='<i class="fas fa-times-circle"></i> Book ID not found.'; return; }
  if(bk.available<1){ p.innerHTML=`<i class="fas fa-times-circle"></i> No copies of "${bk.title}" available right now.`; return; }
  p.innerHTML=`<i class="fas fa-check-circle" style="color:var(--green)"></i> <strong>${stu.name}</strong> → <strong>${bk.title}</strong> | Available: ${bk.available} copy/copies`;
};

window.issueBook = function(){
  const sid=val('is_sid'), bid=val('is_bid'), iDate=val('is_date')||today(), rDate=val('is_due');
  if(!sid||!bid||!rDate){ showToast('Please fill Student ID, Book ID, and Due Date.','error'); return; }
  const users=DB.get('users')||[]; const books=DB.get('books')||[];
  const stu=users.find(u=>u.id===sid);
  const bkIdx=books.findIndex(b=>b.id===bid);
  if(!stu)    { showToast('Student ID not found!','error'); return; }
  if(bkIdx<0) { showToast('Book ID not found!','error'); return; }
  if(books[bkIdx].available<1){ showToast(`No copies of "${books[bkIdx].title}" available!`,'error'); return; }
  const issued=DB.get('issued')||[];
  if(issued.find(i=>i.studentId===sid&&i.bookId===bid&&i.status!=='returned')){ showToast('This book is already issued to this student!','warn'); return; }
  const CU=DB.get('session');
  const txId=uid();
  issued.push({txId,studentId:sid,studentName:stu.name,bookId:bid,bookTitle:books[bkIdx].title,issueDate:iDate,dueDate:rDate,status:'issued',fine:0,issuedBy:CU.id,ts:Date.now()});
  books[bkIdx].available--;
  books[bkIdx].borrow=(books[bkIdx].borrow||0)+1;
  DB.set('issued',issued); DB.set('books',books);
  addActivity('fa-arrow-up','#fdba74',`Book "${books[bkIdx].title}" issued to ${stu.name}`,'rgba(253,186,116,.15)');
  pushNotif('fa-book','rgba(253,186,116,.15)','#fdba74',`Book issued: "${books[bkIdx].title}" → ${stu.name}`);
  setVal('is_sid',''); setVal('is_bid','');
  const ip=getEl('is_preview'); if(ip) ip.style.display='none';
  showToast(`✅ Book issued! TX: ${txId}`,'success');
  renderIssuedList(); renderLibStats(); renderBooksTable();
};

function renderIssuedList(){
  const issued=(DB.get('issued')||[]).filter(i=>i.status!=='returned');
  const g=getEl('issuedListTable'); if(!g) return;
  if(!issued.length){ g.innerHTML='<div class="empty"><i class="fas fa-list"></i><p>No books currently issued</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>TX ID</th><th>Student</th><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Status</th></tr></thead><tbody>`+
    issued.map(i=>{
      const late=i.dueDate<today();
      return`<tr class="${late?'overdue-tr':''}">
        <td style="font-family:monospace;color:var(--gold2)">${i.txId}</td>
        <td><strong style="color:var(--t1)">${i.studentName}</strong><br><span style="font-size:11px;color:var(--t3)">${i.studentId}</span></td>
        <td>${i.bookTitle}</td>
        <td>${fmtDate(i.issueDate)}</td>
        <td>${fmtDate(i.dueDate)}</td>
        <td><span class="pill ${late?'pill-r':'pill-g'}">${late?'⚠ Overdue':'Active'}</span></td>
      </tr>`;
    }).join('')+'</tbody></table>';
}

window.calcReturn = function(){
  const sid=val('ret_sid'), bid=val('ret_bid'), retDate=val('ret_date')||today();
  const issued=(DB.get('issued')||[]).find(i=>i.studentId===sid&&i.bookId===bid&&i.status!=='returned');
  const p=getEl('ret_preview'); if(!p) return;
  if(!issued){ p.style.display='block'; p.innerHTML='<i class="fas fa-times-circle"></i> No active issue found for this Student ID + Book ID combination.'; return; }
  const days=daysDiff(issued.dueDate,retDate);
  const fine=days>0?days*5:0;
  p.style.display='block';
  p.innerHTML=`<i class="fas fa-calculator"></i> Borrower: <strong>${issued.studentName}</strong> | Due: <strong>${fmtDate(issued.dueDate)}</strong> | Return: <strong>${fmtDate(retDate)}</strong><br>${days>0?`<span style="color:var(--red);font-weight:700">⚠ ${days} day(s) late → Fine: ₹${fine}</span>`:'<span style="color:var(--green);font-weight:700">✓ Returned on time — No fine!</span>'}`;
};

window.returnBook = function(){
  const sid=val('ret_sid'), bid=val('ret_bid'), retDate=val('ret_date')||today();
  if(!sid||!bid){ showToast('Enter Student ID and Book ID.','error'); return; }
  const issued=DB.get('issued')||[]; const books=DB.get('books')||[];
  const idx=issued.findIndex(i=>i.studentId===sid&&i.bookId===bid&&i.status!=='returned');
  if(idx<0){ showToast('No active issue found!','error'); return; }
  const rec=issued[idx];
  const days=daysDiff(rec.dueDate,retDate);
  const fine=days>0?days*5:0;
  rec.status='returned'; rec.actualReturn=retDate; rec.fine=fine;
  const returned=DB.get('returned')||[]; returned.push({...rec});
  issued[idx]=rec;
  const bIdx=books.findIndex(b=>b.id===bid);
  if(bIdx>=0) books[bIdx].available++;
  DB.set('issued',issued); DB.set('books',books); DB.set('returned',returned);
  addActivity('fa-undo','#6ee7b7',`"${rec.bookTitle}" returned by ${rec.studentName}${fine>0?' — Fine: ₹'+fine:''}`,'rgba(110,231,183,.15)');
  if(fine>0) pushNotif('fa-rupee-sign','rgba(251,146,60,.15)','#fdba74',`Fine ₹${fine} pending from ${rec.studentName}`,'warn');
  setVal('ret_sid',''); setVal('ret_bid','');
  const p=getEl('ret_preview'); if(p) p.style.display='none';
  showToast(`✅ Book returned!${fine>0?' Fine: ₹'+fine:' No fine.'}`,'success');
  renderReturnHistory(); renderLibStats(); renderIssuedList(); renderBooksTable();
};

function renderReturnHistory(){
  const returned=DB.get('returned')||[];
  const g=getEl('returnHistory'); if(!g) return;
  if(!returned.length){ g.innerHTML='<div class="empty"><i class="fas fa-history"></i><p>No returns yet</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>TX ID</th><th>Student</th><th>Book</th><th>Return Date</th><th>Fine (₹)</th></tr></thead><tbody>`+
    returned.slice().reverse().map(r=>`<tr>
      <td style="font-family:monospace;color:var(--gold2)">${r.txId}</td>
      <td>${r.studentName}</td><td>${r.bookTitle}</td>
      <td>${fmtDate(r.actualReturn)}</td>
      <td>${r.fine>0?`<strong style="color:var(--red)">₹${r.fine}</strong>`:'<span class="pill pill-g">Nil</span>'}</td>
    </tr>`).join('')+'</tbody></table>';
}

// ═══════════════════════════════════════════════════════════
//  OVERDUE & FINES
// ═══════════════════════════════════════════════════════════
function renderOverdue(){
  const issued=DB.get('issued')||[];
  const overdue=issued.filter(i=>i.status!=='returned'&&i.dueDate<today());
  const alert=getEl('overdueAlert');
  if(alert) alert.innerHTML=`<i class="fas fa-exclamation-triangle"></i><span><strong>${overdue.length} overdue book${overdue.length!==1?'s':''}</strong> found — send reminders and collect fines.</span>`;
  const g=getEl('overdueTable'); if(!g) return;
  if(!overdue.length){ g.innerHTML='<div class="empty"><i class="fas fa-check-circle" style="color:var(--green)"></i><p>No overdue books! All good. 🎉</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>TX ID</th><th>Student</th><th>Book</th><th>Due Date</th><th>Days Late</th><th>Fine (₹)</th><th>Action</th></tr></thead><tbody>`+
    overdue.map(i=>{ const d=daysDiff(i.dueDate,today()); return`<tr class="overdue-tr">
      <td style="font-family:monospace">${i.txId}</td>
      <td><strong>${i.studentName}</strong><br><span style="font-size:11px;color:var(--t3)">${i.studentId}</span></td>
      <td>${i.bookTitle}</td>
      <td>${fmtDate(i.dueDate)}</td>
      <td><span class="pill pill-r">${d} days</span></td>
      <td><strong style="color:var(--red)">₹${d*5}</strong></td>
      <td><button class="btn-primary btn-sm" onclick="sendReminder('${i.studentName.replace(/'/g,"\\'")}','${i.bookTitle.replace(/'/g,"\\'")}',${d*5})"><i class="fas fa-bell"></i> Remind</button></td>
    </tr>`; }).join('')+'</tbody></table>';
}

window.sendReminder = function(name,book,fine){ showToast(`📧 Reminder sent to ${name} for "${book}" — Fine: ₹${fine}`,'info'); };

function renderFines(){
  const CU=DB.get('session');
  const issued=DB.get('issued')||[];
  let overdue=issued.filter(i=>i.status!=='returned'&&i.dueDate<today());
  if(CU.role==='student') overdue=overdue.filter(i=>i.studentId===CU.id);
  const g=getEl('finesTable'); if(!g) return;
  if(!overdue.length){ g.innerHTML='<div class="empty"><i class="fas fa-check-circle" style="color:var(--green)"></i><p>No pending fines! 🎉</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>TX ID</th><th>Student</th><th>Book</th><th>Days Late</th><th>Fine (₹)</th><th>Action</th></tr></thead><tbody>`+
    overdue.map(i=>{ const d=daysDiff(i.dueDate,today()); return`<tr class="overdue-tr">
      <td style="font-family:monospace;color:var(--gold2)">${i.txId}</td>
      <td>${i.studentName}</td><td>${i.bookTitle}</td>
      <td><span class="pill pill-r">${d} days</span></td>
      <td><strong style="color:var(--red)">₹${d*5}</strong></td>
      <td style="display:flex;gap:6px">
        <button class="btn-primary btn-sm" onclick="payFine('${i.txId}',${d*5},'${i.studentName.replace(/'/g,"\\'")}')"><i class="fas fa-rupee-sign"></i> Pay</button>
        <button class="btn-ghost btn-sm" onclick="clearFine('${i.txId}')"><i class="fas fa-times"></i></button>
      </td>
    </tr>`; }).join('')+'</tbody></table>';
}

window.payFine = function(txId,amount,name){
  showToast(`✅ ₹${amount} fine collected from ${name}!`,'success');
  addActivity('fa-rupee-sign','#fdba74',`Fine ₹${amount} paid by ${name}`,'rgba(253,186,116,.15)');
  clearFine(txId);
};
window.clearFine = function(txId){
  const issued=DB.get('issued')||[];
  const idx=issued.findIndex(i=>i.txId===txId);
  if(idx>=0){ issued[idx].status='returned'; issued[idx].actualReturn=today(); issued[idx].fine=0; DB.set('issued',issued); }
  renderFines(); renderOverdue();
};

// ═══════════════════════════════════════════════════════════
//  ALL USERS
// ═══════════════════════════════════════════════════════════
let _userFilter='all';
function renderAllUsers(filter,query){
  _userFilter=filter||_userFilter;
  const users=DB.get('users')||[];
  let list=users.filter(u=>u.role!=='admin');
  if(_userFilter!=='all') list=list.filter(u=>u.role===_userFilter);
  if(query) list=list.filter(u=>u.name.toLowerCase().includes(query.toLowerCase())||u.id.toLowerCase().includes(query.toLowerCase())||u.email?.toLowerCase().includes(query.toLowerCase()));
  const g=getEl('usersTable'); if(!g) return;
  if(!list.length){ g.innerHTML='<div class="empty"><i class="fas fa-users"></i><p>No users found</p></div>'; return; }
  const rolePill=r=>({librarian:'pill-c',faculty:'pill-p',student:'pill-g',admin:'pill-y'})[r]||'pill-b';
  g.innerHTML=`<table><thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Email</th><th>Department</th><th>Joined</th><th>Action</th></tr></thead><tbody>`+
    list.map(u=>`<tr>
      <td style="font-family:monospace;color:var(--gold2)">${u.id}</td>
      <td style="color:var(--t1);font-weight:600">${u.name}</td>
      <td><span class="pill ${rolePill(u.role)}">${u.role}</span></td>
      <td>${u.email||'—'}</td><td>${u.dept||'—'}</td>
      <td>${fmtDate(u.joined)}</td>
      <td style="display:flex;gap:6px">
        <button class="btn-icon edit" onclick="openEditUser('${u.id}')" title="Edit user"><i class="fas fa-edit"></i></button>
        <button class="btn-icon del" onclick="confirmDeleteUser('${u.id}','${u.name.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`).join('')+'</tbody></table>';
}

window.filterUsers = function(el,f){ _userFilter=f; document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active')); el.classList.add('active'); renderAllUsers(f); };
window.searchUsers = q=> renderAllUsers(_userFilter,q);
window.confirmDeleteUser = function(id,name){
  openConfirm(`Delete user "${name}" (${id})? This cannot be undone.`,()=>{
    const users=(DB.get('users')||[]).filter(u=>u.id!==id);
    DB.set('users',users);
    addActivity('fa-user-times','#f87171',`User "${name}" deleted`,'rgba(248,113,113,.15)');
    showToast(`${name} deleted.`,'info');
    renderAllUsers(); renderAdminStats();
  });
};
window.openEditUser = function(uid){
  const users=DB.get('users')||[];
  const u=users.find(x=>x.id===uid); if(!u) return;
  setVal('eu_id',u.id);
  setVal('eu_id_display',u.id);
  setVal('eu_name',u.name);
  setVal('eu_email',u.email||'');
  setVal('eu_phone',u.phone||'');
  setVal('eu_dept',u.dept||'');
  setVal('eu_pw','');
  const roleEl=getEl('eu_role');
  if(roleEl) Array.from(roleEl.options).forEach(o=>o.selected=o.value===u.role);
  const yearWrap=getEl('eu_year_wrap');
  if(yearWrap){ yearWrap.style.display=u.role==='student'?'block':'none'; }
  const yearEl=getEl('eu_year');
  if(yearEl&&u.year) Array.from(yearEl.options).forEach(o=>o.selected=o.value===u.year);
  openModal('editUserModal');
};

window.saveEditUser = function(){
  const uid=val('eu_id');
  const users=DB.get('users')||[];
  const idx=users.findIndex(u=>u.id===uid); if(idx<0) return;
  const newName=val('eu_name'), newEmail=val('eu_email');
  const newPhone=val('eu_phone'), newDept=val('eu_dept');
  const newPw=val('eu_pw');
  const yearEl=getEl('eu_year'); const newYear=yearEl?yearEl.value:users[idx].year||'';
  if(!newName||!newEmail){ showToast('Name and Email are required.','error'); return; }
  users[idx]={...users[idx],name:newName,email:newEmail,phone:newPhone,dept:newDept,year:newYear};
  if(newPw.trim()) users[idx].password=newPw.trim();
  DB.set('users',users);
  // Update session if self
  const CU=DB.get('session');
  if(CU&&CU.id===uid){ DB.set('session',users[idx]); }
  addActivity('fa-user-edit','#7dd3fc',`User "${newName}" (${uid}) profile updated`,'rgba(125,211,252,.15)');
  showToast(`✅ ${newName}'s profile updated!`,'success');
  closeModal('editUserModal');
  renderAllUsers(); renderAdminStats();
};

window.onEuRoleChange = function(){
  const r=val('eu_role');
  const yw=getEl('eu_year_wrap');
  if(yw) yw.style.display=r==='student'?'block':'none';
};

// ═══════════════════════════════════════════════════════════
//  REPORTS
// ═══════════════════════════════════════════════════════════
window.showReport = function(el,type){ document.querySelectorAll('.rtab').forEach(t=>t.classList.remove('active')); el.classList.add('active'); renderReports(type); };
function renderReports(type='issued'){
  const issued=DB.get('issued')||[], returned=DB.get('returned')||[];
  const g=getEl('reportTable'); if(!g) return;
  let data=[], html='';
  if(type==='issued'){
    data=issued.filter(i=>i.status!=='returned');
    if(!data.length){ g.innerHTML='<div class="empty"><i class="fas fa-file-alt"></i><p>No active issues</p></div>'; return; }
    html=`<table><thead><tr><th>TX ID</th><th>Student</th><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Status</th></tr></thead><tbody>`+
      data.map(d=>{ const late=d.dueDate<today(); return`<tr class="${late?'overdue-tr':''}"><td style="font-family:monospace;color:var(--gold2)">${d.txId}</td><td>${d.studentName}</td><td>${d.bookTitle}</td><td>${fmtDate(d.issueDate)}</td><td>${fmtDate(d.dueDate)}</td><td><span class="pill ${late?'pill-r':'pill-g'}">${late?'Overdue':'Active'}</span></td></tr>`; }).join('')+'</tbody></table>';
  } else if(type==='returned'){
    data=returned;
    if(!data.length){ g.innerHTML='<div class="empty"><i class="fas fa-history"></i><p>No returns yet</p></div>'; return; }
    html=`<table><thead><tr><th>TX ID</th><th>Student</th><th>Book</th><th>Return Date</th><th>Fine (₹)</th></tr></thead><tbody>`+
      data.slice().reverse().map(d=>`<tr><td style="font-family:monospace;color:var(--gold2)">${d.txId}</td><td>${d.studentName}</td><td>${d.bookTitle}</td><td>${fmtDate(d.actualReturn)}</td><td>${d.fine>0?`<strong style="color:var(--red)">₹${d.fine}</strong>`:'<span class="pill pill-g">Nil</span>'}</td></tr>`).join('')+'</tbody></table>';
  } else {
    data=issued.filter(i=>i.status!=='returned'&&i.dueDate<today());
    if(!data.length){ g.innerHTML='<div class="empty"><i class="fas fa-check-circle" style="color:var(--green)"></i><p>No overdue books!</p></div>'; return; }
    html=`<table><thead><tr><th>TX ID</th><th>Student</th><th>Book</th><th>Due Date</th><th>Days Late</th><th>Fine (₹)</th></tr></thead><tbody>`+
      data.map(d=>{ const days=daysDiff(d.dueDate,today()); return`<tr class="overdue-tr"><td style="font-family:monospace">${d.txId}</td><td>${d.studentName}</td><td>${d.bookTitle}</td><td>${fmtDate(d.dueDate)}</td><td><span class="pill pill-r">${days}d</span></td><td><strong style="color:var(--red)">₹${days*5}</strong></td></tr>`; }).join('')+'</tbody></table>';
  }
  g.innerHTML=html;
}

// ═══════════════════════════════════════════════════════════
//  LIBRARY STATISTICS (Extra Feature)
// ═══════════════════════════════════════════════════════════
function renderLibraryStats(){
  const g=getEl('statsContent'); if(!g) return;
  const books=DB.get('books')||[], users=DB.get('users')||[];
  const issued=DB.get('issued')||[], returned=DB.get('returned')||[];
  const totalB=books.reduce((s,b)=>s+b.qty,0);
  const avail=books.reduce((s,b)=>s+b.available,0);
  const active=issued.filter(i=>i.status!=='returned');
  const overdue=active.filter(i=>i.dueDate<today());
  const fineTotal=overdue.reduce((s,i)=>s+daysDiff(i.dueDate,today())*5,0);
  const statsData=[
    {label:'Total Books',   val:totalB,              icon:'fa-books',         color:'#fde68a',bg:'rgba(253,230,138,.15)',sc:'#fde68a'},
    {label:'Available',     val:avail,               icon:'fa-check-circle',  color:'#6ee7b7',bg:'rgba(110,231,183,.15)',sc:'#6ee7b7'},
    {label:'Issued Now',    val:active.length,        icon:'fa-arrow-up',     color:'#fdba74',bg:'rgba(253,186,116,.15)',sc:'#fdba74'},
    {label:'Overdue',       val:overdue.length,       icon:'fa-clock',        color:'#f87171',bg:'rgba(248,113,113,.15)',sc:'#f87171'},
    {label:'Total Users',   val:users.filter(u=>u.role!=='admin').length, icon:'fa-users', color:'#c4b5fd',bg:'rgba(196,181,253,.15)',sc:'#c4b5fd'},
    {label:'Pending Fines', val:fineTotal,            icon:'fa-rupee-sign',   color:'#f9a8d4',bg:'rgba(249,168,212,.15)',sc:'#f9a8d4'},
    {label:'Returned',      val:returned.length,      icon:'fa-undo',         color:'#5eead4',bg:'rgba(94,234,212,.15)', sc:'#5eead4'},
    {label:'Total Students',val:users.filter(u=>u.role==='student').length, icon:'fa-user-graduate',color:'#a5b4fc',bg:'rgba(165,180,252,.15)',sc:'#a5b4fc'},
  ];
  g.innerHTML='<div class="stats-row">'+statsData.map((s,i)=>`
    <div class="stat-card" style="--sc-color:${s.sc};animation-delay:${i*.06}s">
      <div class="sc-icon" style="background:${s.bg};color:${s.color}"><i class="fas ${s.icon}"></i></div>
      <div class="sc-num" id="stat_n${i}">0</div>
      <div class="sc-label">${s.label}</div>
      <div class="sc-bg"><i class="fas ${s.icon}"></i></div>
    </div>`).join('')+'</div>';
  statsData.forEach((s,i)=>animateNum('stat_n'+i,s.val));
  renderCatChartInto('statsCatChart');
  renderMostBorrowed();
}

function renderCatChartInto(targetId){
  const books=DB.get('books')||[];
  const cats={};
  books.forEach(b=>{ cats[b.category]=(cats[b.category]||0)+b.qty; });
  const catColors={'Java':'#fde68a','Python':'#7dd3fc','AI/ML':'#c4b5fd','Data Structures':'#6ee7b7','Web Development':'#f9a8d4','Networks':'#5eead4','Operating Systems':'#fdba74','Mathematics':'#a5b4fc','Physics':'#fca5a5','Other':'#d4d4d4'};
  const max=Math.max(...Object.values(cats),1);
  const g=getEl(targetId); if(!g) return;
  g.innerHTML=Object.entries(cats).map(([k,v])=>`
    <div class="cat-item">
      <div class="cat-lbl"><span>${k}</span><span style="font-weight:600;color:${catColors[k]||'#d4d4d4'}">${v}</span></div>
      <div class="cat-track"><div class="cat-fill" style="width:0;background:${catColors[k]||'#d4d4d4'}" data-w="${Math.round(v/max*100)}"></div></div>
    </div>`).join('');
  setTimeout(()=>g.querySelectorAll('.cat-fill').forEach(b=>b.style.width=b.dataset.w+'%'),120);
}

// ═══════════════════════════════════════════════════════════
//  BOOK REQUESTS
// ═══════════════════════════════════════════════════════════
window.previewReqBook = function(bookId){
  const books=DB.get('books')||[];
  const b=books.find(x=>x.id.toLowerCase()===bookId.toLowerCase());
  const p=getEl('req_preview'); if(!p) return;
  if(!b){ p.style.display='none'; return; }
  p.style.display='block';
  const avColor=b.available>0?'var(--green)':'var(--red)';
  p.innerHTML=`<i class="fas fa-book" style="color:var(--gold2)"></i> <strong>${b.title}</strong> by ${b.author} | Category: ${b.category} | Copies available: <span style="color:${avColor};font-weight:700">${b.available>0?b.available:'None'}</span>`;
};

window.submitBookRequest = function(){
  const CU=DB.get('session');
  const bookId=val('req_bookid'), reason=val('req_reason'), date=val('req_date')||today();
  if(!bookId){ showToast('Please enter a Book ID.','error'); return; }
  const books=DB.get('books')||[];
  const bk=books.find(b=>b.id.toLowerCase()===bookId.toLowerCase());
  if(!bk){ showToast('Book ID not found in catalog!','error'); return; }
  const requests=DB.get('bookRequests')||[];
  if(requests.find(r=>r.studentId===CU.id&&r.bookId===bk.id&&r.status==='pending')){ showToast('You already have a pending request for this book!','warn'); return; }
  const reqId='REQ'+Date.now().toString().slice(-6);
  requests.push({reqId,studentId:CU.id,studentName:CU.name,bookId:bk.id,bookTitle:bk.title,reason:reason||'Not specified',preferredDate:date,status:'pending',ts:Date.now()});
  DB.set('bookRequests',requests);
  addActivity('fa-hand-paper','#38bdf8',`Book request: "${bk.title}" by ${CU.name}`,'rgba(56,189,248,.15)');
  pushNotif('fa-hand-paper','rgba(56,189,248,.15)','#38bdf8',`New request: "${bk.title}" by ${CU.name}`);
  showToast(`✅ Request submitted for "${bk.title}"!`,'success');
  setVal('req_bookid',''); setVal('req_reason','');
  const p=getEl('req_preview'); if(p) p.style.display='none';
  renderMyRequests();
};

function renderMyRequests(){
  const CU=DB.get('session');
  const requests=(DB.get('bookRequests')||[]).filter(r=>r.studentId===CU.id);
  const g=getEl('myRequestsTable'); if(!g) return;
  if(!requests.length){ g.innerHTML='<div class="empty"><i class="fas fa-hand-paper"></i><p>No book requests yet</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>Req ID</th><th>Book</th><th>Preferred Date</th><th>Reason</th><th>Status</th></tr></thead><tbody>`+
    requests.slice().reverse().map(r=>`<tr>
      <td style="font-family:monospace;color:var(--cyan)">${r.reqId}</td>
      <td style="color:var(--t1);font-weight:500">${r.bookTitle}</td>
      <td>${fmtDate(r.preferredDate)}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis">${r.reason}</td>
      <td><span class="pill ${r.status==='approved'?'pill-g':r.status==='rejected'?'pill-r':'pill-y'}">${r.status==='approved'?'✓ Approved':r.status==='rejected'?'✗ Rejected':'⏳ Pending'}</span></td>
    </tr>`).join('')+'</tbody></table>';
}

window.openQuickRequest = function(bookId,bookTitle){
  const modal=getEl('quickRequestModal');
  if(modal){
    modal.dataset.bookId=bookId;
    const info=getEl('quickReqBookInfo');
    if(info){ const books=DB.get('books')||[]; const b=books.find(x=>x.id===bookId); if(b) info.innerHTML=`<i class="fas fa-book" style="color:var(--gold2)"></i> <strong>${b.title}</strong> — ${b.author}<br><span style="font-size:12px;color:var(--t2)">${b.category} | ${b.available>0?'<span style="color:var(--green)">'+b.available+' available</span>':'<span style="color:var(--red)">Unavailable</span>'}</span>`; }
    setVal('qr_date',today());
    openModal('quickRequestModal');
  }
};

window.submitQuickRequest = function(){
  const CU=DB.get('session');
  const modal=getEl('quickRequestModal');
  const bookId=modal?.dataset.bookId;
  const books=DB.get('books')||[]; const bk=books.find(b=>b.id===bookId); if(!bk) return;
  const requests=DB.get('bookRequests')||[];
  if(requests.find(r=>r.studentId===CU.id&&r.bookId===bk.id&&r.status==='pending')){ showToast('Already requested!','warn'); closeModal('quickRequestModal'); return; }
  const reqId='REQ'+Date.now().toString().slice(-6);
  requests.push({reqId,studentId:CU.id,studentName:CU.name,bookId:bk.id,bookTitle:bk.title,reason:val('qr_reason')||'Not specified',preferredDate:val('qr_date')||today(),status:'pending',ts:Date.now()});
  DB.set('bookRequests',requests);
  pushNotif('fa-hand-paper','rgba(56,189,248,.15)','#38bdf8',`Request submitted: "${bk.title}"`);
  showToast(`✅ Request for "${bk.title}" submitted!`,'success');
  closeModal('quickRequestModal');
};

function renderLibBookRequests(){
  const requests=DB.get('bookRequests')||[];
  const g=getEl('libBookRequestsTable'); if(!g) return;
  if(!requests.length){ g.innerHTML='<div class="empty"><i class="fas fa-inbox"></i><p>No book requests from students</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>Req ID</th><th>Student</th><th>Book</th><th>Date</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead><tbody>`+
    requests.slice().reverse().map(r=>`<tr>
      <td style="font-family:monospace;color:var(--cyan)">${r.reqId}</td>
      <td><strong style="color:var(--t1)">${r.studentName}</strong><br><span style="font-size:11px;color:var(--t3)">${r.studentId}</span></td>
      <td>${r.bookTitle}</td>
      <td>${fmtDate(r.preferredDate)}</td>
      <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis">${r.reason}</td>
      <td><span class="pill ${r.status==='approved'?'pill-g':r.status==='rejected'?'pill-r':'pill-y'}">${r.status}</span></td>
      <td style="display:flex;gap:6px">${r.status==='pending'?`<button class="btn-primary btn-sm" onclick="approveRequest('${r.reqId}')"><i class="fas fa-check"></i></button><button class="btn-danger btn-sm" onclick="rejectRequest('${r.reqId}')"><i class="fas fa-times"></i></button>`:'<span style="color:var(--t3)">Done</span>'}</td>
    </tr>`).join('')+'</tbody></table>';
}

window.approveRequest = function(reqId){
  const requests=DB.get('bookRequests')||[];
  const idx=requests.findIndex(r=>r.reqId===reqId); if(idx<0) return;
  requests[idx].status='approved';
  DB.set('bookRequests',requests);
  pushNotif('fa-check-circle','rgba(110,231,183,.15)','#6ee7b7',`Book request approved: "${requests[idx].bookTitle}" for ${requests[idx].studentName}`);
  showToast('Request approved! Student notified.','success');
  renderLibBookRequests();
};
window.rejectRequest = function(reqId){
  const requests=DB.get('bookRequests')||[];
  const idx=requests.findIndex(r=>r.reqId===reqId); if(idx<0) return;
  requests[idx].status='rejected';
  DB.set('bookRequests',requests);
  showToast('Request rejected.','info');
  renderLibBookRequests();
};

// ═══════════════════════════════════════════════════════════
//  DONATIONS
// ═══════════════════════════════════════════════════════════
window.submitDonation = function(){
  const CU=DB.get('session');
  const title=val('don_title'), author=val('don_author');
  if(!title||!author){ showToast('Book title and author are required.','error'); return; }
  const donations=DB.get('donations')||[];
  const donId='DON'+Date.now().toString().slice(-6);
  donations.push({donId,studentId:CU.id,studentName:CU.name,rollNo:CU.id,studentDept:CU.dept||'—',title,author,category:val('don_cat')||'Other',isbn:val('don_isbn'),condition:getEl('don_condition')?.value||'Good',copies:parseInt(val('don_copies')||'1'),notes:val('don_notes'),status:'pending',date:today(),ts:Date.now()});
  DB.set('donations',donations);
  addActivity('fa-hand-holding-heart','#c4b5fd',`Donation: "${title}" by ${CU.name}`,'rgba(196,181,253,.15)');
  pushNotif('fa-hand-holding-heart','rgba(196,181,253,.15)','#c4b5fd',`New donation: "${title}" from ${CU.name}`);
  ['don_title','don_author','don_isbn','don_notes'].forEach(id=>{ const e=getEl(id);if(e)e.value=''; });
  setVal('don_copies','1');
  showToast(`✅ Thank you for donating "${title}"! Under review.`,'success');
  renderMyDonations();
};

function renderMyDonations(){
  const CU=DB.get('session');
  const donations=(DB.get('donations')||[]).filter(d=>d.studentId===CU.id);
  const g=getEl('myDonationsTable'); if(!g) return;
  if(!donations.length){ g.innerHTML='<div class="empty"><i class="fas fa-gift"></i><p>No donations yet. Be the first to contribute!</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>ID</th><th>Title</th><th>Author</th><th>Copies</th><th>Condition</th><th>Date</th><th>Status</th></tr></thead><tbody>`+
    donations.slice().reverse().map(d=>`<tr>
      <td style="font-family:monospace;color:var(--purple)">${d.donId}</td>
      <td style="color:var(--t1);font-weight:500">${d.title}</td>
      <td>${d.author}</td>
      <td>${d.copies}</td>
      <td><span class="pill pill-y">${d.condition}</span></td>
      <td>${fmtDate(d.date)}</td>
      <td><span class="pill ${d.status==='approved'?'pill-g':'pill-o'}">${d.status==='approved'?'✓ Approved':'⏳ Pending'}</span></td>
    </tr>`).join('')+'</tbody></table>';
}

window.recordDonationByStaff = function(pfx){
  const CU=DB.get('session');
  const student=val(pfx+'_don_student'), roll=val(pfx+'_don_roll');
  const title=val(pfx+'_don_title'), author=val(pfx+'_don_author');
  if(!student||!roll||!title||!author){ showToast('Fill all required fields.','error'); return; }
  const donations=DB.get('donations')||[];
  const donId='DON'+Date.now().toString().slice(-6);
  donations.push({donId,studentId:roll,studentName:student,rollNo:roll,studentDept:val(pfx+'_don_dept')||'—',title,author,category:getEl(pfx+'_don_cat')?.value||'Other',condition:getEl(pfx+'_don_cond')?.value||'Good',copies:parseInt(val(pfx+'_don_copies')||'1'),status:'approved',date:today(),ts:Date.now(),recordedBy:CU.id});
  DB.set('donations',donations);
  addActivity('fa-hand-holding-heart','#c4b5fd',`Donation recorded: "${title}" by ${student} (${roll})`,'rgba(196,181,253,.15)');
  ['student','roll','title','author','dept','copies'].forEach(f=>{ const e=getEl(pfx+'_don_'+f);if(e)e.value=f==='copies'?'1':''; });
  showToast(`✅ Donation recorded for ${student} (${roll})!`,'success');
  renderAllDonations();
  if(getEl('adminStats')) renderAdminStats();
};

let _donFilter='all';
window.filterDonations = function(el,f){
  _donFilter=f;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderAllDonations();
};

function renderAllDonations(){
  let donations=DB.get('donations')||[];
  if(_donFilter==='pending')  donations=donations.filter(d=>d.status==='pending');
  if(_donFilter==='approved') donations=donations.filter(d=>d.status==='approved');
  const g=getEl('allDonationsTable'); if(!g) return;
  if(!donations.length){ g.innerHTML='<div class="empty"><i class="fas fa-gift"></i><p>No donations found</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>ID</th><th>Student</th><th>Roll No.</th><th>Dept</th><th>Book</th><th>Category</th><th>Copies</th><th>Condition</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>`+
    donations.slice().reverse().map(d=>`<tr>
      <td style="font-family:monospace;color:var(--purple)">${d.donId}</td>
      <td style="color:var(--t1);font-weight:500">${d.studentName}</td>
      <td style="font-family:monospace;color:var(--gold2)">${d.rollNo}</td>
      <td>${d.studentDept}</td>
      <td style="color:var(--t1)">${d.title}</td>
      <td><span class="pill pill-p">${d.category}</span></td>
      <td>${d.copies}</td>
      <td>${d.condition}</td>
      <td>${fmtDate(d.date)}</td>
      <td><span class="pill ${d.status==='approved'?'pill-g':'pill-o'}">${d.status}</span></td>
      <td>${d.status==='pending'?`<button class="btn-primary btn-sm" onclick="approveDonation('${d.donId}')"><i class="fas fa-check"></i> Approve</button>`:'<i class="fas fa-check-circle" style="color:var(--green)"></i>'}</td>
    </tr>`).join('')+'</tbody></table>';
}

window.approveDonation = function(donId){
  const donations=DB.get('donations')||[];
  const idx=donations.findIndex(d=>d.donId===donId); if(idx<0) return;
  donations[idx].status='approved';
  DB.set('donations',donations);
  showToast('Donation approved!','success');
  addActivity('fa-check-circle','#6ee7b7',`Donation approved: "${donations[idx].title}" from ${donations[idx].studentName}`,'rgba(110,231,183,.15)');
  renderAllDonations();
  if(getEl('adminStats')) renderAdminStats();
};

// ═══════════════════════════════════════════════════════════
//  PROFILE & PASSWORD CHANGE
// ═══════════════════════════════════════════════════════════
function renderProfile(){
  const CU=DB.get('session');
  const g=getEl('profileContent'); if(!g) return;
  g.innerHTML=`
    <div class="profile-wrap">
      <div class="profile-left">
        <div class="profile-av">${CU.name.charAt(0).toUpperCase()}</div>
        <div class="profile-name">${CU.name}</div>
        <div class="profile-role-pill">${CU.role.charAt(0).toUpperCase()+CU.role.slice(1)}</div>
        <div class="profile-meta-item"><i class="fas fa-id-badge"></i><span>${CU.id}</span></div>
        <div class="profile-meta-item"><i class="fas fa-envelope"></i><span>${CU.email||'—'}</span></div>
        <div class="profile-meta-item"><i class="fas fa-building"></i><span>${CU.dept||'—'}</span></div>
        ${CU.year?`<div class="profile-meta-item"><i class="fas fa-graduation-cap"></i><span>${CU.year}</span></div>`:''}
        <div class="profile-meta-item"><i class="fas fa-phone"></i><span>${CU.phone||'—'}</span></div>
        <div class="profile-meta-item"><i class="fas fa-calendar"></i><span>Joined: ${fmtDate(CU.joined)}</span></div>
      </div>
      <div class="profile-right card">
        <div class="card-hd"><h3><i class="fas fa-key"></i> Change Password</h3></div>
        <div class="form-body">
          <div class="fg"><label>Current Password</label><input type="password" id="cp_cur" placeholder="Enter current password"/></div>
          <div class="fg"><label>New Password</label><input type="password" id="cp_new" placeholder="Min. 4 characters"/></div>
          <div class="fg"><label>Confirm New Password</label><input type="password" id="cp_conf" placeholder="Repeat new password"/></div>
          <div class="form-actions"><button class="btn-primary" onclick="changePassword()"><i class="fas fa-save"></i> Update Password</button></div>
        </div>
        <div class="divider"></div>
        <div class="card-hd"><h3><i class="fas fa-info-circle"></i> Account Details</h3></div>
        <div class="acc-info">
          <div class="acc-row"><span class="acc-lbl">User ID</span><span class="acc-val" style="color:var(--gold2);font-family:monospace">${CU.id}</span></div>
          <div class="acc-row"><span class="acc-lbl">Role</span><span class="acc-val">${CU.role}</span></div>
          <div class="acc-row"><span class="acc-lbl">Email</span><span class="acc-val">${CU.email||'—'}</span></div>
          <div class="acc-row"><span class="acc-lbl">Department</span><span class="acc-val">${CU.dept||'—'}</span></div>
          <div class="acc-row"><span class="acc-lbl">Phone</span><span class="acc-val">${CU.phone||'—'}</span></div>
          <div class="acc-row"><span class="acc-lbl">Joined On</span><span class="acc-val">${fmtDate(CU.joined)}</span></div>
        </div>
      </div>
    </div>`;
}

window.changePassword = function(){
  const cur=val('cp_cur'), nw=val('cp_new'), conf=val('cp_conf');
  const CU=DB.get('session');
  if(!cur||!nw||!conf){ showToast('Please fill all password fields.','error'); return; }
  if(CU.password!==cur){ showToast('Current password is incorrect!','error'); return; }
  if(nw!==conf){ showToast('New passwords do not match!','error'); return; }
  if(nw.length<4){ showToast('Password must be at least 4 characters.','error'); return; }
  const users=DB.get('users')||[];
  const idx=users.findIndex(u=>u.id===CU.id);
  if(idx>=0){ users[idx].password=nw; DB.set('users',users); }
  CU.password=nw; DB.set('session',CU);
  ['cp_cur','cp_new','cp_conf'].forEach(id=>{ const e=getEl(id);if(e)e.value=''; });
  showToast('✅ Password updated successfully!','success');
};

// ═══════════════════════════════════════════════════════════
//  NEW FEATURES — v3.1 Additions
// ═══════════════════════════════════════════════════════════

// ─── BOOK WISHLIST (Student) ────────────────────────────────
window.addToWishlist = function(bookId, bookTitle){
  const CU=DB.get('session'); if(!CU) return;
  const wishes=DB.get('wishlist_'+CU.id)||[];
  if(wishes.find(w=>w.bookId===bookId)){ showToast('Already in your wishlist!','warn'); return; }
  wishes.push({bookId,bookTitle,addedOn:today(),ts:Date.now()});
  DB.set('wishlist_'+CU.id,wishes);
  showToast(`✅ "${bookTitle}" added to wishlist!`,'success');
  renderWishlist();
};

window.removeWishlist = function(bookId){
  const CU=DB.get('session'); if(!CU) return;
  const wishes=(DB.get('wishlist_'+CU.id)||[]).filter(w=>w.bookId!==bookId);
  DB.set('wishlist_'+CU.id,wishes);
  showToast('Removed from wishlist.','info');
  renderWishlist();
};

function renderWishlist(){
  const CU=DB.get('session'); if(!CU) return;
  const wishes=DB.get('wishlist_'+CU.id)||[];
  const g=getEl('wishlistTable'); if(!g) return;
  if(!wishes.length){ g.innerHTML='<div class="empty"><i class="fas fa-heart"></i><p>Your wishlist is empty. Browse books and click ♡ to add!</p></div>'; return; }
  const books=DB.get('books')||[];
  g.innerHTML=`<table><thead><tr><th>Book</th><th>Category</th><th>Availability</th><th>Added On</th><th>Actions</th></tr></thead><tbody>`+
    wishes.map(w=>{
      const b=books.find(x=>x.id===w.bookId);
      return`<tr>
        <td style="color:var(--t1);font-weight:500">${w.bookTitle}</td>
        <td>${b?`<span class="pill pill-b">${b.category}</span>`:'—'}</td>
        <td>${b?`<span class="pill ${b.available>0?'pill-g':'pill-r'}">${b.available>0?b.available+' available':'Unavailable'}</span>`:'<span class="pill pill-o">Not found</span>'}</td>
        <td>${fmtDate(w.addedOn)}</td>
        <td style="display:flex;gap:6px">
          ${b?`<button class="btn-request btn-sm" onclick="openQuickRequest('${b.id}','${b.title.replace(/'/g,"\\'")}')"><i class="fas fa-hand-paper"></i> Request</button>`:''}
          <button class="btn-icon del" onclick="removeWishlist('${w.bookId}')"><i class="fas fa-heart-broken"></i></button>
        </td>
      </tr>`;
    }).join('')+'</tbody></table>';
}

// ─── BOOK RENEWAL (Student) ─────────────────────────────────
window.requestRenewal = function(txId, bookTitle){
  const CU=DB.get('session'); if(!CU) return;
  const issued=DB.get('issued')||[];
  const idx=issued.findIndex(i=>i.txId===txId&&i.studentId===CU.id);
  if(idx<0){ showToast('Issue record not found!','error'); return; }
  if(issued[idx].renewed){ showToast('This book has already been renewed once. Please return and re-issue.','warn'); return; }
  issued[idx].dueDate=addDays(issued[idx].dueDate,7);
  issued[idx].renewed=true;
  DB.set('issued',issued);
  pushNotif('fa-sync','rgba(125,211,252,.15)','#7dd3fc',`Book renewal: "${bookTitle}" extended by 7 days`);
  addActivity('fa-sync','#7dd3fc',`Book renewed: "${bookTitle}" for ${CU.name}`,'rgba(125,211,252,.15)');
  showToast(`✅ "${bookTitle}" renewed! New due date: ${fmtDate(issued[idx].dueDate)}`,'success');
  renderMyBooks();
  renderStuStats(CU);
  renderStuCurrentBooks(CU);
  renderDueDateAlerts(CU);
};

// ─── LIBRARY HOURS & INFO ───────────────────────────────────
window.renderLibraryInfo = function(){
  const g=getEl('libraryInfoContent'); if(!g) return;
  const now=new Date();
  const hour=now.getHours();
  const isOpen=(hour>=8&&hour<20);
  const day=now.toLocaleDateString('en-IN',{weekday:'long'});
  const isSunday=now.getDay()===0;
  g.innerHTML=`
    <div class="stats-row" style="margin-bottom:20px">
      <div class="stat-card" style="--sc-color:${isOpen&&!isSunday?'#6ee7b7':'#f87171'}">
        <div class="sc-icon" style="background:${isOpen&&!isSunday?'rgba(110,231,183,.15)':'rgba(248,113,113,.15)'};color:${isOpen&&!isSunday?'#6ee7b7':'#f87171'}"><i class="fas fa-door-${isOpen&&!isSunday?'open':'closed'}"></i></div>
        <div class="sc-num" style="font-size:20px">${isOpen&&!isSunday?'OPEN':'CLOSED'}</div>
        <div class="sc-label">Library Status — ${day}</div>
      </div>
      <div class="stat-card" style="--sc-color:#7dd3fc">
        <div class="sc-icon" style="background:rgba(125,211,252,.15);color:#7dd3fc"><i class="fas fa-clock"></i></div>
        <div class="sc-num" style="font-size:18px">8AM–8PM</div>
        <div class="sc-label">Weekday Hours</div>
      </div>
      <div class="stat-card" style="--sc-color:#fde68a">
        <div class="sc-icon" style="background:rgba(253,230,138,.15);color:#fde68a"><i class="fas fa-calendar-week"></i></div>
        <div class="sc-num" style="font-size:18px">9AM–5PM</div>
        <div class="sc-label">Saturday Hours</div>
      </div>
      <div class="stat-card" style="--sc-color:#f87171">
        <div class="sc-icon" style="background:rgba(248,113,113,.15);color:#f87171"><i class="fas fa-calendar-times"></i></div>
        <div class="sc-num" style="font-size:18px">CLOSED</div>
        <div class="sc-label">Sunday / Holidays</div>
      </div>
    </div>
    <div class="card">
      <div class="card-hd"><h3><i class="fas fa-info-circle"></i> Library Rules & Policies</h3></div>
      <div style="padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
        ${[
          {icon:'fa-book',color:'#fde68a',title:'Borrowing Limit',desc:'Maximum 3 books at a time per student'},
          {icon:'fa-calendar',color:'#7dd3fc',title:'Loan Period',desc:'14 days for students, 30 days for faculty'},
          {icon:'fa-rupee-sign',color:'#f87171',title:'Fine Rate',desc:'₹5 per day after due date'},
          {icon:'fa-sync',color:'#6ee7b7',title:'Renewal Policy',desc:'Each book can be renewed once for 7 extra days'},
          {icon:'fa-mobile-alt',color:'#c4b5fd',title:'ID Required',desc:'Student/Faculty ID card mandatory for borrowing'},
          {icon:'fa-hand-holding-heart',color:'#f9a8d4',title:'Donations',desc:'Accepted in good/excellent condition only'},
          {icon:'fa-wifi',color:'#5eead4',title:'Reading Zone',desc:'Free Wi-Fi available in all reading areas'},
          {icon:'fa-print',color:'#fdba74',title:'Photocopy',desc:'Available Mon–Sat, ₹1 per page'},
        ].map(r=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:10px;background:var(--card2);border-radius:10px;border:1px solid var(--border)">
          <div style="width:34px;height:34px;border-radius:9px;background:${r.color}22;color:${r.color};display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fas ${r.icon}"></i></div>
          <div><div style="font-size:13px;font-weight:600;color:var(--t1)">${r.title}</div><div style="font-size:12px;color:var(--t2);margin-top:2px">${r.desc}</div></div>
        </div>`).join('')}
      </div>
    </div>
  `;
};

// ─── MARK NOTIFICATION AS READ ──────────────────────────────
window.markNotifRead = function(idx){
  const notifs=DB.get('notifications')||[];
  if(notifs[idx]) notifs.splice(idx,1);
  DB.set('notifications',notifs);
  refreshNotifBadge();
  refreshNotifPanel();
};

// ─── ENHANCED NOTIFICATION PANEL ────────────────────────────
// Override refreshNotifPanel to add dismiss buttons
const _origRefreshNotifPanel = refreshNotifPanel;
refreshNotifPanel = function(){
  const list = getEl('notifList'); if(!list) return;
  const notifs = DB.get('notifications')||[];
  if(!notifs.length){
    list.innerHTML='<div class="notif-empty"><i class="fas fa-bell-slash"></i><p>All caught up! No notifications.</p></div>';
    return;
  }
  list.innerHTML = notifs.map((n,i)=>`
    <div class="notif-item" id="ni_${i}">
      <div class="ni-icon" style="background:${n.bg||'rgba(61,50,88,.6)'};color:${n.color}"><i class="fas ${n.icon}"></i></div>
      <div style="flex:1;min-width:0">
        <strong style="display:block;font-size:13px;color:var(--t1)">${n.text}</strong>
        <span style="font-size:11px;color:var(--t3)">${timeAgo(n.ts)}</span>
      </div>
      <button onclick="markNotifRead(${i})" style="background:none;border:none;color:var(--t3);cursor:pointer;padding:4px;font-size:12px;flex-shrink:0" title="Dismiss"><i class="fas fa-times"></i></button>
    </div>`).join('');
};

// ─── ISSUE BOOK — LOOKUP BY NAME ────────────────────────────
window.lookupStudentByName = function(query){
  if(!query||query.length<2) return;
  const users=DB.get('users')||[];
  const results=users.filter(u=>u.role==='student'&&(u.name.toLowerCase().includes(query.toLowerCase())||u.id.toLowerCase().includes(query.toLowerCase())));
  const g=getEl('stuLookupResults'); if(!g) return;
  if(!results.length){ g.innerHTML=''; return; }
  g.innerHTML=results.slice(0,5).map(u=>`
    <div onclick="selectStudent('${u.id}','${u.name.replace(/'/g,"\\'")}',this)" style="padding:9px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--border);transition:background var(--tr)" onmouseover="this.style.background='var(--card2)'" onmouseout="this.style.background=''">
      <strong style="color:var(--t1)">${u.name}</strong>
      <span style="color:var(--t3);margin-left:8px">${u.id}</span>
      <span class="pill pill-b" style="margin-left:8px;font-size:10px">${u.dept||'—'}</span>
    </div>`).join('');
};

window.selectStudent = function(id, name, el){
  setVal('is_sid', id);
  const g=getEl('stuLookupResults'); if(g) g.innerHTML='';
  showToast(`Student: ${name} (${id})`, 'info');
  previewIssue();
};

window.lookupBookByTitle = function(query){
  if(!query||query.length<2) return;
  const books=DB.get('books')||[];
  const results=books.filter(b=>b.title.toLowerCase().includes(query.toLowerCase())||b.id.toLowerCase().includes(query.toLowerCase()));
  const g=getEl('bookLookupResults'); if(!g) return;
  if(!results.length){ g.innerHTML=''; return; }
  g.innerHTML=results.slice(0,5).map(b=>`
    <div onclick="selectBook('${b.id}','${b.title.replace(/'/g,"\\'")}',this)" style="padding:9px 14px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--border);transition:background var(--tr)" onmouseover="this.style.background='var(--card2)'" onmouseout="this.style.background=''">
      <strong style="color:var(--t1)">${b.title}</strong>
      <span class="pill ${b.available>0?'pill-g':'pill-r'}" style="margin-left:8px;font-size:10px">${b.available>0?b.available+' avail':'Unavail'}</span>
      <span style="color:var(--t3);margin-left:6px;font-size:11px">${b.id}</span>
    </div>`).join('');
};

window.selectBook = function(id, title, el){
  setVal('is_bid', id);
  const g=getEl('bookLookupResults'); if(g) g.innerHTML='';
  showToast(`Book: ${title}`, 'info');
  previewIssue();
};

// ─── SHOWSEC additions for new sections ─────────────────────
const _origShowSec = window.showSec;
window.showSec = function(id){
  _origShowSec(id);
  if(id==='wishlist')     renderWishlist();
  if(id==='libraryInfo')  renderLibraryInfo();
};

// Update PAGE_TITLES with new sections
Object.assign(PAGE_TITLES,{
  wishlist:'My Wishlist',
  libraryInfo:'Library Information',
  renewBook:'Renew a Book',
});


// ═══════════════════════════════════════════════════════════
//  ADMIN — BOOKS TABLE (read-only view)
// ═══════════════════════════════════════════════════════════
window.renderAdminBooksTable = function(){
  const books=DB.get('books')||[];
  const g=getEl('adminBooksTable'); if(!g) return;
  if(!books.length){ g.innerHTML='<div class="empty"><i class="fas fa-books"></i><p>No books in catalog yet</p></div>'; return; }
  const totalCopies=books.reduce((s,b)=>s+b.qty,0);
  const totalAvail=books.reduce((s,b)=>s+b.available,0);
  const summary=getEl('adminBooksSummary');
  if(summary) summary.innerHTML=`
    <div class="stats-row" style="margin-bottom:16px">
      <div class="stat-card" style="--sc-color:#fde68a"><div class="sc-icon" style="background:rgba(253,230,138,.15);color:#fde68a"><i class="fas fa-books"></i></div><div class="sc-num" id="abs_total">0</div><div class="sc-label">Total Titles</div></div>
      <div class="stat-card" style="--sc-color:#6ee7b7"><div class="sc-icon" style="background:rgba(110,231,183,.15);color:#6ee7b7"><i class="fas fa-copy"></i></div><div class="sc-num" id="abs_copies">0</div><div class="sc-label">Total Copies</div></div>
      <div class="stat-card" style="--sc-color:#7dd3fc"><div class="sc-icon" style="background:rgba(125,211,252,.15);color:#7dd3fc"><i class="fas fa-check-circle"></i></div><div class="sc-num" id="abs_avail">0</div><div class="sc-label">Available Now</div></div>
      <div class="stat-card" style="--sc-color:#fdba74"><div class="sc-icon" style="background:rgba(253,186,116,.15);color:#fdba74"><i class="fas fa-arrow-up"></i></div><div class="sc-num" id="abs_issued">0</div><div class="sc-label">Issued Out</div></div>
    </div>`;
  animateNum('abs_total',books.length);
  animateNum('abs_copies',totalCopies);
  animateNum('abs_avail',totalAvail);
  animateNum('abs_issued',totalCopies-totalAvail);

  // Category breakdown donut-style bars
  const cats={};
  books.forEach(b=>{ cats[b.category]=(cats[b.category]||0)+b.qty; });
  const catColors={'Java':'#fde68a','Python':'#7dd3fc','AI/ML':'#c4b5fd','Data Structures':'#6ee7b7','Web Development':'#f9a8d4','Networks':'#5eead4','Operating Systems':'#fdba74','Mathematics':'#a5b4fc','Physics':'#fca5a5','Other':'#d4d4d4'};
  const maxC=Math.max(...Object.values(cats),1);
  const catBreak=getEl('adminCatBreak');
  if(catBreak) catBreak.innerHTML=Object.entries(cats).map(([k,v])=>`
    <div class="cat-item">
      <div class="cat-lbl"><span>${k}</span><span style="color:${catColors[k]||'#d4d4d4'};font-weight:700">${v} copies</span></div>
      <div class="cat-track"><div class="cat-fill" style="width:0;background:${catColors[k]||'#d4d4d4'}" data-w="${Math.round(v/maxC*100)}"></div></div>
    </div>`).join('');
  setTimeout(()=>document.querySelectorAll('.cat-fill').forEach(b=>b.style.width=b.dataset.w+'%'),120);

  g.innerHTML=`<table><thead><tr><th>ID</th><th>Title</th><th>Author</th><th>Category</th><th>Copies</th><th>Available</th><th>Issued</th><th>Shelf</th><th>Borrows</th></tr></thead><tbody>`+
    books.map(b=>`<tr>
      <td style="font-family:monospace;color:var(--gold2)">${b.id}</td>
      <td style="color:var(--t1);font-weight:500;max-width:190px;overflow:hidden;text-overflow:ellipsis" title="${b.title}">${b.title}</td>
      <td>${b.author}</td>
      <td><span class="pill pill-b">${b.category}</span></td>
      <td style="font-weight:700;color:var(--t1)">${b.qty}</td>
      <td><span class="pill ${b.available>0?'pill-g':'pill-r'}">${b.available}</span></td>
      <td><span class="pill pill-o">${b.qty-b.available}</span></td>
      <td>${b.shelf}</td>
      <td><span class="rank-count" style="font-size:12px;font-weight:700;color:var(--gold2);background:rgba(240,180,41,.14);padding:2px 10px;border-radius:20px">${b.borrow||0}×</span></td>
    </tr>`).join('')+'</tbody></table>';
};

window.filterAdminBooks = function(q){
  const books=(DB.get('books')||[]).filter(b=>
    b.title.toLowerCase().includes(q.toLowerCase())||
    b.author.toLowerCase().includes(q.toLowerCase())||
    b.id.toLowerCase().includes(q.toLowerCase())||
    b.category.toLowerCase().includes(q.toLowerCase())
  );
  const g=getEl('adminBooksTable'); if(!g) return;
  if(!books.length){ g.innerHTML='<div class="empty"><i class="fas fa-search"></i><p>No books match your search</p></div>'; return; }
  g.innerHTML=`<table><thead><tr><th>ID</th><th>Title</th><th>Author</th><th>Category</th><th>Copies</th><th>Available</th><th>Issued</th><th>Shelf</th><th>Borrows</th></tr></thead><tbody>`+
    books.map(b=>`<tr>
      <td style="font-family:monospace;color:var(--gold2)">${b.id}</td>
      <td style="color:var(--t1);font-weight:500;max-width:190px;overflow:hidden;text-overflow:ellipsis">${b.title}</td>
      <td>${b.author}</td>
      <td><span class="pill pill-b">${b.category}</span></td>
      <td style="font-weight:700">${b.qty}</td>
      <td><span class="pill ${b.available>0?'pill-g':'pill-r'}">${b.available}</span></td>
      <td><span class="pill pill-o">${b.qty-b.available}</span></td>
      <td>${b.shelf}</td>
      <td>${b.borrow||0}×</td>
    </tr>`).join('')+'</tbody></table>';
};

// ═══════════════════════════════════════════════════════════
//  ADMIN — SYSTEM SETTINGS
// ═══════════════════════════════════════════════════════════
window.renderSystemSettings = function(){
  const g=getEl('systemSettingsContent'); if(!g) return;
  const settings=DB.get('systemSettings')||{
    fineRate:5, loanDays:14, maxBooks:3, libraryName:'VEMU Central Library',
    libPhone:'08576-258258', libEmail:'library@vemu.ac.in',
    renewalDays:7, maxRenewals:1
  };
  g.innerHTML=`
    <div class="dash-grid2">
      <div class="form-card">
        <div style="font-family:var(--f-display);font-size:16px;font-weight:700;margin-bottom:18px;color:var(--t1);display:flex;align-items:center;gap:10px"><i class="fas fa-sliders-h" style="color:var(--gold2)"></i> Circulation Rules</div>
        <div class="form-grid">
          <div class="fg"><label><i class="fas fa-rupee-sign"></i> Fine Rate (₹/day)</label><input type="number" id="ss_fineRate" value="${settings.fineRate}" min="1"/></div>
          <div class="fg"><label><i class="fas fa-calendar"></i> Default Loan Days</label><input type="number" id="ss_loanDays" value="${settings.loanDays}" min="1"/></div>
          <div class="fg"><label><i class="fas fa-books"></i> Max Books per Student</label><input type="number" id="ss_maxBooks" value="${settings.maxBooks}" min="1"/></div>
          <div class="fg"><label><i class="fas fa-sync"></i> Renewal Extension (days)</label><input type="number" id="ss_renewalDays" value="${settings.renewalDays}" min="1"/></div>
        </div>
        <div class="form-actions"><button class="btn-primary" onclick="saveSystemSettings()"><i class="fas fa-save"></i> Save Settings</button></div>
      </div>
      <div class="form-card">
        <div style="font-family:var(--f-display);font-size:16px;font-weight:700;margin-bottom:18px;color:var(--t1);display:flex;align-items:center;gap:10px"><i class="fas fa-university" style="color:var(--gold2)"></i> Library Details</div>
        <div class="form-grid">
          <div class="fg span2"><label>Library Name</label><input type="text" id="ss_libName" value="${settings.libraryName}"/></div>
          <div class="fg"><label>Phone</label><input type="text" id="ss_libPhone" value="${settings.libPhone}"/></div>
          <div class="fg"><label>Email</label><input type="email" id="ss_libEmail" value="${settings.libEmail}"/></div>
        </div>
        <div class="form-actions"><button class="btn-primary" onclick="saveSystemSettings()"><i class="fas fa-save"></i> Save Details</button></div>
      </div>
    </div>
    <div class="form-card" style="margin-top:16px">
      <div style="font-family:var(--f-display);font-size:16px;font-weight:700;margin-bottom:18px;color:var(--t1);display:flex;align-items:center;gap:10px"><i class="fas fa-database" style="color:var(--red)"></i> Data Management</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn-ghost" onclick="exportData()"><i class="fas fa-download"></i> Export All Data (JSON)</button>
        <button class="btn-danger" onclick="openConfirm('Reset ALL library data? This will delete all users, books, transactions and cannot be undone!',resetAllData)"><i class="fas fa-exclamation-triangle"></i> Reset All Data</button>
      </div>
    </div>`;
};

window.saveSystemSettings = function(){
  const settings={
    fineRate:parseInt(val('ss_fineRate'))||5,
    loanDays:parseInt(val('ss_loanDays'))||14,
    maxBooks:parseInt(val('ss_maxBooks'))||3,
    renewalDays:parseInt(val('ss_renewalDays'))||7,
    libraryName:val('ss_libName')||'VEMU Central Library',
    libPhone:val('ss_libPhone')||'',
    libEmail:val('ss_libEmail')||'',
  };
  DB.set('systemSettings',settings);
  addActivity('fa-cog','#a5b4fc','System settings updated by admin','rgba(165,180,252,.15)');
  showToast('✅ Settings saved successfully!','success');
};

window.exportData = function(){
  const data={users:DB.get('users'),books:DB.get('books'),issued:DB.get('issued'),returned:DB.get('returned'),donations:DB.get('donations'),bookRequests:DB.get('bookRequests'),activity:DB.get('activity')};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='VEMU_LMS_Backup_'+today()+'.json'; a.click();
  showToast('✅ Data exported as JSON file!','success');
};

window.resetAllData = function(){
  ['users','books','issued','returned','donations','bookRequests','activity','notifications','seeded'].forEach(k=>DB.del(k));
  showToast('System reset. Reloading...','info');
  setTimeout(()=>window.location.href='/',1500);
};

// ═══════════════════════════════════════════════════════════
//  ADMIN — QUICK ACTIONS PANEL
// ═══════════════════════════════════════════════════════════
window.renderQuickActions = function(){
  const g=getEl('quickActionsContent'); if(!g) return;
  const users=DB.get('users')||[], books=DB.get('books')||[];
  const issued=(DB.get('issued')||[]).filter(i=>i.status!=='returned');
  const overdue=issued.filter(i=>i.dueDate<today());
  const pendingReqs=(DB.get('bookRequests')||[]).filter(r=>r.status==='pending');
  const pendingDons=(DB.get('donations')||[]).filter(d=>d.status==='pending');
  g.innerHTML=`
    <div class="stats-row" style="margin-bottom:16px">
      <div class="stat-card" style="--sc-color:#f87171;cursor:pointer" onclick="showSec('allUsers')">
        <div class="sc-icon" style="background:rgba(248,113,113,.15);color:#f87171"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="sc-num">${overdue.length}</div><div class="sc-label">Overdue Books</div>
      </div>
      <div class="stat-card" style="--sc-color:#7dd3fc;cursor:pointer" onclick="showSec('adminBooks')">
        <div class="sc-icon" style="background:rgba(125,211,252,.15);color:#7dd3fc"><i class="fas fa-hand-paper"></i></div>
        <div class="sc-num">${pendingReqs.length}</div><div class="sc-label">Pending Requests</div>
      </div>
      <div class="stat-card" style="--sc-color:#c4b5fd;cursor:pointer" onclick="showSec('donations')">
        <div class="sc-icon" style="background:rgba(196,181,253,.15);color:#c4b5fd"><i class="fas fa-hand-holding-heart"></i></div>
        <div class="sc-num">${pendingDons.length}</div><div class="sc-label">Pending Donations</div>
      </div>
    </div>
    <div class="dash-grid2">
      <div class="card">
        <div class="card-hd"><h3><i class="fas fa-bolt"></i> Quick Navigation</h3></div>
        <div style="padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${[
            {icon:'fa-user-plus',label:'Add Librarian',sec:'addLibrarian',c:'#7dd3fc'},
            {icon:'fa-chalkboard-teacher',label:'Add Faculty',sec:'addFaculty',c:'#c4b5fd'},
            {icon:'fa-user-graduate',label:'Add Student',sec:'addStudent',c:'#6ee7b7'},
            {icon:'fa-users',label:'All Users',sec:'allUsers',c:'#fde68a'},
            {icon:'fa-books',label:'View Books',sec:'adminBooks',c:'#fdba74'},
            {icon:'fa-hand-holding-heart',label:'Donations',sec:'donations',c:'#f9a8d4'},
            {icon:'fa-history',label:'Activity Log',sec:'activity',c:'#5eead4'},
            {icon:'fa-cog',label:'Settings',sec:'systemSettings',c:'#a5b4fc'},
          ].map(a=>`<button onclick="showSec('${a.sec}')" style="background:${a.c}18;border:1px solid ${a.c}44;border-radius:12px;padding:12px;color:var(--t1);cursor:pointer;font-family:var(--f-body);font-size:13px;font-weight:500;display:flex;align-items:center;gap:10px;transition:all .2s" onmouseover="this.style.background='${a.c}30'" onmouseout="this.style.background='${a.c}18'"><i class='fas ${a.icon}' style='color:${a.c};width:16px'></i>${a.label}</button>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-hd"><h3><i class="fas fa-chart-pie"></i> Library Health</h3></div>
        <div style="padding:16px">
          ${[
            {label:'Books utilisation',val:books.reduce((s,b)=>s+b.qty-b.available,0),max:books.reduce((s,b)=>s+b.qty,0)||1,c:'#fde68a'},
            {label:'Students with books',val:[...new Set(issued.map(i=>i.studentId))].length,max:users.filter(u=>u.role==='student').length||1,c:'#6ee7b7'},
            {label:'Overdue rate',val:overdue.length,max:issued.length||1,c:'#f87171'},
          ].map(h=>{const pct=Math.min(100,Math.round(h.val/h.max*100));return`<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--t2);margin-bottom:5px"><span>${h.label}</span><span style="font-weight:700;color:${h.c}">${h.val} / ${h.max} (${pct}%)</span></div><div style="background:var(--card3);border-radius:20px;height:8px;overflow:hidden"><div style="width:${pct}%;background:${h.c};height:100%;border-radius:20px;transition:width 1.2s ease"></div></div></div>`;}).join('')}
        </div>
      </div>
    </div>`;
};


// ═══════════════════════════════════════════════════════════
//  PORTAL BACKGROUND PARTICLES
// ═══════════════════════════════════════════════════════════
function initPortalBackground(){
  const bg = getEl('portalBg');
  if(!bg) return;
  // Add floating particles
  for(let i=0; i<20; i++){
    const p = document.createElement('div');
    p.className = 'bg-particle';
    p.style.cssText = `
      left: ${Math.random()*100}%;
      width: ${Math.random()*4+2}px;
      height: ${Math.random()*4+2}px;
      opacity: ${Math.random()*0.3+0.1};
      animation-duration: ${Math.random()*25+15}s;
      animation-delay: ${Math.random()*20}s;
    `;
    bg.appendChild(p);
  }
}

// ═══════════════════════════════════════════════════════════
//  SETTINGS PANEL
// ═══════════════════════════════════════════════════════════
function renderSettings(){
  const g = getEl('settingsContent');
  if(!g) return;
  const CU = DB.get('session');
  if(!CU) return;

  const isDark = !document.body.classList.contains('lm');
  const currentTheme = DB.get('portalTheme') || 'default';
  const portalNames = {student:'Student Portal',faculty:'Faculty Portal',admin:'Admin Portal',librarian:'Librarian Portal'};
  const portalColors = {student:'#10b981',faculty:'#6366f1',admin:'#dc2626',librarian:'#06b6d4'};
  const portalIcons = {student:'fa-graduation-cap',faculty:'fa-chalkboard-teacher',admin:'fa-shield-alt',librarian:'fa-book-reader'};

  g.innerHTML = `
    <div class="portal-info-badge">
      <i class="fas ${portalIcons[CU.role]||'fa-user'}"></i>
      ${portalNames[CU.role]||CU.role}
    </div>

    <div class="settings-grid">

      <!-- Appearance -->
      <div class="settings-card">
        <h3><i class="fas fa-palette"></i> Appearance</h3>
        <p>Customize the look and feel of your dashboard</p>

        <div class="setting-row">
          <div class="setting-info">
            <h4><i class="fas fa-moon" style="margin-right:6px;color:var(--gold2)"></i> Dark Mode</h4>
            <span>Use dark theme for reduced eye strain</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="darkModeToggle" ${isDark?'checked':''} onchange="toggleDark()">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div style="margin-top:16px">
          <h4 style="font-size:13px;font-weight:600;color:var(--t1);margin-bottom:10px">Portal Theme</h4>
          <div class="theme-preview">
            <div class="theme-swatch ${currentTheme === 'default' ? 'active' : ''}" data-tname="default" style="background:${portalColors[CU.role]||'#c0392b'}" title="Current theme" onclick="setPortalTheme('default')"></div>
            <div class="theme-swatch ${currentTheme === 'dark-blend' ? 'active' : ''}" data-tname="dark-blend" style="background:linear-gradient(135deg,${portalColors[CU.role]||'#c0392b'},#1a1a2e)" title="Dark blend" onclick="setPortalTheme('dark-blend')"></div>
            <div class="theme-swatch ${currentTheme === 'gold-accent' ? 'active' : ''}" data-tname="gold-accent" style="background:linear-gradient(135deg,${portalColors[CU.role]||'#c0392b'},#f0b429)" title="Gold accent" onclick="setPortalTheme('gold-accent')"></div>
            <div class="theme-swatch ${currentTheme === 'rose' ? 'active' : ''}" data-tname="rose" style="background:linear-gradient(135deg,${portalColors[CU.role]||'#c0392b'},#f472b6)" title="Pastel Rose" onclick="setPortalTheme('rose')"></div>
          </div>
        </div>
      </div>

      <!-- Account -->
      <div class="settings-card">
        <h3><i class="fas fa-user-shield"></i> Account Info</h3>
        <p>Your profile and account details</p>

        <div class="setting-row">
          <div class="setting-info">
            <h4>Name</h4>
            <span>${CU.name}</span>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <h4>User ID</h4>
            <span style="font-family:monospace;color:var(--gold2)">${CU.id}</span>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <h4>Role</h4>
            <span>${CU.role.charAt(0).toUpperCase()+CU.role.slice(1)}</span>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <h4>Email</h4>
            <span>${CU.email||'Not set'}</span>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="settings-card">
        <h3><i class="fas fa-bell"></i> Notifications</h3>
        <p>Manage your notification preferences</p>

        <div class="setting-row">
          <div class="setting-info">
            <h4>Push Notifications</h4>
            <span>Get alerts for due dates and updates</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" checked>
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <h4>Due Date Reminders</h4>
            <span>Remind me before books are due</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" checked>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <!-- About -->
      <div class="settings-card">
        <h3><i class="fas fa-info-circle"></i> About</h3>
        <p>System information</p>

        <div class="setting-row">
          <div class="setting-info">
            <h4>Version</h4>
            <span>VEMU LMS v3.0 — Premium Edition</span>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <h4>Developer</h4>
            <span>VEMU Institute of Technology</span>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <h4>Last Updated</h4>
            <span>${fmtDate(today())}</span>
          </div>
        </div>
      </div>

    </div>
  `;
}
