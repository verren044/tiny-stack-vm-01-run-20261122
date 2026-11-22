import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
function run(p: Uint8Array, q: Uint8Array): [number, Uint8Array] {
  const D = new Int32Array(256), C = new Int32Array(64), M = new Int32Array(256);
  const o = new Uint8Array(65536);
  let s = 0, c = 0, pc = 0, st = 0, ol = 0, ip = 0;
  const done = (e: number): [number, Uint8Array] => [e, o.slice(0, ol)];
  for (;;) {
    if (st === 1000000) return done(10);
    if (pc < 0 || pc >= p.length) return done(9);
    const op = p[pc];
    const ok = op < 8 || (op >= 16 && op <= 30) || (op >= 32 && op <= 34) || (op >= 48 && op <= 52) || op === 64 || op === 65 || (op >= 80 && op <= 83);
    if (!ok) return done(5);
    const imm = op === 1 ? 1 : op === 2 ? 4 : op >= 48 && op <= 51 ? 2 : 0;
    if (pc + imm >= p.length) return done(9);
    st++;
    const nx = pc + 1 + imm;
    const bin = (op >= 16 && op <= 22) || (op >= 24 && op <= 26) || (op >= 28 && op <= 30) || (op >= 32 && op <= 34);
    const pops = op === 7 ? 3 : op === 5 || op === 6 || bin || op === 65 ? 2 : op === 3 || op === 4 || op === 23 || op === 27 || op === 49 || op === 50 || op === 64 || op === 80 || op === 81 || op === 83 ? 1 : 0;
    const push = op === 6 || op === 7 ? 3 : op === 4 || op === 5 ? 2 : op === 1 || op === 2 || op === 23 || op === 27 || bin || op === 64 || op === 82 ? 1 : 0;
    if (s < pops) return done(2);
    if (s - pops + push > 256) return done(3);
    pc = nx;
    if (op === 0) return done(0);
    if (op === 1) { D[s++] = (p[nx - 1] << 24) >> 24; continue; }
    if (op === 2) { D[s++] = p[nx - 4] | (p[nx - 3] << 8) | (p[nx - 2] << 16) | (p[nx - 1] << 24); continue; }
    if (op === 3) { s--; continue; }
    if (op === 4) { D[s] = D[s - 1]; s++; continue; }
    if (op === 5) { const t = D[s - 1]; D[s - 1] = D[s - 2]; D[s - 2] = t; continue; }
    if (op === 6) { D[s] = D[s - 2]; s++; continue; }
    if (op === 7) { const a = D[s - 3]; D[s - 3] = D[s - 2]; D[s - 2] = D[s - 1]; D[s - 1] = a; continue; }
    if (bin) {
      const b = D[s - 1], a = D[s - 2];
      let r: number;
      if (op === 16) r = (a + b) | 0;
      else if (op === 17) r = (a - b) | 0;
      else if (op === 18) r = Math.imul(a, b);
      else if (op === 19) { if (!b) return done(4); r = a === -2147483648 && b === -1 ? a : (a / b) | 0; }
      else if (op === 20) { if (!b) return done(4); r = b === -1 ? 0 : (a % b) | 0; }
      else if (op === 21) { if (!b) return done(4); r = Math.floor((a >>> 0) / (b >>> 0)) | 0; }
      else if (op === 22) { if (!b) return done(4); r = ((a >>> 0) % (b >>> 0)) | 0; }
      else if (op === 24) r = a & b;
      else if (op === 25) r = a | b;
      else if (op === 26) r = a ^ b;
      else if (op === 28) r = a << (b & 31);
      else if (op === 29) r = a >> (b & 31);
      else if (op === 30) r = (a >>> (b & 31)) | 0;
      else if (op === 32) r = a === b ? 1 : 0;
      else if (op === 33) r = a < b ? 1 : 0;
      else r = (a >>> 0) < (b >>> 0) ? 1 : 0;
      s -= 2; D[s++] = r; continue;
    }
    if (op === 23) { D[s - 1] = (-D[s - 1]) | 0; continue; }
    if (op === 27) { D[s - 1] = ~D[s - 1]; continue; }
    if (op >= 48 && op <= 50) {
      const rel = ((p[nx - 2] | (p[nx - 1] << 8)) << 16) >> 16;
      let take = true;
      if (op !== 48) { const v = D[--s]; take = op === 49 ? v === 0 : v !== 0; }
      if (take) pc = nx + rel;
      continue;
    }
    if (op === 51) { if (c === 64) return done(7); C[c++] = nx; pc = p[nx - 2] | (p[nx - 1] << 8); continue; }
    if (op === 52) { if (!c) return done(8); pc = C[--c]; continue; }
    if (op === 64) { const a = D[s - 1]; if (a < 0 || a > 255) return done(6); D[s - 1] = M[a]; continue; }
    if (op === 65) { const a = D[s - 1], v = D[s - 2]; if (a < 0 || a > 255) return done(6); s -= 2; M[a] = v; continue; }
    if (op === 80) {
      const t = String(D[s - 1]);
      if (ol + t.length > 65536) return done(11);
      s--;
      for (let i = 0; i < t.length; i++) o[ol++] = t.charCodeAt(i);
      continue;
    }
    if (op === 81) { if (ol + 1 > 65536) return done(11); o[ol++] = D[--s] & 255; continue; }
    if (op === 82) { D[s++] = ip < q.length ? q[ip++] : -1; continue; }
    return done(D[--s] & 255);
  }
}
for (const id of readdirSync(I).sort()) {
  let p: Buffer, q: Buffer;
  try { p = readFileSync(join(I, id, 'program.bin')); } catch { p = Buffer.alloc(0); }
  try { q = readFileSync(join(I, id, 'input.bin')); } catch { q = Buffer.alloc(0); }
  const [code, out] = run(new Uint8Array(p), new Uint8Array(q));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'stdout.bin'), out);
  writeFileSync(join(O, id, 'exit.txt'), `${code}\n`);
}
