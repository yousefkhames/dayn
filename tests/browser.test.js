// Real-browser click-through. Usage: node tests/browser.test.js <baseUrl> [shotDir]
const puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer-core');
const url = process.argv[2] || 'http://localhost:8080/';
const shots = process.argv[3] || null;
let n = 0;
function ok(c, m) { if (!c) { throw new Error('FAIL: ' + m); } n++; console.log('ok', m); }
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  p.on('dialog', d => d.accept());
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await p.goto(url, { waitUntil: 'networkidle0' });
  const nav = async k => { await p.click('a[data-tab="' + k + '"]'); await p.waitForSelector('a[data-tab="' + k + '"][aria-current=page]'); };
  const txt = s => p.$eval(s, e => e.textContent);
  ok(await p.$eval('html', h => h.dir) === 'rtl', 'default is Arabic RTL');
  ok((await p.$eval('.empty h2', e => e.textContent)).includes('ابدأ'), 'empty state in Arabic');
  ok(await p.$eval('link[rel=manifest]', l => l.getAttribute('href')) === 'manifest.webmanifest', 'manifest linked');
  const reg = await p.evaluate(() => navigator.serviceWorker.ready.then(r => !!r.active));
  ok(reg, 'service worker active (offline cache)');
  // language toggle
  await p.click('#btn-lang');
  ok(await p.$eval('html', h => h.dir) === 'ltr', 'EN switches to LTR');
  ok((await txt('.empty h2')).includes('Start'), 'empty state in English');
  // add debt via form
  await p.click('[data-act="add"]');
  await p.type('#fd-name', 'Visa card');
  await p.type('#fd-bal', '5000');
  await p.type('#fd-apr', '24');
  await p.type('#fd-min', '200');
  await p.click('#f-debt button[type=submit]');
  await nav('debts');
  ok((await p.$eval('#view', e => e.textContent)).includes('Visa card'), 'debt added and listed');
  // invalid add rejected
  await p.click('[data-act="add"]');
  await p.type('#fd-name', 'Bad');
  await p.click('#f-debt button[type=submit]');
  ok((await txt('#toast')).includes('Check'), 'invalid debt rejected with message');
  await p.click('[data-act="close"]');
  // second debt
  await p.click('[data-act="add"]');
  await p.type('#fd-name', 'Phone');
  await p.type('#fd-bal', '900');
  await p.type('#fd-apr', '0');
  await p.type('#fd-min', '100');
  await p.click('#f-debt button[type=submit]');
  ok((await p.$$('.debt')).length === 2, 'two debts listed');
  // plan
  await nav('plan');
  const date0 = await txt('#free-date');
  ok(date0.length > 3 && date0 !== '∞', 'projected debt-free date shown: ' + date0);
  await p.click('[data-strat="avalanche"]');
  ok(await p.$eval('[data-strat="avalanche"]', e => e.getAttribute('aria-pressed')) === 'true', 'avalanche selected');
  // order: avalanche puts Visa first
  ok((await txt('.order li')).includes('Visa'), 'avalanche order puts highest APR first');
  await p.click('[data-strat="snowball"]');
  ok((await txt('.order li')).includes('Phone'), 'snowball order puts smallest first');
  // extra
  await p.$eval('#extra', e => e.value = '');
  await p.type('#extra', '500');
  await p.$eval('#extra', e => e.dispatchEvent(new Event('change', { bubbles: true })));
  const date1 = await txt('#free-date');
  ok(date1 !== date0, 'extra payment moves the date: ' + date0 + ' -> ' + date1);
  // what-if
  await p.$eval('#whatif', e => { e.value = e.max; e.dispatchEvent(new Event('input', { bubbles: true })); });
  ok((await txt('#whatif-out')).length > 10, 'what-if output updates');
  ok(!!(await p.$('[data-act="use-whatif"]')), 'use-this button offered');
  await p.click('[data-act="use-whatif"]');
  const date2 = await txt('#free-date');
  ok(date2 !== '∞', 'what-if applied: ' + date2);
  ok(!!(await p.$('#saved-line')), 'interest-saved line shown when extra > 0');
  // copy summary
  await p.evaluate(() => { window.__copied = null; Object.defineProperty(navigator, 'clipboard', { value: { writeText: x => { window.__copied = x; return Promise.resolve(); } }, configurable: true }); });
  await p.click('[data-act="copy"]');
  const copied = await p.evaluate(() => window.__copied);
  ok(copied && copied.includes('Visa card') && copied.includes('Debt-free'), 'copy summary writes plan text');
  // chart present
  ok(!!(await p.$('svg.chart path')), 'chart rendered');
  // this-month checklist starts unpaid
  ok((await p.$$('#month-list li[data-ok="false"]')).length === 2, 'month checklist shows both minimums pending');
  // log a payment
  await nav('debts');
  await p.click('[data-pay]');
  await p.type('#fp-amt', '300');
  await p.click('#f-pay button[type=submit]');
  ok((await p.$eval('#view', e => e.textContent)).includes('4,700') || (await p.$eval('#view', e => e.textContent)).includes('600'), 'payment reduced a balance');
  await nav('log');
  ok((await p.$$('.log li')).length === 1, 'payment appears in log');
  await nav('plan');
  ok((await txt('#streak')).trim() === '1', 'streak is 1 after paying this month');
  ok((await p.$$('#month-list li[data-ok="true"]')).length === 1, 'month checklist ticks the debt whose minimum was covered');
  // warning when minimum below interest
  await nav('debts');
  await p.click('[data-act="add"]');
  await p.type('#fd-name', 'Loan shark');
  await p.type('#fd-bal', '10000');
  await p.type('#fd-apr', '60');
  await p.type('#fd-min', '100');
  await p.click('#f-debt button[type=submit]');
  ok(!!(await p.$('[data-warn]')), 'warns when minimum is below monthly interest');
  await p.click('[data-edit="' + (await p.$$eval('[data-edit]', els => els[els.length - 1].dataset.edit)) + '"]');
  await p.click('[data-del]');
  ok((await p.$$('.debt')).length === 2, 'debt deleted');
  // pay off a debt completely -> celebration + milestone
  await nav('debts');
  const ids = await p.$$eval('[data-pay]', els => els.map(e => e.dataset.pay));
  await p.click('[data-pay="' + ids[ids.length - 1] + '"]');
  await p.type('#fp-amt', '999999');
  await p.click('#f-pay button[type=submit]');
  ok((await txt('#toast')).includes('Congrats'), 'payoff celebration shown');
  ok(!!(await p.$('.tag.ok')), 'paid tag shown');
  // undo payment
  await nav('log');
  await p.click('[data-undo]');
  await nav('debts');
  // persistence
  await p.reload({ waitUntil: 'networkidle0' });
  ok((await p.$$('.debt')).length === 2, 'state persists after reload');
  ok(await p.$eval('html', h => h.dir) === 'ltr', 'language persists');
  // edit
  await p.click('[data-edit]');
  await p.$eval('#fd-name', e => e.value = 'Visa Gold');
  await p.click('#f-debt button[type=submit]');
  ok((await p.$eval('#view', e => e.textContent)).includes('Visa Gold'), 'edit saves');
  // custom order
  await nav('plan');
  await p.click('[data-strat="custom"]');
  const first = await txt('.order li .meta b');
  await p.click('.order li:nth-child(2) [data-up]');
  ok((await txt('.order li .meta b')) !== first, 'custom order moves with arrow');
  // XSS
  await nav('debts');
  await p.click('[data-act="add"]');
  await p.type('#fd-name', '<img src=x onerror=window.__x=1>');
  await p.type('#fd-bal', '10');
  await p.click('#f-debt button[type=submit]');
  ok(await p.evaluate(() => window.__x === undefined), 'names are escaped (no XSS)');
  // never-payoff warning on the plan
  await nav('plan');
  await p.$eval('#extra', e => e.value = '0');
  await p.$eval('#extra', e => e.dispatchEvent(new Event('change', { bubbles: true })));
  await nav('debts');
  await p.click('[data-act="add"]');
  await p.type('#fd-name', 'Endless');
  await p.type('#fd-bal', '50000');
  await p.type('#fd-apr', '48');
  await p.type('#fd-min', '10');
  await p.click('#f-debt button[type=submit]');
  await nav('plan');
  ok(!!(await p.$('.hero + .stats + .alert')) && (await txt('#free-date')) === '∞', 'plan warns and shows infinity when payments never beat interest');
  // theme + settings
  await p.click('#btn-theme');
  ok(await p.$eval('html', h => h.dataset.theme) === 'dark', 'dark theme toggles');
  await nav('more');
  await p.select('#s-lang', 'ar');
  ok(await p.$eval('html', h => h.dir) === 'rtl', 'settings language select to Arabic');
  await p.click('#btn-theme');
  // no horizontal overflow
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'no horizontal overflow on mobile');
  // import: bad file rejected, good file accepted
  const fs = require('fs');
  fs.writeFileSync('/tmp/dayn-bad.json', '{"nope":1}');
  fs.writeFileSync('/tmp/dayn-good.json', JSON.stringify({ v: 1, lang: 'en', theme: 'light', currency: 'USD', extra: 50, strategy: 'avalanche', custom: [], debts: [{ id: 'z1', name: 'Imported loan', balance: 1200, original: 2000, apr: 10, min: 100 }], log: [] }));
  await nav('more');
  await (await p.$('#imp')).uploadFile('/tmp/dayn-bad.json');
  await p.waitForFunction(() => document.querySelector('#toast').textContent.length > 0 && document.querySelector('#toast').classList.contains('show'));
  ok(!(await p.$eval('#toast', e => e.textContent)).includes('Imported'), 'invalid backup file rejected');
  await (await p.$('#imp')).uploadFile('/tmp/dayn-good.json');
  await p.waitForFunction(() => document.querySelector('#toast').textContent === 'Imported');
  await nav('debts');
  ok((await p.$eval('#view', e => e.textContent)).includes('Imported loan'), 'valid backup imported');
  // Escape closes the sheet
  await p.click('[data-act="add"]');
  ok(!!(await p.$('.sheet')), 'sheet opens');
  await p.keyboard.press('Escape');
  ok(!(await p.$('.sheet')), 'Escape closes the sheet');
  await nav('more');
  // reset
  await p.click('[data-act="reset"]');
  await nav('debts');
  ok(!!(await p.$('.empty')), 'reset clears data');
  // sample data
  await p.click('[data-act="sample"]');
  await nav('plan');
  ok(!!(await p.$('.hero')) && (await txt('#free-date')) !== '∞', 'sample data gives a plan');
  if (shots) {
    await new Promise(r => setTimeout(r, 2800));
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.screenshot({ path: shots + '/plan-ar.png' });
    await p.screenshot({ path: shots + '/plan-ar-full.png', fullPage: true });
    await nav('debts'); await p.screenshot({ path: shots + '/debts-ar.png' });
    await p.click('#btn-lang'); await nav('plan'); await p.screenshot({ path: shots + '/plan-en.png' });
    await p.click('#btn-theme'); await p.screenshot({ path: shots + '/plan-en-dark.png' });
  }
  ok(errors.length === 0, 'no console/page errors ' + JSON.stringify(errors));
  await b.close();
  console.log(n + ' browser checks passed');
})().catch(e => { console.error(e.message); process.exit(1); });
