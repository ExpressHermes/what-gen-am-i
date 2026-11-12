// Run: node check.js
const assert = require("assert");
const { GENS, QUESTIONS, generationFor, cuspFor, tally, outOfRangeMessage } = require("./gen.js");

// Out-of-range years get a fun message; in-range years get none. Try every variant (rand 0, .5, .99).
for (const r of [0, 0.5, 0.99]) {
  assert.match(outOfRangeMessage(1850, 2026, () => r), /1850/);            // fossil
  assert.match(outOfRangeMessage(2030, 2026, () => r), /2030/);            // not born yet
}
assert.match(outOfRangeMessage(1900, 2026, () => 0), /fossil/);
assert.match(outOfRangeMessage(2027, 2026, () => 0), /in 1 year\./);      // singular
assert.match(outOfRangeMessage(2030, 2026, () => 0), /in 4 years\./);
assert.strictEqual(outOfRangeMessage(1901, 2026), null);
assert.strictEqual(outOfRangeMessage(2026, 2026), null);

// Every year in range maps to exactly one gen; ranges are contiguous.
for (let i = 1; i < GENS.length; i++) assert.strictEqual(GENS[i].from, GENS[i - 1].to + 1, `gap before ${GENS[i].name}`);
assert.strictEqual(generationFor(1964).key, "boomer");
assert.strictEqual(generationFor(1965).key, "x");
assert.strictEqual(generationFor(1996).key, "millennial");
assert.strictEqual(generationFor(1997).key, "z");
assert.strictEqual(generationFor(1800), null);

assert.strictEqual(cuspFor(1995).name, "Zillennial");
assert.strictEqual(cuspFor(1988), null);

assert.strictEqual(tally(["z", "z", "x"]).key, "z");
assert.strictEqual(tally(["x", "z"]).key, "x"); // tie -> older gen
assert.strictEqual(tally(["z", null, null]).key, "z"); // "I don't…" picks are ignored
assert.strictEqual(tally([null, null]), null);
// The UI relies on tally() never being null, so at least one question must have no "I don't…" option.
assert.ok(QUESTIONS.some(({ a }) => a.every(([, k]) => k)), "every question has an opt-out; quiz could end with no result");

// Every quiz answer points at a real gen, or null for "I don't…".
const keys = new Set(GENS.map(g => g.key));
for (const { a } of QUESTIONS) for (const [, k] of a) assert.ok(k === null || keys.has(k), `unknown gen key ${k}`);

console.log("all checks passed");
