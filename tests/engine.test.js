const assert = require('assert');
const E = require('../engine.js');
let n = 0;
function t(name, fn) { fn(); n++; console.log('ok', name); }

t('single 0% debt, minimum only', () => {
  const r = E.simulate([{ id: 'a', balance: 1000, apr: 0, min: 100 }], 0, 'snowball');
  assert.strictEqual(r.months, 10); assert.strictEqual(r.totalInterest, 0); assert.strictEqual(r.totalPaid, 1000); assert.strictEqual(r.never, false);
});
t('extra shortens payoff', () => {
  const r = E.simulate([{ id: 'a', balance: 1000, apr: 0, min: 100 }], 100, 'snowball');
  assert.strictEqual(r.months, 5);
});
t('known loan: 10000 @12% pay 500/mo = 23 months, interest 1213.48 (closed form checked)', () => {
  const r = E.simulate([{ id: 'a', balance: 10000, apr: 12, min: 500 }], 0, 'snowball');
  assert.strictEqual(r.months, 23);
  assert(Math.abs(r.totalInterest - 1213.48) < 0.5, 'interest ' + r.totalInterest);
  assert(Math.abs(r.totalPaid - (10000 + r.totalInterest)) < 0.05);
});
t('never pays off when payment below interest', () => {
  const r = E.simulate([{ id: 'a', balance: 10000, apr: 36, min: 100 }], 0, 'snowball');
  assert.strictEqual(r.never, true);
});
t('zero budget is never', () => {
  assert.strictEqual(E.simulate([{ id: 'a', balance: 50, apr: 0, min: 0 }], 0, 'snowball').never, true);
});
const set = [
  { id: 'card', balance: 5000, apr: 30, min: 150 },
  { id: 'car', balance: 20000, apr: 8, min: 400 },
  { id: 'phone', balance: 800, apr: 0, min: 80 }
];
t('snowball order is smallest balance first', () => {
  assert.deepStrictEqual(E.orderDebts(set, 'snowball'), ['phone', 'card', 'car']);
});
t('avalanche order is highest APR first', () => {
  assert.deepStrictEqual(E.orderDebts(set, 'avalanche'), ['card', 'car', 'phone']);
});
t('custom order respected, unknown ids last', () => {
  assert.deepStrictEqual(E.orderDebts(set, 'custom', ['car', 'phone']), ['car', 'phone', 'card']);
});
t('avalanche never costs more interest than snowball', () => {
  const a = E.simulate(set, 300, 'avalanche'), s = E.simulate(set, 300, 'snowball');
  assert(a.totalInterest <= s.totalInterest + 0.01, a.totalInterest + ' vs ' + s.totalInterest);
});
t('rollover: freed minimum speeds the next debt', () => {
  const two = [{ id: 'x', balance: 100, apr: 0, min: 50 }, { id: 'y', balance: 400, apr: 0, min: 50 }];
  const r = E.simulate(two, 0, 'snowball');
  // x done month 2, then y gets 100/mo: total 500 / 100 per month = 5 months
  assert.strictEqual(r.payoff.x, 2); assert.strictEqual(r.months, 5);
});
t('every debt gets a payoff month and ends at zero', () => {
  const r = E.simulate(set, 200, 'snowball');
  assert.strictEqual(r.never, false);
  Object.keys(r.perDebt).forEach(k => { assert.strictEqual(r.perDebt[k][r.perDebt[k].length - 1], 0); assert(r.payoff[k] > 0); });
  assert.strictEqual(r.series[r.series.length - 1], 0);
});
t('summarize reports interest saved', () => {
  const s = E.summarize(set, 300, 'avalanche');
  assert(s.interestSaved > 0); assert(s.monthsSaved > 0);
});
t('summarize null when min-only never finishes', () => {
  const s = E.summarize([{ id: 'a', balance: 10000, apr: 36, min: 100 }], 500, 'snowball');
  assert.strictEqual(s.interestSaved, null);
});
t('paid debts ignored', () => {
  const r = E.simulate([{ id: 'a', balance: 0, apr: 10, min: 10 }], 0, 'snowball');
  assert.strictEqual(r.months, 0); assert.strictEqual(r.never, false);
});
t('monthlyInterest', () => assert.strictEqual(E.monthlyInterest([{ balance: 1200, apr: 12 }]), 12));
t('progress', () => {
  assert.strictEqual(E.progress([{ balance: 250, original: 1000 }]), 0.75);
  assert.strictEqual(E.progress([]), 0);
});
t('milestones', () => {
  assert.deepStrictEqual(E.milestones(0.26), [10, 25]);
  assert.deepStrictEqual(E.milestones(1), [10, 25, 50, 75, 100]);
  assert.deepStrictEqual(E.milestones(0), []);
});
t('streak counts consecutive months with grace for current', () => {
  const now = new Date(2026, 10, 20);
  assert.strictEqual(E.streak([{ date: '2026-10-05' }, { date: '2026-09-02' }, { date: '2026-07-01' }], now), 2);
  assert.strictEqual(E.streak([{ date: '2026-11-01' }, { date: '2026-10-05' }], now), 2);
  assert.strictEqual(E.streak([], now), 0);
  assert.strictEqual(E.streak([{ date: '2026-08-01' }], now), 0);
});
t('addMonths rolls year', () => {
  const d = E.addMonths(new Date(2026, 10, 26), 3);
  assert.strictEqual(d.getFullYear(), 2027); assert.strictEqual(d.getMonth(), 1);
});
t('huge horizon is capped, not infinite loop', () => {
  const r = E.simulate([{ id: 'a', balance: 1e9, apr: 0, min: 1 }], 0, 'snowball');
  assert.strictEqual(r.never, true);
});
console.log(n + ' engine tests passed');
