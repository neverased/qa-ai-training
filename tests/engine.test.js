'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const shop = require('../shop/engine.js');

const coat = (qty, pack = 5, tint = '') => ({ sku: 'EC-220', pack, qty, tint });
const buyer = { role: 'Buyer', delivery: 'Standard', sds: false };

test('quotes exterior coat with the pack price from the catalogue', () => {
  const order = shop.quote('3.2.1', [coat(2)]);
  assert.equal(order.grossCents, 8000);
  assert.equal(order.netCents, 8000);
  assert.equal(order.discountCents, 0);
  assert.equal(order.lines[0].unitCents, 4000);
});

test('the 200-pack defect is present only in training build 3.2.0', () => {
  for (const [build, middle] of [['3.2.0', 760000], ['3.2.1', 720000], ['3.3.0', 720000]]) {
    const totals = [199, 200, 201].map(qty => shop.quote(build, [coat(qty)]).netCents);
    assert.deepEqual(totals, [756200, middle, 723600], build);
  }
});

test('catalogue quantities, tint and pack options affect each line independently', () => {
  const amounts = [49, 50, 51].map(qty => shop.quote('3.2.1', [coat(qty)]).lines[0].discountPercent);
  assert.deepEqual(amounts, [0, 5, 5]);
  const mixed = shop.quote('3.2.1', [coat(30, 5), coat(25, 1)]);
  assert.deepEqual(mixed.lines.map(line => line.discountPercent), [0, 0]);
  assert.equal(mixed.netCents, 142500);
  assert.throws(() => shop.quote('3.2.1', [coat(1, 20, 'CH-1180-02')]), /tint/i);
});

test('invalid line data gives a useful error before any price or approval is shown', () => {
  for (const [line, pattern] of [
    [coat(0), /quantity/i], [coat(501), /quantity/i], [coat(1.5), /quantity/i],
    [coat(2, 3), /pack/i], [{ sku: 'XP-100', pack: 1, qty: 1 }, /pack/i],
    [{sku:'UNKNOWN', pack: 5, qty: 1}, /product/i], [coat(1,5,'CH-12345-6'), /code/i],
  ]) assert.throws(() => shop.quote('3.2.1', [line]), pattern);
  assert.throws(() => shop.quote('3.2.1', Array.from({ length: 21 }, () => coat(1))), /20/);
  assert.throws(() => shop.quote('4.0.0', [coat(1)]), /build/i);
  assert.equal(shop.quote('3.2.1', [coat(500,5,'CH-1234-56')]).netCents, 1800000);
});

test('a buyer confirms orders up to EUR 5,000 net and requests approval above it', () => {
  // The two lines are below the volume-discount threshold and total exactly EUR 5,000.
  const exact = [coat(32,20),coat(5)];
  assert.equal(shop.submit('3.2.1', exact, buyer).status, 'Confirmed');
  assert.equal(shop.submit('3.2.1', [...exact, coat(1,1)], buyer).status, 'Awaiting approval');
  const discounted = shop.submit('3.2.1', [coat(130)], buyer);
  assert.equal(discounted.quote.netCents, 494000);
  assert.equal(discounted.status, 'Confirmed');
});

test('only buyers can submit a populated cart', () => {
  for (const role of ['Viewer','Approver',undefined]) {
    assert.throws(() => shop.submit('3.2.1', [coat(1)], {...buyer, role}), /buyer/i);
  }
  assert.throws(() => shop.submit('3.2.1', [], buyer), /line/i);
  assert.equal(shop.quote('3.2.1', []).netCents, 0);
});

test('hazardous orders require standard delivery and a safety data sheet acknowledgement', () => {
  const mixed = [coat(2), { sku: 'XP-100', pack: 20, qty: 15 }];
  assert.throws(() => shop.submit('3.2.1', mixed, { ...buyer, delivery: 'Express', sds: true }), /express/i);
  assert.throws(() => shop.submit('3.2.1', mixed, buyer), /safety data sheet/i);
  assert.equal(shop.submit('3.2.1', mixed, { ...buyer, sds: true }).status, 'Confirmed');
  assert.equal(shop.submit('3.2.1', [coat(1)], { ...buyer, delivery: 'Express' }).status, 'Confirmed');
  assert.throws(() => shop.submit('3.2.1', [coat(1)], { ...buyer, delivery: 'Unknown' }), /delivery/i);
});

test('the tinted-order rule depends on build and the 3.3.0 draft-edit defect is reproducible', () => {
  const original = [coat(20,1),coat(3,5)];
  const tinted = [coat(20,1,'CH-1180-02'), coat(3,5)];
  for (const build of ['3.2.0','3.2.1']) {
    assert.equal(shop.submit(build, tinted, buyer).status, 'Confirmed');
  }
  assert.equal(shop.submit('3.3.0', original, buyer).status, 'Confirmed');
  assert.equal(shop.submit('3.3.0', tinted, buyer).quote.netCents, 30000);
  assert.equal(shop.submit('3.3.0', tinted, buyer).status, 'Awaiting approval');
  assert.equal(shop.submit('3.3.0', tinted, {...buyer, savedLines: original}).status, 'Confirmed');
  assert.equal(shop.submit('3.3.0', tinted, {...buyer, savedLines: tinted}).status, 'Awaiting approval');
  assert.equal(shop.submit('3.3.0', [coat(201, 5, 'CH-1180-02')], {...buyer, savedLines: original}).status, 'Awaiting approval');
});

test('the workshop clock gives an inclusive delivery window across the month boundary', () => {
  assert.deepEqual(shop.deliveryWindow(), { earliest: '2026-11-26', latest: '2026-12-24' });
  for (const deliveryDate of ['2026-11-26', '2026-12-24']) {
    assert.equal(shop.submit('3.2.1', [coat(1)], { ...buyer, deliveryDate }).status, 'Confirmed');
  }
  for (const deliveryDate of ['2026-11-25', '2026-12-25', '2026-11-31', 'not a date']) {
    assert.throws(() => shop.submit('3.2.1', [coat(1)], { ...buyer, deliveryDate }), /delivery date/i);
  }
});
