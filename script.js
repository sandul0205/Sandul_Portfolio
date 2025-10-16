// ---------- AOS init + ready flag ----------
AOS.init({ once: true });
document.body.classList.add('aos-ready');

// ---------- Theme toggle (switches Bootstrap palette too) ----------
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const navBar      = document.querySelector('.custom-navbar');

function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme === 'dark' ? 'dark' : 'light'); // Bootstrap var set
  localStorage.setItem('theme', theme);

  themeIcon.className = (theme === 'dark') ? 'bi bi-brightness-high' : 'bi bi-moon-stars';
  navBar.classList.toggle('navbar-dark',  theme === 'dark');
  navBar.classList.toggle('navbar-light', theme !== 'dark');
}

// Load saved or default theme
const initial = localStorage.getItem('theme') || document.documentElement.getAttribute('data-theme') || 'light';
applyTheme(initial);

themeToggle.addEventListener('click', () => {
  const next = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
  applyTheme(next);
});

// ---------- Navbar + progress + back-to-top ----------
const toTop = document.getElementById('toTop');
const scrollBar = document.getElementById('scrollBar');
function onScroll() {
  const y = window.scrollY || 0;
  navBar.classList.toggle('scrolled', y > 10);
  toTop.classList.toggle('show', y > 300);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.setProperty('--scroll', (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%');
}
onScroll(); addEventListener('scroll', onScroll, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Typewriter ----------
const roles = ['React Front-End', 'Flutter Mobile', 'Node/NestJS APIs', 'MySQL • REST • JWT'];
const tw = document.getElementById('typewriter');
let idx = 0, ch = 0, del = false;
(function type(){
  const cur = roles[idx];
  tw.textContent = cur.slice(0, ch);
  if (!del && ch < cur.length) ch++;
  else if (del && ch > 0) ch--;
  else { del = !del; if (!del) idx = (idx + 1) % roles.length; setTimeout(type, 800); return; }
  setTimeout(type, del ? 30 : 70);
})();

// ---------- Skill bars ----------
const bars = document.querySelectorAll('.skill-bar');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e => {
    if(e.isIntersecting){
      const pct = +e.target.dataset.progress || 0;
      e.target.firstElementChild.style.width = pct + '%';
      io.unobserve(e.target);
    }
  });
},{ threshold:.5 });
bars.forEach(b=>io.observe(b));

// ---------- Counters ----------
const counters = document.querySelectorAll('[data-count]');
const io2 = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const target = +e.target.dataset.count; let cur = 0;
      const step = Math.max(1, Math.round(target/40));
      const id = setInterval(()=>{ cur += step; if(cur >= target){ cur = target; clearInterval(id); } e.target.textContent = cur; }, 30);
      io2.unobserve(e.target);
    }
  });
},{threshold:.6});
counters.forEach(c=>io2.observe(c));

// ---------- Project filters ----------
const grid = document.getElementById('projectGrid');
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    grid.querySelectorAll('.project').forEach(card=>{
      card.style.display = (f === 'all' || card.dataset.cat === f) ? '' : 'none';
    });
  });
});

// ---------- Project modal ----------
const modalEl = document.getElementById('projectModal');
const modal = new bootstrap.Modal(modalEl);
document.querySelectorAll('.viewMore').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.getElementById('modalTitle').textContent = btn.dataset.title || 'Project';
    document.getElementById('modalBody').textContent = btn.dataset.desc || '';
    modal.show();
  });
});

// ---------- Contact form ----------
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!form.checkValidity()){
    form.classList.add('was-validated');
    return;
  }
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('message').value.trim();
  const subject = encodeURIComponent('Portfolio Contact');
  const body = encodeURIComponent(`Hi Sandul,%0D%0A%0D%0A${msg}%0D%0A%0D%0AFrom: ${name} (${email})`);
  window.location.href = `mailto:kadsdulhan@gmail.com?subject=${subject}&body=${body}`;
});

// ---------- Copy email + toast ----------
const copyBtn = document.getElementById('copyEmail');
const toast = document.getElementById('toast');
function showToast(text='Copied!'){ toast.textContent = text; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'), 1400); }
copyBtn.addEventListener('click', async ()=>{ try{ await navigator.clipboard.writeText('kadsdulhan@gmail.com'); showToast('Email copied'); } catch{ showToast('Copy failed'); } });

// ---------- Year + print ----------
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('printResume').addEventListener('click', ()=> window.print());
