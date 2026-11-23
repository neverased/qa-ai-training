'use strict';

(() => {
  const engine = window.ColourHub;
  const $ = id => document.getElementById(id);
  const money = cents => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
  const copyLines = lines => lines.map(({sku, pack, qty, tint}) => ({sku, pack, qty, tint: tint || ''}));
  const productOf = sku => engine.products.find(item => item.sku === sku);
  const colours = { 'EC-220':'#7a9a88', 'IN-310':'#cbac89', 'XP-100':'#a8634c', 'XP-140':'#728fa1' };
  const storageKey = 'colourhub-trade-desk-v1';
  const blank = () => ({lines: [], drafts: [], editing: null, nextDraft: 1});
  let saved = {};
  let storageAvailable = true;
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; }
  catch { storageAvailable = false; }
  let build = engine.builds.includes(saved.build) ? saved.build : engine.builds[0];
  let role = 'Buyer';
  let selected = engine.products[0];
  let work = loadBuild();
  let receipt = null;

  function loadBuild() {
    const existing = saved[build];
    if (!existing || !Array.isArray(existing.drafts) || !Array.isArray(existing.lines)) return blank();
    try {
      engine.quote(build, existing.lines);
      const drafts = existing.drafts.filter(draft => {
        try { return Number.isInteger(draft.id) && draft.id > 0 && engine.quote(build, draft.lines).lines.length > 0; }
        catch { return false; }
      });
      return { lines: copyLines(existing.lines), drafts, editing: drafts.some(d => d.id === existing.editing) ? existing.editing : null,
        nextDraft: Math.max(1, ...drafts.map(d => d.id + 1), Number(existing.nextDraft) || 1) };
    } catch { return blank(); }
  }
  function persist() {
    saved.build = build;
    saved[build] = work;
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); }
    catch { storageAvailable = false; }
  }
  function announce(text, error = false) {
    $('notice').hidden = !text;
    $('notice').textContent = text;
    $('notice').classList.toggle('error', error);
  }
  function orderError(text) {
    $('checkout-error').hidden = !text;
    $('checkout-error').textContent = text;
  }
  function newCart() {
    work.lines = [];
    work.editing = null;
    persist();
    renderCart();
  }
  function renderProducts() {
    $('products').innerHTML = engine.products.map(p =>
      '<button class="product" type="button" data-product="' + escape(p.sku) + '" aria-pressed="' + (p.sku === selected.sku) + '">' +
      '<span aria-hidden="true" class="swatch" style="--swatch:' + colours[p.sku] + '"></span><span><strong class="product-name">' + escape(p.name) +
      '</strong><span class="product-sku">' + escape(p.sku) + '</span></span><span class="choice" aria-hidden="true"></span></button>').join('');
    $('product-title').textContent = selected.name;
    $('product-sku').textContent = selected.sku;
    $('pack').innerHTML = Object.keys(selected.prices).map(size => '<option value="' + size + '">' + size + ' L</option>').join('');
    $('pack').value = Object.hasOwn(selected.prices, '5') ? '5' : Object.keys(selected.prices)[0];
    $('product-hint').textContent = selected.hazardous ? 'Solvent-based product. Standard delivery and safety data sheet confirmation required.' : 'Custom tint is available for 1 L and 5 L packs.';
    showUnit();
  }
  function showUnit() {
    $('unit-price').textContent = money(selected.prices[$('pack').value]);
  }
  function setControls() {
    const readOnly = role !== 'Buyer';
    for (const id of ['quantity','pack','tint','add-button','reset','save','submit-order']) $(id).disabled = readOnly;
    $('submit-order').textContent = readOnly ? 'Buyer role required to submit' : 'Submit order';
  }
  function priceText(line) {
    return '<span>' + line.discountPercent + '% volume discount</span><b>' + money(line.netCents) + '</b>';
  }
  function totals(totals) {
    $('cart-subtotal').textContent = money(totals.grossCents);
    $('cart-discount').textContent = '−' + money(totals.discountCents);
    $('cart-total').textContent = money(totals.netCents);
  }
  function renderCart() {
    const quote = engine.quote(build, work.lines);
    const readonly = role !== 'Buyer' ? ' disabled' : '';
    $('line-count').textContent = work.lines.length + (work.lines.length === 1 ? ' line' : ' lines');
    $('draft-count').textContent = work.drafts.length;
    $('draft-context').hidden = !work.editing;
    $('draft-context').textContent = work.editing ? 'Editing saved draft ' + work.editing : '';
    $('cart-bottom').hidden = !work.lines.length;
    if (!work.lines.length) {
      $('cart-lines').innerHTML = '<p class="empty">Your cart is empty. Choose a product and pack size to add your first line.</p>';
      return;
    }
    $('cart-lines').innerHTML = quote.lines.map((line, index) => {
      const product = productOf(line.sku);
      return '<div class="cart-line" data-line="' + index + '">' +
        '<div class="cart-line-head"><div><strong>' + escape(product.name) + '</strong><small>' + escape(product.sku) + ' · ' + line.pack +
        ' L · ' + money(line.unitCents) + ' per pack</small></div><button type="button" class="text-button" data-remove="' + index + '" aria-label="Remove line ' + (index+1) + '"' + readonly + '>Remove</button></div>' +
        '<form class="line-fields"><div class="field"><label for="line-qty-' + index + '">Quantity</label><input type="number" required min="1" max="500" step="1" id="line-qty-' + index +
        '" value="' + line.qty + '"' + readonly + '></div><div class="field"><label for="line-tint-' + index + '">Tint code</label><input type="text" maxlength="16" id="line-tint-' + index +
        '" placeholder="Optional" value="' + escape(line.tint) + '"' + readonly + '></div><button class="secondary" type="submit"' + readonly + '>Update</button></form>' +
        '<div class="line-money">' + priceText(line) + '</div></div>';
    }).join('');
    totals(quote);
  }
  function captureLines() {
    const lines = work.lines.map((line, i) => ({...line, qty: Number($('line-qty-' + i).value), tint: $('line-tint-' + i).value.trim()}));
    const quote = engine.quote(build, lines);
    work.lines = lines;
    persist();
    quote.lines.forEach((line, index) => {
      const node = document.querySelector('[data-line="' + index + '"] .line-money');
      if (node) node.innerHTML = priceText(line);
    });
    totals(quote);
    return quote;
  }
  function showDrafts() {
    $('draft-intro').textContent = 'Drafts saved on this device for build ' + build + '.';
    $('saved-drafts').innerHTML = work.drafts.length ? work.drafts.map(draft =>
      '<div class="saved-row"><div><strong>Draft ' + draft.id + '</strong><small>' + draft.lines.length + (draft.lines.length === 1 ? ' line' : ' lines') + ' · ' +
      money(engine.quote(build, draft.lines).netCents) + '</small></div><button type="button" class="secondary" data-open-draft="' + draft.id + '">Open draft</button></div>').join('')
      : '<p class="empty">There are no saved drafts for this build.</p>';
    $('drafts-dialog').showModal();
  }
  function summaryRows(quote) {
    const heading = '<div class="summary-rows">';
    const rows = quote.lines.map(line => '<div class="summary-row"><div><strong>' + escape(productOf(line.sku).name) + '</strong><small>' +
      line.qty + ' × ' + line.pack + ' L · ' + money(line.unitCents) + ' per pack · ' + line.discountPercent + '% discount' +
      (line.tint ? ' · Tint ' + escape(line.tint) : '') + '</small></div><b>' + money(line.netCents) + '</b></div>');
    return heading + rows.join('') + '</div><dl class="totals"><div><dt>Line subtotal</dt><dd>' + money(quote.grossCents) +
      '</dd></div><div><dt>Volume discount</dt><dd>−' + money(quote.discountCents) +
      '</dd></div><div class="grand-total"><dt>Order net total</dt><dd>' + money(quote.netCents) + '</dd></div></dl>';
  }
  function showSummary() {
    const quote = captureLines();
    const dates = engine.deliveryWindow();
    receipt = null;
    $('review-title').textContent = 'Order summary';
    $('review-kicker').textContent = 'Checkout · Build ' + build;
    $('summary-content').innerHTML = summaryRows(quote);
    $('checkout-form').hidden = false;
    $('receipt-actions').hidden = true;
    $('sds-wrap').hidden = !work.lines.some(line => productOf(line.sku).hazardous);
    $('delivery').value = 'Standard';
    $('sds').checked = false;
    $('delivery-date').min = dates.earliest;
    $('delivery-date').max = dates.latest;
    $('delivery-date').value = dates.earliest;
    $('date-hint').textContent = 'Order date: 24 November 2026, 10:00 Warsaw time. Select delivery from 26 November to 24 December.';
    orderError('');
    $('review-dialog').showModal();
  }
  function placeOrder() {
    const draft = work.drafts.find(item => item.id === work.editing);
    const delivery = $('delivery').value;
    const deliveryDate = $('delivery-date').value;
    const result = engine.submit(build, work.lines, {role, delivery, deliveryDate, sds: $('sds').checked, savedLines: draft?.lines});
    const random = typeof crypto.randomUUID === 'function' ? crypto.randomUUID().slice(0,8) : String(Date.now()).slice(-8);
    receipt = {id: 'CH-' + random.toUpperCase(), build, delivery, deliveryDate, ...result};
    if (draft) work.drafts = work.drafts.filter(item => item.id !== draft.id);
    newCart();
    $('checkout-form').hidden = true;
    $('receipt-actions').hidden = false;
    $('download').hidden = result.status !== 'Confirmed';
    $('review-kicker').textContent = receipt.id + ' · Build ' + receipt.build;
    $('review-title').textContent = 'Order received';
    $('summary-content').innerHTML = '<p class="status' + (result.status === 'Confirmed' ? '' : ' awaiting') + '">' + escape(result.status) + '</p>' +
      summaryRows(result.quote) + '<p class="helper">' + escape(delivery) + ' delivery · ' + escape(deliveryDate) + '</p>';
    announce('Order ' + receipt.id + ' submitted. ' + receipt.status + '.');
  }
  $('build').innerHTML = engine.builds.map(version => '<option>' + version + '</option>').join('');
  $('build').value = build;
  $('products').addEventListener('click', event => {
    const button = event.target.closest('[data-product]');
    if (!button) return;
    selected = productOf(button.dataset.product);
    renderProducts();
    $('quantity').value = 1;
    $('tint').value = '';
    $('pack').focus();
  });
  $('pack').addEventListener('change', showUnit);
  $('add-form').addEventListener('submit', event => {
    event.preventDefault();
    if (role !== 'Buyer') return;
    try {
      if (work.lines.length) captureLines();
      const line = {sku: selected.sku, pack: Number($('pack').value), qty: Number($('quantity').value), tint: $('tint').value.trim()};
      const lines = copyLines(work.lines);
      const match = lines.find(item => item.sku === line.sku && item.pack === line.pack && item.tint === line.tint);
      if (match) match.qty += line.qty;
      else lines.push(line);
      engine.quote(build, lines);
      work.lines = lines;
      persist();
      renderCart();
      announce(selected.name + ' added to your cart.');
    } catch (error) { announce(error.message, true); }
  });
  $('cart-lines').addEventListener('input', () => {
    if (role !== 'Buyer') return;
    try { captureLines(); announce(''); }
    catch { /* A quantity or tint may be incomplete while the person types. */ }
  });
  $('cart-lines').addEventListener('submit', event => {
    event.preventDefault();
    if (role !== 'Buyer') return;
    try { captureLines(); announce('Cart updated.'); }
    catch (error) { announce(error.message,true); }
  });
  $('cart-lines').addEventListener('click', event => {
    const remove = event.target.closest('[data-remove]');
    if (!remove || role !== 'Buyer') return;
    work.lines.splice(Number(remove.dataset.remove), 1);
    persist(); renderCart(); announce('Line removed.');
  });
  $('build').addEventListener('change', () => {
    build = $('build').value; work = loadBuild(); persist(); renderCart(); announce('Build ' + build + ' selected.');
  });
  $('role').addEventListener('change', () => {
    role = $('role').value; setControls(); renderCart(); announce(role === 'Viewer' ? 'Viewer access. You can inspect the order.' : 'Buyer access selected.');
  });
  $('reset').addEventListener('click', () => {
    if (role !== 'Buyer') return;
    newCart(); $('quantity').value = 1; $('tint').value = ''; announce('Cart reset. Saved drafts remain available.');
  });
  $('save').addEventListener('click', () => {
    if (role !== 'Buyer') return;
    try {
      captureLines();
      let draft = work.drafts.find(item => item.id === work.editing);
      if (!draft) { draft = {id: work.nextDraft++, lines: []}; work.drafts.push(draft); }
      draft.lines = copyLines(work.lines);
      newCart();
      announce('Draft ' + draft.id + ' saved' + (storageAvailable ? ' on this device.' : ' for this open page only.') + ' Open Saved drafts to continue editing.');
      showDrafts();
    } catch (error) { announce(error.message,true); }
  });
  $('show-drafts').addEventListener('click', showDrafts);
  $('saved-drafts').addEventListener('click', event => {
    const button = event.target.closest('[data-open-draft]');
    if (!button) return;
    const draft = work.drafts.find(item => item.id === Number(button.dataset.openDraft));
    if (!draft) return;
    if (work.lines.length && !window.confirm('Replace the current cart with this saved draft?')) return;
    work.editing = draft.id; work.lines = copyLines(draft.lines); persist();
    renderCart(); $('drafts-dialog').close(); announce('Opened draft ' + draft.id + '.');
  });
  $('review').addEventListener('click', () => {
    try { showSummary(); } catch (error) { announce(error.message,true); }
  });
  $('checkout-form').addEventListener('submit', event => {
    event.preventDefault();
    if (receipt) return;
    try { placeOrder(); }
    catch (error) { orderError(error.message); }
  });
  $('download').addEventListener('click', () => { if (receipt?.status === 'Confirmed') window.downloadColourHubConfirmation(receipt); });
  $('new-order').addEventListener('click', () => { $('review-dialog').close(); $('quantity').value = 1; $('tint').value = ''; announce('New order ready.'); });
  document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => btn.closest('dialog').close()));
  renderProducts(); setControls(); renderCart();
})();
