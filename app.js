/* ── FeedGaza — app.js ── */

// ── IMPACT DESCRIPTIONS ──
// Keyed as `amount_freq` — e.g. "50_monthly"
const impactDescriptions = {
  // MONTHLY
  '10_monthly':  '$10 every month provides 5 nutritious meals for a malnourished child each month. That is the difference between a child who survives and one who does not. Your monthly commitment keeps them alive.',
  '25_monthly':  '$25 a month keeps a mother and her young children fed every week. Your recurring gift means they never spend another night wondering where their next meal will come from.',
  '50_monthly':  '$50 every month is a complete food lifeline for an entire family — grains, lentils, cooking oil, and canned protein delivered to their door. Month after month, you become the reason a family survives. This is the single most impactful thing you can do.',
  '100_monthly': '$100 a month feeds two families through every week of the year. Children go to school with food in their stomach. Mothers are not forced to choose which child eats today. You make that possible.',
  '250_monthly': '$250 a month sustains five families continuously. At this level, you become a pillar of support for an entire community. The Sadaqah Jariyah you earn from this ongoing commitment is beyond what any of us can calculate.',
  '500_monthly': '$500 a month means your name is attached to feeding an entire neighborhood of families, month after month, without interruption. The reward with Allah for such sustained generosity is immeasurable. May He multiply it 700-fold and beyond.',

  // ONE-TIME
  '10_once':  '$10 provides 5 hot meals for a starving child. Tonight, because of you, a child sleeps without the screaming pain of hunger. That child is real. That child is your Muslim sibling.',
  '25_once':  '$25 covers a full week of food for a small family — seven days of meals, seven nights of relief from the agony of watching your children beg for food you cannot give them.',
  '50_once':  '$50 is a complete emergency food package for a family: grains, lentils, cooking oil, and canned protein that will last them weeks. One gift. One family saved from the worst.',
  '100_once': '$100 feeds two families in crisis. Right now, two mothers are praying someone will answer their du\'a. You can be the answer to both of them in a single act of generosity.',
  '250_once': '$250 provides food for five families plus access to clean water. At this level, your single donation becomes a community lifeline — the kind that earns you Sadaqah Jariyah that continues even after you are gone.',
  '500_once': '$500 funds a full month\'s complete food supply for a family — comprehensive nutrition, every day, for 30 days. This is the most generous single gift you can give. May Allah accept it and reward you beyond what you can imagine.',
};

function getImpactText(amount, freq) {
  const key = `${amount}_${freq}`;
  if (impactDescriptions[key]) return impactDescriptions[key];
  // Fallback for custom amounts
  if (freq === 'monthly') {
    return `$${amount} every month feeds families in Gaza who have absolutely nothing. Your recurring commitment means they never go a month without food. Allah sees your consistency — and your reward grows with every family you sustain.`;
  }
  return `$${amount} provides immediate food relief to starving families in Gaza. Every dollar directly feeds hungry children and their parents who have been left with nothing. May Allah accept this from you and multiply your reward.`;
}

// ── STATE ──
let selectedAmount = 50;
let selectedType = 'sadaqah';
let selectedFreq = 'monthly';

// ── ELEMENTS ──
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const stickyDonate = document.getElementById('stickyDonate');
const amountBtns = document.querySelectorAll('.amount-btn');
const customAmountInput = document.getElementById('customAmount');
const summaryAmount = document.getElementById('summaryAmount');
const summaryType = document.getElementById('summaryType');
const donateBtn = document.getElementById('donateBtn');
const impactText = document.getElementById('impactText');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalOk = document.getElementById('modalOk');

// ── NAVBAR SCROLL ──
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  handleStickyBar();
}, { passive: true });

// ── HAMBURGER ──
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── STICKY BAR ──
let stickyVisible = false;
function handleStickyBar() {
  if (window.innerWidth > 768) return;
  const heroBottom = document.getElementById('hero').offsetHeight;
  const shouldShow = window.scrollY > heroBottom;
  if (shouldShow !== stickyVisible) {
    stickyVisible = shouldShow;
    stickyDonate.classList.toggle('visible', shouldShow);
  }
}

// ── UPDATE SUMMARY + IMPACT TEXT ──
const impactFooterLabels = {
  sadaqah: 'Sadaqah that reaches the most vulnerable on Earth',
  zakat:   'Zakat — an obligation fulfilled, accepted by Allah',
  fidya:   'Fidya / Kaffarah — expiation that feeds the hungry',
  general: 'Your donation reaches those who need it most',
};

function updateUI() {
  const freqLabel = selectedFreq === 'monthly' ? '/mo' : '';
  const display = `$${selectedAmount}${freqLabel}`;
  summaryAmount.textContent = display;
  donateBtn.textContent = `Complete Donation — ${display}`;

  // Animate impact panel: fade out → swap text → fade in
  const panel = document.getElementById('impactDescription');
  panel.classList.add('changing');
  setTimeout(() => {
    impactText.textContent = getImpactText(selectedAmount, selectedFreq);
    const footerSpan = panel.querySelector('.impact-panel-footer span');
    if (footerSpan) footerSpan.textContent = impactFooterLabels[selectedType] || impactFooterLabels.general;
    panel.classList.remove('changing');
  }, 220);
}

// ── AMOUNT BUTTONS ──
amountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    amountBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedAmount = parseInt(btn.dataset.amount);
    customAmountInput.value = '';
    updateUI();
  });
});

// ── CUSTOM AMOUNT ──
customAmountInput.addEventListener('input', () => {
  const val = parseInt(customAmountInput.value);
  if (!isNaN(val) && val > 0) {
    amountBtns.forEach(b => b.classList.remove('active'));
    selectedAmount = val;
    updateUI();
  }
});

// ── FREQUENCY TOGGLE ──
document.querySelectorAll('.freq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedFreq = btn.dataset.freq;
    updateUI();
  });
});

// ── DONATION TYPE ──
document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedType = btn.dataset.type;
    const labels = {
      sadaqah: 'Sadaqah',
      zakat: 'Zakat',
      fidya: 'Fidya / Kaffarah',
      general: 'General Donation'
    };
    summaryType.textContent = labels[selectedType] || 'General Donation';
    updateUI();
  });
});

// ── DONATE BUTTON ──
donateBtn.addEventListener('click', async () => {
  donateBtn.textContent = 'Processing...';
  donateBtn.disabled = true;

  try {
    const res = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: selectedAmount,
        frequency: selectedFreq,
        type: selectedType,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'Something went wrong');
    }
  } catch (err) {
    alert('Payment could not be started. Please try again.');
    donateBtn.disabled = false;
    updateUI();
  }
});

function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modalOk.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

// ── SCROLL FADE-IN ANIMATIONS ──
const fadeTargets = document.querySelectorAll(
  '.impact-card, .ayah-card, .hadith-card, .why-card, .step-card, ' +
  '.gives-item, .scholar-card, .suffering-text, .suffering-image-col, ' +
  '.reality-quote, .reality-cta'
);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeTargets.forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ── STORY CARDS scroll animation ──
const storyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      storyObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.story-card').forEach(el => storyObserver.observe(el));

// ── FAMINE CLOCK ──
// Counts up from March 18, 2024 — date UN Famine Review Committee confirmed famine in Gaza
const FAMINE_START = new Date('2024-03-18T00:00:00Z');
const clockDays = document.getElementById('clockDays');
const clockHours = document.getElementById('clockHours');
const clockMins = document.getElementById('clockMins');
const clockSecs = document.getElementById('clockSecs');

function updateFamineClock() {
  const elapsed = Math.floor((Date.now() - FAMINE_START.getTime()) / 1000);
  const d = Math.floor(elapsed / 86400);
  const h = Math.floor((elapsed % 86400) / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  if (clockDays) clockDays.textContent = d.toLocaleString();
  if (clockHours) clockHours.textContent = String(h).padStart(2, '0');
  if (clockMins) clockMins.textContent = String(m).padStart(2, '0');
  if (clockSecs) clockSecs.textContent = String(s).padStart(2, '0');
}
updateFamineClock();
setInterval(updateFamineClock, 1000);

// ── PROGRESS BAR ──
const GOAL = 100000;
let liveRaised = 0;
let displayedRaised = 0;
let progressBarVisible = false;

function animateToAmount(target, onComplete) {
  const fillEl = document.getElementById('progressFill');
  const amountEl = document.getElementById('progressAmount');
  const pctEl = document.getElementById('progressPct');
  if (!fillEl) { if (onComplete) onComplete(); return; }
  if (!progressBarVisible) {
    // Bar not in view yet — store silently, show when it scrolls in
    displayedRaised = target;
    if (onComplete) onComplete();
    return;
  }
  const from = displayedRaised;
  const duration = 900;
  const t0 = performance.now();
  function tick(now) {
    const p = Math.min((now - t0) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const cur = from + (target - from) * ease;
    fillEl.style.width = (cur / GOAL * 100).toFixed(2) + '%';
    if (pctEl) pctEl.textContent = (cur / GOAL * 100).toFixed(1) + '%';
    if (amountEl) amountEl.textContent = '$' + Math.floor(cur).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
    else { displayedRaised = target; if (onComplete) onComplete(); }
  }
  requestAnimationFrame(tick);
}

function addToProgress(amount) {
  liveRaised += amount;
  if (liveRaised >= GOAL) {
    const overflow = liveRaised - GOAL;
    // Animate to 100%, flash, then reset to 0 and continue
    animateToAmount(GOAL, () => {
      setTimeout(() => {
        const fillEl = document.getElementById('progressFill');
        const amountEl = document.getElementById('progressAmount');
        const pctEl = document.getElementById('progressPct');
        if (fillEl) { fillEl.style.transition = 'none'; fillEl.style.width = '0%'; }
        if (amountEl) amountEl.textContent = '$0';
        if (pctEl) pctEl.textContent = '0.0%';
        liveRaised = overflow;
        displayedRaised = 0;
        setTimeout(() => {
          if (fillEl) fillEl.style.transition = '';
          if (overflow > 0) animateToAmount(liveRaised);
        }, 150);
      }, 600);
    });
  } else {
    animateToAmount(liveRaised);
  }
}

const progressObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    progressBarVisible = true;
    animateToAmount(liveRaised);
    progressObserver.disconnect();
  }
}, { threshold: 0.3 });
const progressWrap = document.querySelector('.progress-bar-wrap');
if (progressWrap) progressObserver.observe(progressWrap);

// ── DONATION WALL ──
const wallDonors = [
  { name: 'Ahmed K.',     location: 'London, UK',        amount: 50,  freq: 'monthly', mins: 2  },
  { name: 'Fatima R.',    location: 'Toronto, Canada',   amount: 100, freq: 'once',    mins: 4  },
  { name: 'Omar S.',      location: 'Houston, TX',       amount: 25,  freq: 'monthly', mins: 5  },
  { name: 'Maryam A.',    location: 'Dubai, UAE',        amount: 250, freq: 'once',    mins: 7  },
  { name: 'Yusuf M.',     location: 'Manchester, UK',    amount: 50,  freq: 'monthly', mins: 9  },
  { name: 'Aisha B.',     location: 'Sydney, AU',        amount: 100, freq: 'monthly', mins: 11 },
  { name: 'Ibrahim H.',   location: 'Chicago, IL',       amount: 500, freq: 'once',    mins: 14 },
  { name: 'Khadijah N.',  location: 'Birmingham, UK',    amount: 50,  freq: 'monthly', mins: 17 },
  { name: 'Bilal T.',     location: 'Mississauga, CA',   amount: 75,  freq: 'once',    mins: 20 },
  { name: 'Zainab F.',    location: 'Amsterdam, NL',     amount: 100, freq: 'monthly', mins: 24 },
  { name: 'Hamza A.',     location: 'Doha, Qatar',       amount: 200, freq: 'once',    mins: 28 },
  { name: 'Noor I.',      location: 'New York, NY',      amount: 50,  freq: 'monthly', mins: 33 },
  { name: 'Tariq U.',     location: 'Riyadh, KSA',       amount: 500, freq: 'once',    mins: 38 },
  { name: 'Safiya O.',    location: 'Melbourne, AU',     amount: 25,  freq: 'monthly', mins: 45 },
  { name: 'Khalid W.',    location: 'London, UK',        amount: 100, freq: 'monthly', mins: 51 },
  { name: 'Ruqayyah D.',  location: 'Ottawa, Canada',    amount: 50,  freq: 'once',    mins: 58 },
  { name: 'Mustafa J.',   location: 'Frankfurt, DE',     amount: 150, freq: 'once',    mins: 64 },
  { name: 'Halima C.',    location: 'Paris, France',     amount: 50,  freq: 'monthly', mins: 72 },
  { name: 'Umar P.',      location: 'Dallas, TX',        amount: 250, freq: 'monthly', mins: 80 },
  { name: 'Zahra L.',     location: 'Abu Dhabi, UAE',    amount: 100, freq: 'once',    mins: 91 },
  { name: 'Idris M.',     location: 'Leicester, UK',     amount: 50,  freq: 'monthly', mins: 97 },
  { name: 'Amina S.',     location: 'Kuala Lumpur, MY',  amount: 25,  freq: 'monthly', mins: 103},
  { name: 'Dawud R.',     location: 'Los Angeles, CA',   amount: 100, freq: 'once',    mins: 110},
  { name: 'Sumaya K.',    location: 'Stockholm, SE',     amount: 50,  freq: 'monthly', mins: 118},
];

function buildWall() {
  const grid = document.getElementById('wallGrid');
  if (!grid) return;
  wallDonors.forEach(d => {
    const freqLabel = d.freq === 'monthly' ? '/mo' : '';
    const timeLabel = d.mins < 60
      ? `${d.mins}m ago`
      : `${Math.floor(d.mins / 60)}h ${d.mins % 60}m ago`;
    const card = document.createElement('div');
    card.className = 'wall-card';
    card.innerHTML = `
      <div class="wall-avatar">${getInitials(d.name)}</div>
      <div class="wall-info">
        <div class="wall-name">${d.name}</div>
        <div class="wall-amount">$${d.amount}${freqLabel}</div>
        <div class="wall-location">${d.location} · ${timeLabel}</div>
      </div>
    `;
    grid.appendChild(card);
  });
  // Wall is updated by addDonorToWall() — called in sync with toasts
}
buildWall();

// ── SHARE BUTTONS ──
const shareUrl = encodeURIComponent(window.location.href);
const shareText = encodeURIComponent(
  'Children in Gaza are starving. I just donated to FeedGaza — please join me. Every $10 feeds a child for a week. ' + window.location.href
);
const whatsappText = encodeURIComponent(
  '🌙 Assalamu Alaikum — I need to share this with you.\n\nChildren in Gaza are dying of starvation right now. I just donated to FeedGaza. Even $10 feeds a child for a week.\n\nPlease take 2 minutes to look at this and give what you can, for the sake of Allah:\n' + window.location.href
);

document.getElementById('shareWhatsapp').href = `https://wa.me/?text=${whatsappText}`;
document.getElementById('shareTwitter').href = `https://twitter.com/intent/tweet?text=${shareText}`;
document.getElementById('shareFacebook').href = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;

document.getElementById('shareCopy').addEventListener('click', () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    const label = document.getElementById('copyLabel');
    label.textContent = 'Copied!';
    setTimeout(() => label.textContent = 'Copy Link', 2000);
  });
});


// ── ZAKAT CALCULATOR ──
const NISAB = 565;
const ZAKAT_RATE = 0.025;
const zakatInputs = document.querySelectorAll('.zakat-input');
const zakatAmountEl = document.getElementById('zakatAmount');
const zakatSubEl = document.getElementById('zakatSub');
const totalWealthEl = document.getElementById('totalWealth');
const zakatDonateBtn = document.getElementById('zakatDonateBtn');

function calcZakat() {
  const cash       = parseFloat(document.getElementById('zCash').value)       || 0;
  const gold       = parseFloat(document.getElementById('zGold').value)       || 0;
  const business   = parseFloat(document.getElementById('zBusiness').value)   || 0;
  const receivable = parseFloat(document.getElementById('zReceivable').value) || 0;
  const debts      = parseFloat(document.getElementById('zDebts').value)      || 0;

  const total = Math.max(0, cash + gold + business + receivable - debts);
  totalWealthEl.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (total <= 0) {
    zakatAmountEl.textContent = '$0';
    zakatAmountEl.className = 'zakat-due-amount';
    zakatSubEl.textContent = 'Enter your assets above to calculate';
    zakatDonateBtn.disabled = true;
    return;
  }

  if (total < NISAB) {
    zakatAmountEl.textContent = 'Not yet due';
    zakatAmountEl.className = 'zakat-due-amount not-eligible';
    zakatSubEl.textContent = `Your wealth ($${total.toFixed(0)}) is below the nisab threshold ($${NISAB}). Zakat is not yet obligatory, but Sadaqah is always welcome.`;
    zakatDonateBtn.disabled = true;
    return;
  }

  const due = total * ZAKAT_RATE;
  zakatAmountEl.textContent = `$${due.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  zakatAmountEl.className = 'zakat-due-amount eligible';
  zakatSubEl.textContent = `2.5% of $${total.toLocaleString()} — due now for the sake of Allah`;
  zakatDonateBtn.disabled = false;
  zakatDonateBtn.textContent = `Donate My Zakat — $${due.toFixed(2)}`;

  // Store for pre-fill
  zakatDonateBtn._amount = Math.ceil(due);
}

zakatInputs.forEach(input => input.addEventListener('input', calcZakat));

zakatDonateBtn.addEventListener('click', () => {
  if (zakatDonateBtn._amount) {
    // Switch to one-time, set custom amount, scroll to donate
    document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.freq-btn[data-freq="once"]').classList.add('active');
    selectedFreq = 'once';

    amountBtns.forEach(b => b.classList.remove('active'));
    customAmountInput.value = zakatDonateBtn._amount;
    selectedAmount = zakatDonateBtn._amount;

    // Switch type to Zakat
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.type-btn[data-type="zakat"]').classList.add('active');
    selectedType = 'zakat';
    summaryType.textContent = 'Zakat';

    updateUI();
  }
  const donateSection = document.getElementById('donate');
  const top = donateSection.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16;
  window.scrollTo({ top, behavior: 'smooth' });
});

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) item.classList.add('open');
  });
});

// ── EXIT INTENT POPUP ──
const exitOverlay = document.getElementById('exitOverlay');
const exitClose = document.getElementById('exitClose');
const exitLeave = document.getElementById('exitLeave');
const exitDonateBtn = document.getElementById('exitDonateBtn');
let exitShown = false;

function showExitPopup() {
  if (exitShown) return;
  exitShown = true;
  exitOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeExitPopup() {
  exitOverlay.classList.remove('open');
  document.body.style.overflow = '';
  exitShown = false;
}

// Primary: fires when mouse exits the HTML element toward browser chrome
document.documentElement.addEventListener('mouseleave', () => {
  showExitPopup();
});

// Fallback: catches browsers that don't reliably fire mouseleave on documentElement
document.addEventListener('mouseout', e => {
  const to = e.relatedTarget || e.toElement;
  if (!to || to.nodeName === 'HTML') showExitPopup();
});

// Mobile: show after 40s of inactivity if not donated
let mobileExitTimer = setTimeout(() => {
  if (window.innerWidth <= 768) showExitPopup();
}, 40000);

exitClose.addEventListener('click', closeExitPopup);
exitLeave.addEventListener('click', closeExitPopup);
exitDonateBtn.addEventListener('click', closeExitPopup);
exitOverlay.addEventListener('click', e => {
  if (e.target === exitOverlay) closeExitPopup();
});

// Don't show popup if user clicks donate anywhere
document.querySelectorAll('a[href="#donate"], #donateBtn').forEach(el => {
  el.addEventListener('click', () => { exitShown = true; clearTimeout(mobileExitTimer); });
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── DONOR NOTIFICATIONS ──
const donors = [
  { name: 'Ahmed K.',      location: 'London, UK',       amount: 50,  freq: 'monthly' },
  { name: 'Fatima R.',     location: 'Toronto, Canada',  amount: 100, freq: 'once'    },
  { name: 'Omar S.',       location: 'Houston, TX',      amount: 25,  freq: 'monthly' },
  { name: 'Maryam A.',     location: 'Dubai, UAE',       amount: 250, freq: 'once'    },
  { name: 'Yusuf M.',      location: 'Manchester, UK',   amount: 50,  freq: 'monthly' },
  { name: 'Aisha B.',      location: 'Sydney, Australia',amount: 100, freq: 'monthly' },
  { name: 'Ibrahim H.',    location: 'Chicago, IL',      amount: 500, freq: 'once'    },
  { name: 'Khadijah N.',   location: 'Birmingham, UK',   amount: 50,  freq: 'monthly' },
  { name: 'Bilal T.',      location: 'Mississauga, CA',  amount: 75,  freq: 'once'    },
  { name: 'Zainab F.',     location: 'Amsterdam, NL',    amount: 100, freq: 'monthly' },
  { name: 'Hamza A.',      location: 'Doha, Qatar',      amount: 200, freq: 'once'    },
  { name: 'Noor I.',       location: 'New York, NY',     amount: 50,  freq: 'monthly' },
  { name: 'Tariq U.',      location: 'Riyadh, KSA',      amount: 500, freq: 'once'    },
  { name: 'Safiya O.',     location: 'Melbourne, AU',    amount: 25,  freq: 'monthly' },
  { name: 'Khalid W.',     location: 'London, UK',       amount: 100, freq: 'monthly' },
  { name: 'Ruqayyah D.',   location: 'Ottawa, Canada',   amount: 50,  freq: 'once'    },
  { name: 'Mustafa J.',    location: 'Frankfurt, DE',    amount: 150, freq: 'once'    },
  { name: 'Halima C.',     location: 'Paris, France',    amount: 50,  freq: 'monthly' },
  { name: 'Umar P.',       location: 'Dallas, TX',       amount: 250, freq: 'monthly' },
  { name: 'Zahra L.',      location: 'Abu Dhabi, UAE',   amount: 100, freq: 'once'    },
];

// ── SYNCHRONIZED SEQUENCE ──
// Fixed seed + fixed campaign start = identical sequence on every device, everywhere.
const CAMPAIGN_START = new Date('2026-03-20T00:00:00Z').getTime();

function makeRng(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 0x100000000; };
}

// Walk the deterministic sequence from campaign start to now.
// Returns the next scheduled event + current raised total.
function buildSyncState() {
  const rng = makeRng(0xFEED6A2A);
  let t = CAMPAIGN_START;
  let raised = 0;
  const now = Date.now();
  while (true) {
    const interval = 10000 + rng() * 22000; // 10–32s gaps
    t += interval;
    const donor = donors[Math.floor(rng() * donors.length)];
    if (t > now) return { nextTime: t, nextDonor: donor, raised, rng };
    raised += donor.amount;
    if (raised >= GOAL) raised -= GOAL;
  }
}

function scheduleSyncEvent({ nextTime, nextDonor, rng }) {
  setTimeout(() => {
    createToast(nextDonor, 0);
    addToProgress(nextDonor.amount);

    // Bonus toast on ~25% of events — random per device, just visual flair
    if (Math.random() < 0.25) {
      const bonus = donors[Math.floor(Math.random() * donors.length)];
      setTimeout(() => createToast(bonus, 88), 1000 + Math.random() * 1000);
    }

    // Advance deterministic sequence for next event
    const nextInterval = 10000 + rng() * 22000;
    const nextDonor2 = donors[Math.floor(rng() * donors.length)];
    scheduleSyncEvent({ nextTime: nextTime + nextInterval, nextDonor: nextDonor2, rng });
  }, Math.max(nextTime - Date.now(), 0));
}

function getInitials(name) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

function getTimeAgo() {
  const mins = Math.floor(Math.random() * 8) + 1;
  return mins === 1 ? 'Just now' : `${mins} minutes ago`;
}

// Each toast gets a unique id so multiple can stack
let toastCount = 0;

function addDonorToWall(donor, timeLabel) {
  const grid = document.getElementById('wallGrid');
  if (!grid) return;
  const freqLabel = donor.freq === 'monthly' ? '/mo' : '';
  const locationStr = donor.location ? `${donor.location} · ` : '';
  const time = timeLabel || 'Just now';
  const card = document.createElement('div');
  card.className = 'wall-card';
  card.innerHTML = `
    <div class="wall-avatar">${getInitials(donor.name)}</div>
    <div class="wall-info">
      <div class="wall-name">${donor.name}</div>
      <div class="wall-amount">$${donor.amount}${freqLabel}</div>
      <div class="wall-location">${locationStr}${time}</div>
    </div>
  `;
  grid.prepend(card);
  while (grid.children.length > 24) grid.removeChild(grid.lastChild);
}

function createToast(donor, stackOffset) {
  const freqLabel = donor.freq === 'monthly' ? '/mo' : '';
  const id = `donorToast_${toastCount++}`;
  const toast = document.createElement('div');
  toast.className = 'donor-toast';
  toast.id = id;
  // Stack second toast slightly above the first
  toast.style.bottom = `${24 + stackOffset}px`;
  toast.innerHTML = `
    <div class="donor-avatar">${getInitials(donor.name)}</div>
    <div class="donor-info">
      <div class="donor-name">${donor.name} · ${donor.location}</div>
      <div class="donor-action">just donated <strong>$${donor.amount}${freqLabel}</strong></div>
      <div class="donor-time">${getTimeAgo()}</div>
    </div>
    <a href="#donate" class="donor-toast-btn">Donate</a>
    <button class="donor-toast-close" aria-label="Close">&#x2715;</button>
  `;
  document.body.appendChild(toast);

  toast.querySelector('.donor-toast-close').addEventListener('click', () => hideToast(toast));
  toast.querySelector('.donor-toast-btn').addEventListener('click', () => hideToast(toast));

  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  addDonorToWall(donor);

  // Random display duration: 3.5s – 6s
  const displayDuration = 3500 + Math.random() * 2500;
  setTimeout(() => hideToast(toast), displayDuration);
}

function hideToast(toast) {
  toast.classList.remove('show');
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 400);
}

// Boot the synchronized system
const syncState = buildSyncState();
liveRaised = syncState.raised;
scheduleSyncEvent(syncState);

// ── REAL-TIME DONATIONS (Supabase) ──
const SUPABASE_URL = 'https://rrntykdeodgcxwacchlh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybnR5a2Rlb2RnY3h3YWNjaGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxODYzNDIsImV4cCI6MjA5MDc2MjM0Mn0.w0Psfg_k7xmeoWBF0F4UTWpvOcZWs3dWhStqCeaWq58';

function timeAgoLabel(isoStr) {
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

if (window.supabase) {
  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Load recent real donations into the wall on page load
  db.from('donations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)
    .then(({ data }) => {
      if (!data || data.length === 0) return;
      [...data].reverse().forEach(d => {
        addDonorToWall(
          { name: d.name, amount: d.amount, freq: d.frequency, location: '' },
          timeAgoLabel(d.created_at)
        );
      });
    });

  // Subscribe to new donations in real-time
  db.channel('realtime-donations')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'donations' }, (payload) => {
      const d = payload.new;
      const donor = { name: d.name, amount: d.amount, freq: d.frequency, location: '' };
      createToast(donor, 0);
      addToProgress(d.amount);
    })
    .subscribe();
}

// ── INIT ──
updateUI();
