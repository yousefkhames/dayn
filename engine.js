/* Dayn engine: pure payoff maths. No DOM. Works in browser and Node. */
(function (root) {
  'use strict';

  var MAX_MONTHS = 1200; // 100 years cap

  function num(x) {
    x = Number(x);
    return isFinite(x) && x > 0 ? x : 0;
  }

  function round2(x) {
    return Math.round(x * 100) / 100;
  }

  // Order of debt ids by strategy. Paid-off debts are left out.
  function orderDebts(debts, strategy, custom) {
    var list = debts.filter(function (d) { return num(d.balance) > 0; });
    if (strategy === 'avalanche') {
      list.sort(function (a, b) { return num(b.apr) - num(a.apr) || num(a.balance) - num(b.balance); });
    } else if (strategy === 'custom' && custom && custom.length) {
      var pos = {};
      custom.forEach(function (id, i) { pos[id] = i; });
      list.sort(function (a, b) {
        var pa = pos[a.id] === undefined ? 9999 : pos[a.id];
        var pb = pos[b.id] === undefined ? 9999 : pos[b.id];
        return pa - pb;
      });
    } else {
      list.sort(function (a, b) { return num(a.balance) - num(b.balance) || num(b.apr) - num(a.apr); });
    }
    return list.map(function (d) { return d.id; });
  }

  /**
   * simulate(debts, extra, strategy, custom)
   * Monthly budget = sum of minimums + extra, held constant. Paid-off minimums roll over (the snowball effect).
   */
  function simulate(debts, extra, strategy, custom) {
    var ds = debts.map(function (d) {
      return { id: d.id, bal: num(d.balance), apr: num(d.apr), min: num(d.min) };
    }).filter(function (d) { return d.bal > 0; });
    var res = { months: 0, never: false, totalInterest: 0, totalPaid: 0, payoff: {}, series: [], perDebt: {}, order: [] };
    var start = ds.reduce(function (s, d) { return s + d.bal; }, 0);
    res.series.push(round2(start));
    ds.forEach(function (d) { res.perDebt[d.id] = [round2(d.bal)]; });
    if (!ds.length) return res;
    var budget = ds.reduce(function (s, d) { return s + d.min; }, 0) + num(extra);
    if (budget <= 0) { res.never = true; return res; }
    res.order = orderDebts(debts, strategy, custom);

    var m = 0;
    while (m < MAX_MONTHS) {
      var live = ds.filter(function (d) { return d.bal > 0.005; });
      if (!live.length) break;
      m++;
      live.forEach(function (d) {
        var i = d.bal * d.apr / 100 / 12;
        d.bal += i;
        res.totalInterest += i;
      });
      var pool = budget;
      live.forEach(function (d) {
        var p = Math.min(d.min, d.bal, pool);
        d.bal -= p; pool -= p; res.totalPaid += p;
      });
      var target = orderDebts(live.map(function (d) { return { id: d.id, balance: d.bal, apr: d.apr }; }), strategy, custom);
      for (var t = 0; t < target.length && pool > 0.0001; t++) {
        var d = live.filter(function (x) { return x.id === target[t]; })[0];
        var p2 = Math.min(d.bal, pool);
        d.bal -= p2; pool -= p2; res.totalPaid += p2;
      }
      ds.forEach(function (d) {
        if (d.bal <= 0.005) {
          d.bal = 0;
          if (res.payoff[d.id] === undefined) res.payoff[d.id] = m;
        }
        res.perDebt[d.id].push(round2(d.bal));
      });
      res.series.push(round2(ds.reduce(function (s, d) { return s + d.bal; }, 0)));
    }
    res.months = m;
    if (ds.some(function (d) { return d.bal > 0.005; })) { res.never = true; }
    res.totalInterest = round2(res.totalInterest);
    res.totalPaid = round2(res.totalPaid);
    return res;
  }

  function addMonths(date, n) {
    return new Date(date.getFullYear(), date.getMonth() + n, 1);
  }

  function summarize(debts, extra, strategy, custom) {
    var plan = simulate(debts, extra, strategy, custom);
    var minOnly = simulate(debts, 0, strategy, custom);
    var ok = !plan.never && !minOnly.never;
    return {
      plan: plan,
      minOnly: minOnly,
      interestSaved: ok ? round2(minOnly.totalInterest - plan.totalInterest) : null,
      monthsSaved: ok ? minOnly.months - plan.months : null
    };
  }

  // What the debts cost each month just in interest.
  function monthlyInterest(debts) {
    return round2(debts.reduce(function (s, d) { return s + num(d.balance) * num(d.apr) / 100 / 12; }, 0));
  }

  // Overall progress 0..1 across all debts.
  function progress(debts) {
    var orig = 0, left = 0;
    debts.forEach(function (d) {
      orig += Math.max(num(d.original), num(d.balance));
      left += num(d.balance);
    });
    if (orig <= 0) return 0;
    return Math.max(0, Math.min(1, (orig - left) / orig));
  }

  // Consecutive calendar months with at least one logged payment (this month not yet paid is forgiven).
  function streak(log, now) {
    var seen = {};
    (log || []).forEach(function (e) {
      var d = new Date(e.date);
      if (!isNaN(d)) seen[d.getFullYear() * 12 + d.getMonth()] = true;
    });
    var cur = now.getFullYear() * 12 + now.getMonth();
    if (!seen[cur]) cur -= 1;
    var n = 0;
    while (seen[cur]) { n++; cur--; }
    return n;
  }

  var MILESTONES = [10, 25, 50, 75, 100];
  function milestones(p) {
    return MILESTONES.filter(function (m) { return p * 100 >= m - 1e-9; });
  }

  root.Dayn = {
    simulate: simulate, summarize: summarize, orderDebts: orderDebts, addMonths: addMonths,
    monthlyInterest: monthlyInterest, progress: progress, streak: streak, milestones: milestones,
    MILESTONES: MILESTONES, round2: round2
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.Dayn;
})(typeof window !== 'undefined' ? window : globalThis);
