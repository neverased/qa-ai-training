'use strict';

(() => {
  const builds = Object.freeze(['3.2.0', '3.2.1', '3.3.0']);
  const products = [
    { sku: 'EC-220', name: 'Exterior coat', prices: { 1: 900, 5: 4000, 20: 15000 }, hazardous: false },
    { sku: 'XP-100', name: 'Solvent primer', prices: { 5: 2800, 20: 9600 }, hazardous: true },
    { sku: 'XP-140', name: 'Solvent varnish', prices: { 1: 1400, 5: 6200 }, hazardous: true },
    { sku: 'IN-310', name: 'Interior matt', prices: { 1: 700, 5: 3100, 20: 11500 }, hazardous: false },
  ];

  function rateFor(build, qty) {
    // The workshop uses historic builds so participants can reproduce the defect before retesting.
    if (qty === 200 && build === '3.2.0') return 5;
    if (qty >= 200) return 10;
    if (qty >= 50) return 5;
    return 0;
  }

  function quote(build, lines) {
    if (!builds.includes(build)) throw new Error('Select a supported workshop build.');
    if (!Array.isArray(lines) || lines.length > 20) throw new Error('An order can have at most 20 lines.');
    const pricedLines = lines.map(({ sku, pack, qty, tint = '' }) => {
      const product = products.find(item => item.sku === sku);
      if (!product) throw new Error('Select a product from the catalogue.');
      if (!Number.isInteger(qty) || qty < 1 || qty > 500) {
        throw new Error('Quantity must be a whole number of packs from 1 to 500.');
      }
      if (!Number.isInteger(pack) || !Object.hasOwn(product.prices, pack)) {
        throw new Error('Select a pack size available for this product.');
      }
      if (typeof tint !== 'string' || (tint && !/^CH-[0-9]{4}-[0-9]{2}$/.test(tint))) {
        throw new Error('Use a colour code in the format CH-1234-56.');
      }
      if (tint && pack === 20) throw new Error('Custom tint is available in 1 L and 5 L only.');
      const unitCents = product.prices[pack];
      const grossCents = unitCents * qty;
      const discountPercent = rateFor(build, qty);
      const netCents = Math.round(grossCents * (100 - discountPercent) / 100);
      return { sku, pack, qty, tint, unitCents, grossCents, discountPercent, netCents };
    });
    const grossCents = pricedLines.reduce((total, line) => total + line.grossCents, 0);
    const netCents = pricedLines.reduce((total, line) => total + line.netCents, 0);
    return { lines: pricedLines, grossCents, discountCents: grossCents - netCents, netCents };
  }

  function deliveryWindow() {
    // The simulator fixes submission at Tuesday 24 November 2026, 10:00 in Warsaw.
    // Two working days later is Thursday 26 November; 30 calendar days later is 24 December.
    return { earliest: '2026-11-26', latest: '2026-12-24' };
  }

  function validateDeliveryDate(date) {
    const { earliest, latest } = deliveryWindow();
    const parsed = new Date(date + 'T00:00:00Z');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date ||
        date < earliest || date > latest) {
      throw new Error('Select a delivery date from ' + earliest + ' to ' + latest + '.');
    }
  }

  function submit(build, lines, options = {}) {
    const totals = quote(build, lines);
    if (options.role !== 'Buyer') throw new Error('Only a Buyer can submit an order.');
    if (!totals.lines.length) throw new Error('Add at least one order line before submitting.');
    validateDeliveryDate(options.deliveryDate ?? deliveryWindow().earliest);
    const delivery = options.delivery ?? 'Standard';
    if (!['Standard', 'Express'].includes(delivery)) throw new Error('Select Standard or Express delivery.');
    const hasHazardousLine = totals.lines.some(line => products.find(product => product.sku === line.sku).hazardous);
    if (hasHazardousLine && delivery === 'Express') throw new Error('Express delivery is unavailable for hazardous products.');
    if (hasHazardousLine && options.sds !== true) throw new Error('Confirm the safety data sheet before submitting.');
    const hasTint = totals.lines.some(line => line.tint);
    // Historical build 3.3.0 misses tint introduced after an untinted draft was saved.
    const savedWithoutTint = Array.isArray(options.savedLines) && options.savedLines.every(line => !line.tint);
    const tintRequiresApproval = build === '3.3.0' && hasTint && !savedWithoutTint;
    const requiresApproval = totals.netCents > 500000 || tintRequiresApproval;
    return { quote: totals, status: requiresApproval ? 'Awaiting approval' : 'Confirmed' };
  }

  const engine = { builds, products, quote, submit, deliveryWindow };
  if (typeof module !== 'undefined' && module.exports) module.exports = engine;
  else globalThis.ColourHub = engine;
})();
