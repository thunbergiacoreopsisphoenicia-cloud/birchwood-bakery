(() => {
  'use strict';

  const RELEASE = '1.1.1';
  const MENU = window.BIRCHWOOD_MENU;
  const SLOTS = window.BIRCHWOOD_SLOTS;
  const MAX_EACH = 12;
  const BUNDLE_MIN = 3;
  const BUNDLE_OFF = 0.1;

  const $ = (sel, root = document) => root.querySelector(sel);
  const money = (cents) => '$' + (cents / 100).toFixed(2);
  const pad3 = (n) => String(n).padStart(3, '0');

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage is optional */ }
    },
  };

  const state = {
    cart: store.get('bb.cart', {}),
    slot: store.get('bb.slot', null),
    name: store.get('bb.name', ''),
    next: store.get('bb.next', 47),
    printed: null,
  };

  // Drop anything that is no longer on the menu or no longer in stock.
  Object.keys(state.cart).forEach((id) => {
    const item = MENU.find((m) => m.id === id);
    if (!item || item.left === 0 || !(state.cart[id] > 0)) delete state.cart[id];
    else state.cart[id] = Math.min(state.cart[id], item.left, MAX_EACH);
  });
  if (!SLOTS.includes(state.slot)) state.slot = null;

  const limit = (item) => Math.min(item.left, MAX_EACH);
  const qtyOf = (id) => state.cart[id] || 0;

  function setQty(id, qty) {
    const item = MENU.find((m) => m.id === id);
    const next = Math.max(0, Math.min(qty, limit(item)));
    if (next === 0) delete state.cart[id]; else state.cart[id] = next;
    store.set('bb.cart', state.cart);
    render();
  }

  function lines() {
    return MENU.filter((m) => qtyOf(m.id) > 0).map((item) => {
      const qty = qtyOf(item.id);
      const gross = item.price * qty;
      const bundle = qty >= BUNDLE_MIN;
      return { id: item.id, name: item.name, qty, bundle, total: bundle ? Math.round(gross * (1 - BUNDLE_OFF)) : gross };
    });
  }

  // Price from the menu, so a stale cart can never change what we charge.
  const priceOf = (id) => MENU.find((m) => m.id === id).price;
  const orderTotal = (ls) => ls.reduce((sum, l) => sum + l.total, 0);

  /* Board */
  const board = $('#board');
  const rowEls = new Map();

  function buildBoard() {
    const cats = [...new Set(MENU.map((m) => m.cat))];
    board.innerHTML = cats.map((cat) => `
      <section class="cat" aria-labelledby="cat-${cat}">
        <h2 class="cat-head" id="cat-${cat}"><span>${cat}</span></h2>
        <ul class="bakes">
          ${MENU.filter((m) => m.cat === cat).map(rowHtml).join('')}
        </ul>
      </section>`).join('');

    MENU.forEach((item) => {
      const el = board.querySelector(`[data-id="${item.id}"]`);
      rowEls.set(item.id, el);
      el.querySelector('.add').addEventListener('click', () => setQty(item.id, 1));
      el.querySelector('[data-dec]').addEventListener('click', () => setQty(item.id, qtyOf(item.id) - 1));
      el.querySelector('[data-inc]').addEventListener('click', () => setQty(item.id, qtyOf(item.id) + 1));
    });
  }

  function rowHtml(item) {
    return `
      <li class="bake" data-id="${item.id}">
        <div class="bake-info">
          <h3>${item.name}</h3>
          <p class="bake-desc">${item.desc}</p>
        </div>
        <p class="bake-meta"><span>${item.weight}, out at ${item.out}</span><b data-stock></b></p>
        <p class="bake-price">${money(item.price)}</p>
        <div class="ctl">
          <button class="add" type="button" aria-label="Add ${item.name} to your slip">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 2v14M2 9h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/></svg>
          </button>
          <div class="step" role="group" aria-label="${item.name} quantity" hidden>
            <button type="button" data-dec aria-label="Remove one ${item.name}"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 7h10" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/></svg></button>
            <output aria-live="polite"></output>
            <button type="button" data-inc aria-label="Add one more ${item.name}"><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/></svg></button>
          </div>
        </div>
      </li>`;
  }

  function renderBoard() {
    MENU.forEach((item) => {
      const el = rowEls.get(item.id);
      const qty = qtyOf(item.id);
      const out = item.left === 0;
      el.classList.toggle('is-out', out);
      const add = el.querySelector('.add');
      const step = el.querySelector('.step');
      add.hidden = qty > 0;
      add.disabled = out;
      if (out) add.setAttribute('aria-label', item.name + ' is sold out');
      step.hidden = qty === 0;
      step.querySelector('output').textContent = qty;
      step.querySelector('[data-inc]').disabled = qty >= limit(item);
      el.querySelector('[data-stock]').textContent = out ? 'Sold out' : item.left <= 5 ? item.left + ' left' : '';
    });
  }

  /* Slip */
  const linesEl = $('#lines');
  const lineEls = new Map();

  function renderSlip() {
    const ls = state.printed ? state.printed.lines : lines();
    const total = state.printed ? state.printed.total : orderTotal(ls);
    const printed = !!state.printed;

    $('#slip-no').textContent = 'No. ' + pad3(printed ? state.printed.no : state.next);
    $('#slip-empty').hidden = ls.length > 0;
    $('#total-row').hidden = ls.length === 0;
    $('#total').textContent = money(total);
    $('#slip-form').hidden = printed;
    $('#done').hidden = !printed;

    const seen = new Set();
    ls.forEach((l) => {
      seen.add(l.id);
      let li = lineEls.get(l.id);
      if (!li) {
        li = document.createElement('li');
        li.className = 'line' + (printed ? '' : ' is-new');
        li.innerHTML = '<span class="q"></span><span class="n"></span><span class="p"></span>';
        lineEls.set(l.id, li);
      }
      li.querySelector('.q').textContent = l.qty + '×';
      const n = li.querySelector('.n');
      n.textContent = l.name;
      if (l.bundle) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = '3+ offer';
        n.appendChild(tag);
      }
      li.querySelector('.p').textContent = money(l.total);
      linesEl.appendChild(li);
    });
    lineEls.forEach((li, id) => { if (!seen.has(id)) { li.remove(); lineEls.delete(id); } });

    const empty = ls.length === 0;
    $('#print').disabled = empty;

    const count = ls.reduce((n, l) => n + l.qty, 0);
    $('#slipbar-count').textContent = empty ? 'Your slip is empty' : count + (count === 1 ? ' item' : ' items') + ' on your slip';
    $('#slipbar-total').textContent = empty ? 'View slip' : money(total);
  }

  function renderSlots() {
    const grid = $('#slot-grid');
    grid.innerHTML = SLOTS.map((s) => `
      <label class="chip"><input type="radio" name="slot" value="${s}"${state.slot === s ? ' checked' : ''}><span>${s}</span></label>`).join('');
    grid.addEventListener('change', (e) => {
      state.slot = e.target.value;
      store.set('bb.slot', state.slot);
      $('#slot-err').hidden = true;
    });
  }

  function render() {
    renderBoard();
    renderSlip();
  }

  function today() {
    const d = new Date();
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
    return day + ' ' + d.getDate() + ' ' + mon;
  }

  $('#slip-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const ls = lines();
    if (ls.length === 0) return;
    if (!state.slot) {
      $('#slot-err').hidden = false;
      const first = $('#slot-grid input');
      if (first) first.focus();
      return;
    }
    const name = ($('#name').value || '').trim() || 'Guest';
    state.name = name;
    store.set('bb.name', name);
    state.printed = { no: state.next, lines: ls, total: orderTotal(ls), slot: state.slot, name };
    $('#done-text').textContent = 'Ready for ' + name + ' at ' + state.slot + '. Show this slip at the counter on Alder Lane.';
    state.next += 1;
    store.set('bb.next', state.next);
    state.cart = {};
    store.set('bb.cart', state.cart);
    lineEls.forEach((li) => li.remove());
    lineEls.clear();
    render();
    $('#done').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  $('#again').addEventListener('click', () => {
    state.printed = null;
    lineEls.forEach((li) => li.remove());
    lineEls.clear();
    render();
  });

  $('#name').value = state.name;
  $('#slip-date').textContent = today();
  $('#release').textContent = RELEASE;
  $('#slip-release').textContent = RELEASE;
  buildBoard();
  renderSlots();
  render();
})();
