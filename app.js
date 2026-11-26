/* Dayn UI. Client-side only, state in localStorage. */
(function () {
  'use strict';
  var E = window.Dayn;
  var KEY = 'dayn.v1';

  var I18N = {
    ar: {
      plan: 'الخطة', debts: 'الديون', log: 'السجل', more: 'الإعدادات',
      freeBy: 'تخلص من ديونك في', monthsLeft: 'شهر متبقي', remaining: 'المتبقي', interestMo: 'فوائد شهرية', paidSoFar: 'سددت',
      snowball: 'كرة الثلج', avalanche: 'الانهيار', custom: 'ترتيبي',
      snowballD: 'تسدد الأصغر رصيداً أولاً. انتصارات سريعة وحافز أقوى.',
      avalancheD: 'تسدد الأعلى فائدة أولاً. أقل تكلفة إجمالية رياضياً.',
      customD: 'أنت تحدد الترتيب بالأسهم.',
      strategy: 'الاستراتيجية', extra: 'مبلغ إضافي شهرياً', extraH: 'فوق الحد الأدنى لكل الديون',
      whatIf: 'ماذا لو؟', whatIfD: 'جرب مبلغاً إضافياً بدون حفظه', useThis: 'اعتمد هذا المبلغ',
      earlier: 'أبكر بـ', months: 'شهر', saveInt: 'توفر في الفوائد', vsMin: 'مقارنة بالحد الأدنى فقط',
      order: 'ترتيب السداد', payoffOn: 'تسديد في', compare: 'مقارنة الاستراتيجيات',
      date: 'تاريخ الانتهاء', interest: 'إجمالي الفوائد', stratName: 'الاستراتيجية',
      chartT: 'رصيدك المتوقع', withPlan: 'مع خطتك', minOnly: 'حد أدنى فقط', now: 'الآن',
      never: 'بهذه المبالغ لن ينتهي الدين: الدفعة أقل من الفائدة. ارفع الحد الأدنى أو الإضافي.',
      motivation: 'دافعك', streak: 'أشهر متتالية بدفعات', milestones: 'محطات',
      addDebt: 'أضف دين', editDebt: 'تعديل الدين', name: 'الاسم', balance: 'الرصيد الحالي', apr: 'الفائدة السنوية %', minPay: 'الحد الأدنى الشهري',
      save: 'حفظ', cancel: 'إلغاء', del: 'حذف', pay: 'سدد', edit: 'تعديل', paid: 'مسدد',
      next: 'التالي', left: 'متبقي', of: 'من', perMo: 'شهرياً',
      emptyT: 'ابدأ من أول دين', emptyD: 'أضف ديونك واحداً واحداً، وDayn يحسب لك اليوم الذي تصير فيه حراً.', sample: 'جرب بيانات تجريبية',
      payT: 'سجل دفعة', amount: 'المبلغ', when: 'التاريخ', which: 'الدين', logEmpty: 'لا دفعات بعد. أول دفعة هي أصعب واحدة.',
      lang: 'اللغة', currency: 'العملة', export: 'تصدير نسخة', import: 'استيراد نسخة', reset: 'مسح كل البيانات',
      confirmReset: 'سيتم مسح كل بياناتك من هذا المتصفح. متأكد؟', confirmDel: 'حذف هذا الدين وسجل دفعاته؟', undoPay: 'حذف الدفعة يرجع المبلغ للرصيد',
      privacy: 'بياناتك تبقى في هذا المتصفح فقط. لا حساب ولا سيرفر. امسح بيانات المتصفح وستختفي، لذلك صدّر نسخة احتياطية.',
      about: 'Dayn أداة تخطيط وليست استشارة مالية. الحساب يفترض فائدة شهرية ثابتة ودفعات في موعدها.',
      saved: 'تم الحفظ', logged: 'تم تسجيل الدفعة', imported: 'تم الاستيراد', badFile: 'الملف غير صالح', invalid: 'تحقق من الاسم والرصيد',
      celebrate: 'مبروك! سددت', allDone: 'أنت حر من الديون. هذا إنجاز حقيقي.',
      free: 'حر', activeDebts: 'ديون نشطة', monthlyOut: 'ميزانية السداد', pctDone: 'منجز',
      ms10: 'بداية', ms25: 'ربع', ms50: 'نصف', ms75: 'ثلاثة أرباع', ms100: 'حر',
      quotes: [
        'كل جنيه تسدده اليوم هو فائدة لن تدفعها غداً.',
        'الدين لا يختفي بالنية. يختفي بدفعة صغيرة منتظمة.',
        'لا تقارن سرعتك بأحد. قارن نفسك بالأمس.',
        'الأصغر أولاً يعطيك أول انتصار. والانتصار يصنع العادة.',
        'اليوم الذي تنتهي فيه من آخر قسط يستحق كل صبرك الآن.',
        'خطوة صغيرة كل شهر أسرع من قفزة تنتظرها سنة.',
        'الحرية المالية تبدأ بالرقم الحقيقي، وأنت كتبته.'
      ],
      demoNames: ['بطاقة ائتمان', 'قرض سيارة', 'قسط موبايل']
    },
    en: {
      plan: 'Plan', debts: 'Debts', log: 'Log', more: 'Settings',
      freeBy: 'Debt-free by', monthsLeft: 'months to go', remaining: 'Remaining', interestMo: 'Interest / mo', paidSoFar: 'Paid off',
      snowball: 'Snowball', avalanche: 'Avalanche', custom: 'Custom',
      snowballD: 'Smallest balance first. Quick wins keep you going.',
      avalancheD: 'Highest interest first. Cheapest overall, mathematically.',
      customD: 'You set the order with the arrows.',
      strategy: 'Strategy', extra: 'Extra per month', extraH: 'On top of all minimums',
      whatIf: 'What if?', whatIfD: 'Try an extra amount without saving it', useThis: 'Use this amount',
      earlier: 'Sooner by', months: 'mo', saveInt: 'saved in interest', vsMin: 'vs minimums only',
      order: 'Payoff order', payoffOn: 'Done by', compare: 'Compare strategies',
      date: 'Debt-free', interest: 'Total interest', stratName: 'Strategy',
      chartT: 'Projected balance', withPlan: 'Your plan', minOnly: 'Minimums only', now: 'Now',
      never: 'At these amounts the debt never ends: payments are below the interest. Raise a minimum or the extra.',
      motivation: 'Your fuel', streak: 'month streak of payments', milestones: 'Milestones',
      addDebt: 'Add debt', editDebt: 'Edit debt', name: 'Name', balance: 'Current balance', apr: 'Yearly interest %', minPay: 'Minimum monthly payment',
      save: 'Save', cancel: 'Cancel', del: 'Delete', pay: 'Pay', edit: 'Edit', paid: 'Paid',
      next: 'Next', left: 'left', of: 'of', perMo: '/mo',
      emptyT: 'Start with one debt', emptyD: 'Add your debts one by one. Dayn works out the day you become free.', sample: 'Try sample data',
      payT: 'Log a payment', amount: 'Amount', when: 'Date', which: 'Debt', logEmpty: 'No payments yet. The first one is the hardest.',
      lang: 'Language', currency: 'Currency', export: 'Export backup', import: 'Import backup', reset: 'Erase all data',
      confirmReset: 'This erases all your data from this browser. Sure?', confirmDel: 'Delete this debt and its payments?', undoPay: 'Deleting a payment puts the amount back on the balance',
      privacy: 'Your data stays in this browser only. No account, no server. Clearing browser data erases it, so export a backup.',
      about: 'Dayn is a planning tool, not financial advice. It assumes a fixed monthly interest rate and on-time payments.',
      saved: 'Saved', logged: 'Payment logged', imported: 'Imported', badFile: 'Invalid file', invalid: 'Check name and balance',
      celebrate: 'Congrats! You paid off', allDone: 'You are debt-free. That is a real achievement.',
      free: 'Free', activeDebts: 'active debts', monthlyOut: 'Payoff budget', pctDone: 'done',
      ms10: 'Start', ms25: 'Quarter', ms50: 'Half', ms75: 'Three-quarters', ms100: 'Free',
      quotes: [
        'Every pound you pay today is interest you will not pay tomorrow.',
        'Debt does not vanish with good intentions. It vanishes with small regular payments.',
        'Do not compare your speed to anyone. Compare yourself to yesterday.',
        'Smallest first gives you the first win. Wins build the habit.',
        'The day you make the last payment will be worth all this patience.',
        'A small step every month beats a leap you wait a year for.',
        'Financial freedom starts with the real number, and you wrote it down.'
      ],
      demoNames: ['Credit card', 'Car loan', 'Phone installments']
    }
  };

  var COLORS = ['#e4572e', '#f2a541', '#5f8f55', '#4a7fb5', '#9a5ea3', '#c0702e'];

  var state = load();
  var tab = 'plan';
  var whatIf = null; // temporary extra for the what-if slider

  function defaults() {
    return { v: 1, lang: 'ar', theme: 'light', currency: 'EGP', extra: 0, strategy: 'snowball', custom: [], debts: [], log: [] };
  }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === 1 && Array.isArray(s.debts)) return Object.assign(defaults(), s);
    } catch (e) { /* ignore */ }
    return defaults();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ } }
  function t(k) { return I18N[state.lang][k]; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function locale() { return state.lang === 'ar' ? 'ar-EG' : 'en-US'; }
  function money(x) {
    var n = Math.round((Number(x) || 0) * 100) / 100;
    var s;
    try { s = n.toLocaleString(locale(), { maximumFractionDigits: n % 1 ? 2 : 0 }); } catch (e) { s = String(n); }
    return '<span class="num">' + esc(s) + ' ' + esc(state.currency) + '</span>';
  }
  function plain(x) { return String(Math.round((Number(x) || 0) * 100) / 100); }
  function fmtDate(d) { return d.toLocaleDateString(locale(), { month: 'long', year: 'numeric' }); }
  function nInt(x) { return Number(x).toLocaleString(locale()); }
  function $(s, r) { return (r || document).querySelector(s); }
  function activeDebts() { return state.debts.filter(function (d) { return d.balance > 0.005; }); }
  function toast(msg) {
    var el = $('#toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function customOrder() {
    var ids = activeDebts().map(function (d) { return d.id; });
    var cur = (state.custom || []).filter(function (id) { return ids.indexOf(id) > -1; });
    ids.forEach(function (id) { if (cur.indexOf(id) < 0) cur.push(id); });
    return cur;
  }

  function applyChrome() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dataset.theme = state.theme;
    $('#btn-lang').textContent = state.lang === 'ar' ? 'EN' : 'ع';
    var mc = document.querySelector('meta[name=theme-color]');
    if (mc) mc.content = state.theme === 'dark' ? '#141a22' : '#f4efe3';
    var icons = { plan: '◔', debts: '▤', log: '✎', more: '⚙' };
    $('#tabs').innerHTML = '<div class="tabs-in">' + ['plan', 'debts', 'log', 'more'].map(function (k) {
      return '<a href="#' + k + '" data-tab="' + k + '"' + (tab === k ? ' aria-current="page"' : '') + '><span class="ic">' + icons[k] + '</span>' + t(k) + '</a>';
    }).join('') + '</div>';
  }

  /* ---------- views ---------- */
  function render() {
    applyChrome();
    var v = $('#view');
    v.innerHTML = tab === 'debts' ? viewDebts() : tab === 'log' ? viewLog() : tab === 'more' ? viewMore() : viewPlan();
    if (tab === 'plan') bindPlan();
  }

  function emptyState() {
    return '<div class="card empty"><div class="big">🪜</div><h2>' + t('emptyT') + '</h2><p class="mute">' + t('emptyD') + '</p>' +
      '<div class="row" style="justify-content:center"><button class="btn" data-act="add">+ ' + t('addDebt') + '</button>' +
      '<button class="btn ghost" data-act="sample">' + t('sample') + '</button></div></div>';
  }

  function viewPlan() {
    var act = activeDebts();
    if (!state.debts.length) return emptyState();
    if (!act.length) {
      return '<section class="hero win"><div><div class="date">🎉 ' + t('free') + '</div><div class="sub">' + t('allDone') + '</div></div></section>' + motivationCard(1) +
        '<div class="row"><button class="btn" data-act="add">+ ' + t('addDebt') + '</button></div>';
    }
    var extra = whatIf !== null ? whatIf : state.extra;
    var strat = state.strategy;
    var sum = E.summarize(state.debts, state.extra, strat, customOrder());
    var plan = sum.plan;
    var p = E.progress(state.debts);
    var left = act.reduce(function (s, d) { return s + d.balance; }, 0);
    var budget = act.reduce(function (s, d) { return s + d.min; }, 0) + state.extra;
    var now = new Date();
    var dateTxt = plan.never ? '∞' : fmtDate(E.addMonths(now, plan.months));
    var C = 2 * Math.PI * 47;
    var h = '<section class="hero"><div class="ring"><svg viewBox="0 0 118 118"><circle class="bg" cx="59" cy="59" r="47"/><circle cx="59" cy="59" r="47" stroke="' + (p > .5 ? '#8ab17d' : '#f2a541') + '" stroke-dasharray="' + (C * p).toFixed(1) + ' ' + C.toFixed(1) + '"/></svg><div class="pct"><span class="num" id="pct">' + Math.round(p * 100) + '%</span></div></div>' +
      '<div><div class="kicker">' + t('freeBy') + '</div><div class="date" id="free-date">' + esc(dateTxt) + '</div><div class="sub">' + (plan.never ? '' : '<span class="num">' + nInt(plan.months) + '</span> ' + t('monthsLeft')) + '</div></div></section>';
    h += '<div class="stats"><div class="stat"><b>' + money(left) + '</b><span>' + t('remaining') + '</span></div><div class="stat"><b>' + money(E.monthlyInterest(state.debts)) + '</b><span>' + t('interestMo') + '</span></div><div class="stat"><b>' + money(budget) + '</b><span>' + t('monthlyOut') + '</span></div></div>';
    if (plan.never) h += '<div class="alert">' + t('never') + '</div>';

    h += '<div class="card"><div class="card-h"><h2>' + t('strategy') + '</h2></div><div class="seg" role="group">' +
      ['snowball', 'avalanche', 'custom'].map(function (s) { return '<button type="button" data-strat="' + s + '" aria-pressed="' + (strat === s) + '">' + t(s) + '</button>'; }).join('') +
      '</div><p class="mute small" style="margin:8px 0 0">' + t(strat + 'D') + '</p>' +
      '<label for="extra">' + t('extra') + ' <span class="mute small">(' + t('extraH') + ')</span></label><input id="extra" type="number" inputmode="decimal" min="0" step="any" value="' + plain(state.extra) + '"></div>';

    // order
    var order = plan.order;
    h += '<div class="card"><div class="card-h"><h2>' + t('order') + '</h2></div><ol class="order">' + order.map(function (id, i) {
      var d = state.debts.filter(function (x) { return x.id === id; })[0];
      if (!d) return '';
      var when = plan.payoff[id] ? fmtDate(E.addMonths(now, plan.payoff[id])) : '∞';
      var mv = strat === 'custom' ? '<div class="move"><button type="button" data-up="' + id + '" aria-label="up">▲</button><button type="button" data-down="' + id + '" aria-label="down">▼</button></div>' : '';
      return '<li><span class="step" style="background:' + COLORS[state.debts.indexOf(d) % COLORS.length] + '">' + nInt(i + 1) + '</span><div class="meta"><b>' + esc(d.name) + '</b><span class="mute small">' + money(d.balance) + ' · <span class="num">' + plain(d.apr) + '%</span></span></div><div class="when"><span class="small mute">' + t('payoffOn') + '</span><br>' + esc(when) + '</div>' + mv + '</li>';
    }).join('') + '</ol></div>';

    // what-if
    var maxS = Math.max(500, Math.ceil((state.extra * 3 + budget) / 100) * 100);
    var cur = whatIf !== null ? whatIf : state.extra;
    h += '<div class="card"><div class="card-h"><h2>' + t('whatIf') + '</h2></div><p class="mute small" style="margin:0 0 4px">' + t('whatIfD') + '</p>' +
      '<input id="whatif" type="range" min="0" max="' + maxS + '" step="' + (maxS > 2000 ? 50 : 10) + '" value="' + cur + '" aria-label="' + t('whatIf') + '">' +
      '<div id="whatif-out">' + whatIfOut(cur) + '</div></div>';

    // chart
    h += '<div class="card"><div class="card-h"><h2>' + t('chartT') + '</h2></div>' + chart(sum) + '<div class="legend"><span><i style="background:var(--red)"></i>' + t('withPlan') + '</span><span><i style="background:var(--mute);opacity:.6"></i>' + t('minOnly') + '</span></div>';
    if (sum.interestSaved !== null && state.extra > 0) h += '<p class="small" style="margin:10px 0 0"><b>' + money(sum.interestSaved) + '</b> ' + t('saveInt') + ' · <b class="num">' + nInt(sum.monthsSaved) + '</b> ' + t('months') + ' ' + t('earlier') + ' ' + t('vsMin') + '</p>';
    h += '</div>';

    h += compareCard();
    h += motivationCard(p);
    return h;
  }

  function whatIfOut(x) {
    var base = E.simulate(state.debts, state.extra, state.strategy, customOrder());
    var alt = E.simulate(state.debts, x, state.strategy, customOrder());
    if (alt.never) return '<p class="alert">' + t('never') + '</p>';
    var diff = base.never ? null : base.months - alt.months;
    var intr = base.never ? null : E.round2(base.totalInterest - alt.totalInterest);
    var s = '<p style="margin:6px 0"><b>+' + money(x) + '</b> ' + t('perMo') + ' → <b>' + esc(fmtDate(E.addMonths(new Date(), alt.months))) + '</b></p>';
    if (diff !== null && x !== state.extra) {
      s += '<p class="small mute" style="margin:0">' + (diff >= 0 ? t('earlier') + ' <b class="num">' + nInt(diff) + '</b> ' + t('months') : '<b class="num">' + nInt(-diff) + '</b> ' + t('months') + ' +') + ' · ' + money(Math.abs(intr)) + ' ' + (intr >= 0 ? t('saveInt') : '+') + '</p>';
    }
    if (x !== state.extra) s += '<button class="btn sm green" style="margin-top:8px" data-act="use-whatif">' + t('useThis') + '</button>';
    return s;
  }

  function compareCard() {
    var cs = customOrder();
    var rows = ['snowball', 'avalanche'].map(function (s) { return { s: s, r: E.simulate(state.debts, state.extra, s, cs) }; });
    var best = rows.reduce(function (a, b) { return (a.r.never ? 1e9 : a.r.totalInterest) <= (b.r.never ? 1e9 : b.r.totalInterest) ? a : b; });
    var now = new Date();
    return '<div class="card flat"><div class="card-h"><h2>' + t('compare') + '</h2></div><table class="cmp"><thead><tr><th>' + t('stratName') + '</th><th>' + t('date') + '</th><th>' + t('interest') + '</th></tr></thead><tbody>' +
      rows.map(function (x) {
        return '<tr class="' + (x.s === best.s ? 'best' : '') + '"><td>' + t(x.s) + '</td><td>' + (x.r.never ? '∞' : esc(fmtDate(E.addMonths(now, x.r.months)))) + '</td><td>' + (x.r.never ? '∞' : money(x.r.totalInterest)) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function chart(sum) {
    var a = sum.plan.series, b = sum.minOnly.series;
    var W = 340, H = 170, pl = 8, pr = 8, pt = 10, pb = 22;
    var n = Math.max(a.length, sum.minOnly.never ? 0 : b.length, 2);
    var cap = 600; if (n > cap) n = cap;
    var maxV = Math.max(a[0] || 1, 1);
    function X(i) { return pl + (W - pl - pr) * i / (n - 1); }
    function Y(v) { return pt + (H - pt - pb) * (1 - v / maxV); }
    function path(s) {
      var out = '';
      for (var i = 0; i < Math.min(s.length, n); i++) out += (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(s[i]).toFixed(1);
      return out;
    }
    var area = path(a) + 'L' + X(Math.min(a.length, n) - 1).toFixed(1) + ' ' + Y(0) + 'L' + X(0) + ' ' + Y(0) + 'Z';
    var now = new Date();
    var endD = fmtDate(E.addMonths(now, n - 1));
    var rtl = state.lang === 'ar';
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + t('chartT') + '"' + (rtl ? ' style="transform:scaleX(-1)"' : '') + '>' +
      '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="var(--line)" stroke-width="2"/>' +
      (sum.minOnly.never ? '' : '<path d="' + path(b) + '" fill="none" stroke="var(--mute)" stroke-width="2" stroke-dasharray="4 4" opacity=".6"/>') +
      '<path d="' + area + '" fill="var(--red)" opacity=".13"/><path d="' + path(a) + '" fill="none" stroke="var(--red)" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/></svg>' +
      '<div class="row small mute" style="justify-content:space-between"><span>' + t('now') + '</span><span>' + esc(endD) + '</span></div>';
  }

  function motivationCard(p) {
    var q = I18N[state.lang].quotes;
    var idx = (Math.floor(Date.now() / 86400000) + state.debts.length) % q.length;
    var st = E.streak(state.log, new Date());
    var got = E.milestones(p);
    return '<div class="card"><div class="card-h"><h2>' + t('motivation') + '</h2><span class="tag ok">' + Math.round(p * 100) + '% ' + t('pctDone') + '</span></div>' +
      '<p class="quote" id="quote">' + esc(q[idx]) + '</p>' +
      '<p style="margin:12px 0 0"><span class="flame">' + (st ? '🔥' : '🌱') + '</span> <b class="num" id="streak">' + nInt(st) + '</b> ' + t('streak') + '</p>' +
      '<div class="badges" aria-label="' + t('milestones') + '">' + E.MILESTONES.map(function (m) {
        return '<div class="badge' + (got.indexOf(m) > -1 ? ' on' : '') + '" data-ms="' + m + '"><b class="num">' + nInt(m) + '%</b><span class="small">' + t('ms' + m) + '</span></div>';
      }).join('') + '</div></div>';
  }

  function viewDebts() {
    var h = '<div class="card-h" style="margin-top:14px"><h2>' + t('debts') + '</h2><button class="btn sm" data-act="add">+ ' + t('addDebt') + '</button></div>';
    if (!state.debts.length) return h + emptyState();
    var next = E.orderDebts(state.debts, state.strategy, customOrder())[0];
    return h + state.debts.map(function (d, i) {
      var orig = Math.max(d.original || d.balance, d.balance);
      var pct = orig ? Math.round((orig - d.balance) / orig * 100) : 0;
      var done = d.balance <= 0.005;
      return '<article class="card debt" data-id="' + d.id + '"><div class="debt-top"><div><h3>' + esc(d.name) + '</h3><div style="margin-top:4px">' +
        (done ? '<span class="tag ok">✓ ' + t('paid') + '</span>' : (d.id === next ? '<span class="tag next">' + t('next') + '</span>' : '')) +
        '<span class="tag"><span class="num">' + plain(d.apr) + '%</span></span><span class="tag">' + money(d.min) + t('perMo') + '</span></div></div><div style="text-align:end"><b style="font-size:1.15rem">' + money(d.balance) + '</b><br><span class="mute small">' + t('of') + ' ' + money(orig) + '</span></div></div>' +
        '<div class="bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div>' +
        '<div class="row"><span class="mute small grow"><span class="num">' + pct + '%</span> ' + t('pctDone') + '</span>' +
        (done ? '' : '<button class="btn sm green" data-pay="' + d.id + '">' + t('pay') + '</button>') +
        '<button class="btn sm ghost" data-edit="' + d.id + '">' + t('edit') + '</button></div></article>';
    }).join('');
  }

  function viewLog() {
    var h = '<div class="card-h" style="margin-top:14px"><h2>' + t('log') + '</h2><button class="btn sm" data-act="pay">+ ' + t('payT') + '</button></div>';
    if (!state.log.length) return h + '<div class="card empty"><div class="big">✎</div><p class="mute">' + t('logEmpty') + '</p></div>';
    var sorted = state.log.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : b.at - a.at; });
    return h + '<div class="card"><ul class="log">' + sorted.map(function (e) {
      var d = state.debts.filter(function (x) { return x.id === e.debtId; })[0];
      return '<li><div><b>' + esc(d ? d.name : '?') + '</b><br><span class="mute small num">' + esc(e.date) + '</span></div><div class="row"><b>' + money(e.amount) + '</b><button class="btn sm danger" data-undo="' + e.at + '" aria-label="' + t('del') + '">✕</button></div></li>';
    }).join('') + '</ul><p class="mute small">' + t('undoPay') + '</p></div>';
  }

  function viewMore() {
    return '<div class="card"><h2>' + t('lang') + ' / ' + t('currency') + '</h2><div class="grid2"><div><label for="s-lang">' + t('lang') + '</label><select id="s-lang"><option value="ar"' + (state.lang === 'ar' ? ' selected' : '') + '>العربية</option><option value="en"' + (state.lang === 'en' ? ' selected' : '') + '>English</option></select></div>' +
      '<div><label for="s-cur">' + t('currency') + '</label><input id="s-cur" maxlength="6" value="' + esc(state.currency) + '"></div></div></div>' +
      '<div class="card"><div class="row"><button class="btn ghost" data-act="export">' + t('export') + '</button><label class="btn ghost" style="margin:0;cursor:pointer" for="imp">' + t('import') + '</label><input id="imp" type="file" accept="application/json" hidden></div>' +
      '<div class="row" style="margin-top:12px"><button class="btn danger" data-act="reset">' + t('reset') + '</button></div></div>' +
      '<div class="card flat"><p class="small" style="margin:0 0 8px">🔒 ' + t('privacy') + '</p><p class="small mute" style="margin:0">' + t('about') + '</p></div>';
  }

  /* ---------- modals ---------- */
  function openSheet(html) {
    var r = $('#modal-root');
    r.innerHTML = '<div class="scrim" id="scrim"><div class="sheet" role="dialog" aria-modal="true">' + html + '</div></div>';
    var first = r.querySelector('input,select'); if (first) first.focus();
  }
  function closeSheet() { $('#modal-root').innerHTML = ''; }

  function debtForm(d) {
    d = d || { name: '', balance: '', apr: '', min: '' };
    openSheet('<h2>' + (d.id ? t('editDebt') : t('addDebt')) + '</h2><form id="f-debt" novalidate><input type="hidden" id="fd-id" value="' + (d.id || '') + '">' +
      '<label for="fd-name">' + t('name') + '</label><input id="fd-name" maxlength="40" value="' + esc(d.name) + '" required>' +
      '<div class="grid2"><div><label for="fd-bal">' + t('balance') + '</label><input id="fd-bal" type="number" inputmode="decimal" min="0" step="any" value="' + (d.balance === '' ? '' : plain(d.balance)) + '"></div>' +
      '<div><label for="fd-apr">' + t('apr') + '</label><input id="fd-apr" type="number" inputmode="decimal" min="0" max="200" step="any" value="' + (d.apr === '' ? '' : plain(d.apr)) + '"></div></div>' +
      '<label for="fd-min">' + t('minPay') + '</label><input id="fd-min" type="number" inputmode="decimal" min="0" step="any" value="' + (d.min === '' ? '' : plain(d.min)) + '">' +
      '<div class="row" style="margin-top:16px"><button class="btn" type="submit">' + t('save') + '</button><button class="btn ghost" type="button" data-act="close">' + t('cancel') + '</button>' +
      (d.id ? '<button class="btn danger" type="button" data-del="' + d.id + '" style="margin-inline-start:auto">' + t('del') + '</button>' : '') + '</div></form>');
  }

  function payForm(debtId) {
    var act = activeDebts();
    if (!act.length) { toast(t('emptyT')); return; }
    openSheet('<h2>' + t('payT') + '</h2><form id="f-pay" novalidate><label for="fp-debt">' + t('which') + '</label><select id="fp-debt">' +
      act.map(function (d) { return '<option value="' + d.id + '"' + (d.id === debtId ? ' selected' : '') + '>' + esc(d.name) + '</option>'; }).join('') + '</select>' +
      '<div class="grid2"><div><label for="fp-amt">' + t('amount') + '</label><input id="fp-amt" type="number" inputmode="decimal" min="0" step="any"></div><div><label for="fp-date">' + t('when') + '</label><input id="fp-date" type="date" value="' + today() + '"></div></div>' +
      '<div class="row" style="margin-top:16px"><button class="btn green" type="submit">' + t('save') + '</button><button class="btn ghost" type="button" data-act="close">' + t('cancel') + '</button></div></form>');
    var sel = $('#fp-debt'), amt = $('#fp-amt');
    function pre() { var d = state.debts.filter(function (x) { return x.id === sel.value; })[0]; if (d && !amt.value) amt.placeholder = plain(Math.min(d.min, d.balance)); }
    sel.addEventListener('change', pre); pre();
    amt.focus();
  }

  /* ---------- actions ---------- */
  function saveDebt() {
    var id = $('#fd-id').value;
    var name = $('#fd-name').value.trim();
    var bal = parseFloat($('#fd-bal').value), apr = parseFloat($('#fd-apr').value || '0'), min = parseFloat($('#fd-min').value || '0');
    if (!name || !(bal >= 0) || isNaN(bal) || !(apr >= 0) || !(min >= 0)) { toast(t('invalid')); return; }
    if (id) {
      var d = state.debts.filter(function (x) { return x.id === id; })[0];
      d.name = name; d.balance = bal; d.apr = apr; d.min = min; d.original = Math.max(d.original || 0, bal);
    } else {
      state.debts.push({ id: uid(), name: name, balance: bal, original: bal, apr: apr, min: min });
    }
    save(); closeSheet(); toast(t('saved')); render();
  }

  function savePay() {
    var id = $('#fp-debt').value;
    var amt = parseFloat($('#fp-amt').value);
    var date = $('#fp-date').value || today();
    var d = state.debts.filter(function (x) { return x.id === id; })[0];
    if (!d || !(amt > 0)) { toast(t('invalid')); return; }
    amt = Math.min(amt, d.balance);
    d.balance = E.round2(d.balance - amt);
    state.log.push({ at: Date.now(), debtId: id, amount: amt, date: date });
    save(); closeSheet();
    if (d.balance <= 0.005) { d.balance = 0; save(); toast('🎉 ' + t('celebrate') + ' ' + d.name); } else toast(t('logged'));
    render();
  }

  function undoPay(at) {
    var e = state.log.filter(function (x) { return String(x.at) === String(at); })[0];
    if (!e) return;
    var d = state.debts.filter(function (x) { return x.id === e.debtId; })[0];
    if (d) { d.balance = E.round2(d.balance + e.amount); d.original = Math.max(d.original || 0, d.balance); }
    state.log = state.log.filter(function (x) { return x !== e; });
    save(); render();
  }

  function sample() {
    var n = I18N[state.lang].demoNames;
    state.debts = [
      { id: uid(), name: n[0], balance: 18000, original: 24000, apr: 36, min: 900 },
      { id: uid(), name: n[1], balance: 120000, original: 150000, apr: 18, min: 3500 },
      { id: uid(), name: n[2], balance: 7000, original: 10000, apr: 0, min: 700 }
    ];
    state.extra = 1000; state.log = []; state.custom = [];
    save(); render();
  }

  function exportData() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'dayn-backup-' + today() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function importData(file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var s = JSON.parse(r.result);
        if (!s || s.v !== 1 || !Array.isArray(s.debts) || !Array.isArray(s.log || [])) throw new Error('bad');
        s.debts.forEach(function (d) { if (typeof d.name !== 'string' || !(Number(d.balance) >= 0)) throw new Error('bad'); });
        state = Object.assign(defaults(), s);
        state.debts.forEach(function (d) { d.balance = Number(d.balance); d.apr = Number(d.apr) || 0; d.min = Number(d.min) || 0; d.original = Number(d.original) || d.balance; d.id = String(d.id || uid()); });
        save(); toast(t('imported')); render();
      } catch (e) { toast(t('badFile')); }
    };
    r.readAsText(file);
  }

  function bindPlan() {
    var ex = $('#extra');
    if (ex) ex.addEventListener('change', function () {
      var v = parseFloat(ex.value); state.extra = v > 0 ? v : 0; whatIf = null; save(); render();
    });
    var wi = $('#whatif');
    if (wi) wi.addEventListener('input', function () {
      whatIf = Number(wi.value); $('#whatif-out').innerHTML = whatIfOut(whatIf);
    });
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act],[data-strat],[data-edit],[data-pay],[data-del],[data-undo],[data-up],[data-down],a[data-tab],#scrim');
    if (!el) return;
    if (el.id === 'scrim') { if (ev.target === el) closeSheet(); return; }
    if (el.dataset.tab) return; // hash handled
    var a = el.dataset.act;
    if (el.dataset.strat) { state.strategy = el.dataset.strat; whatIf = null; save(); render(); }
    else if (el.dataset.edit) debtForm(state.debts.filter(function (d) { return d.id === el.dataset.edit; })[0]);
    else if (el.dataset.pay) payForm(el.dataset.pay);
    else if (el.dataset.del) { if (confirm(t('confirmDel'))) { var id = el.dataset.del; state.debts = state.debts.filter(function (d) { return d.id !== id; }); state.log = state.log.filter(function (e) { return e.debtId !== id; }); save(); closeSheet(); render(); } }
    else if (el.dataset.undo) undoPay(el.dataset.undo);
    else if (el.dataset.up || el.dataset.down) {
      var id2 = el.dataset.up || el.dataset.down, o = customOrder(), i = o.indexOf(id2), j = el.dataset.up ? i - 1 : i + 1;
      if (j >= 0 && j < o.length) { var tmp = o[i]; o[i] = o[j]; o[j] = tmp; state.custom = o; save(); render(); }
    }
    else if (a === 'add') debtForm();
    else if (a === 'pay') payForm();
    else if (a === 'close') closeSheet();
    else if (a === 'sample') sample();
    else if (a === 'use-whatif') { state.extra = whatIf; whatIf = null; save(); render(); toast(t('saved')); }
    else if (a === 'export') exportData();
    else if (a === 'reset') { if (confirm(t('confirmReset'))) { var keepLang = state.lang, keepTheme = state.theme; state = defaults(); state.lang = keepLang; state.theme = keepTheme; save(); render(); } }
  });
  document.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (ev.target.id === 'f-debt') saveDebt();
    if (ev.target.id === 'f-pay') savePay();
  });
  document.addEventListener('change', function (ev) {
    if (ev.target.id === 's-lang') { state.lang = ev.target.value; save(); render(); }
    if (ev.target.id === 's-cur') { state.currency = ev.target.value.trim() || 'EGP'; save(); toast(t('saved')); }
    if (ev.target.id === 'imp' && ev.target.files[0]) importData(ev.target.files[0]);
  });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeSheet(); });
  $('#btn-lang').addEventListener('click', function () { state.lang = state.lang === 'ar' ? 'en' : 'ar'; save(); render(); });
  $('#btn-theme').addEventListener('click', function () { state.theme = state.theme === 'dark' ? 'light' : 'dark'; save(); render(); });
  function route() {
    var h = location.hash.replace('#', '');
    tab = ['plan', 'debts', 'log', 'more'].indexOf(h) > -1 ? h : 'plan';
    render();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
})();
