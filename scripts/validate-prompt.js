#!/usr/bin/env node
/**
 * 天衍提示词结构校验器
 * 用法: node scripts/validate-prompt.js [--baseline <file>] [--target <file>]
 * 默认目标: core/tianyan-prompt.xml
 * 退出码: 0=通过 1=失败
 * 功能: XML配对 / 顶层结构 / 已废除术语残留 / checklist编号连续性 / 版本字段 / 基线回归对比
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const targetIdx = args.indexOf('--target');
const baseIdx = args.indexOf('--baseline');
const TARGET = targetIdx >= 0 ? args[targetIdx + 1] : path.join(ROOT, 'core', 'tianyan-prompt.xml');
const BASELINE = baseIdx >= 0 ? args[baseIdx + 1] : null;

let errors = 0;
const problems = [];
const warn = (msg) => { problems.push(msg); };

// ---------- 1. 读取 ----------
let src;
try {
  src = fs.readFileSync(TARGET, 'utf8');
} catch (e) {
  console.error('FAIL: 无法读取目标文件', TARGET);
  process.exit(1);
}

// ---------- 2. XML 标签配对 ----------
const tags = [];
const re = /<(\/?)([a-z_][a-z0-9_]*)((?:\s[^>]*)?)\/?>/g;
let m;
while ((m = re.exec(src)) !== null) {
  if (m[1] === '/') tags.push({ type: 'close', name: m[2] });
  else if (m[3].trim().endsWith('/')) tags.push({ type: 'self', name: m[2] });
  else tags.push({ type: 'open', name: m[2] });
}
const stack = [];
let pairErr = 0;
for (const t of tags) {
  if (t.type === 'open') stack.push(t.name);
  else if (t.type === 'close') {
    const top = stack.pop();
    if (top !== t.name) { warn(`XML配对错: 期望 </${top}> 实际 </${t.name}>`); pairErr++; }
  }
}
if (stack.length) { warn(`未闭合标签: ${stack.slice(-5).join(',')}`); pairErr += stack.length; }
if (pairErr) errors += pairErr;

// ---------- 3. 顶层标签结构 ----------
const TOP_LEVEL = ['role_objective', 'forge_integrity', 'version_info', 'environment_profile',
  'intent_purifier', 'instruction_classifier', 'complexity_judge', 'cognitive_laws',
  'behavior_protocols', 'anchor_protocol', 'dimension_knowledge_base', 'active_cog_engine',
  'deep_forge_protocol', 'routing_matrix', 'output_format', 'delivery_quality',
  'self_consistency_audit', 'initialization'];
const missing = TOP_LEVEL.filter((t) => !new RegExp(`^<${t}>`, 'm').test(src.replace(/^\uFEFF/, '')));
if (missing.length) { warn(`顶层标签缺失: ${missing.join(',')}`); errors += missing.length; }

// ---------- 4. 已废除术语残留 ----------
const DEPRECATED = ['分类器', '判断器', '评估器', '照明', '意图共振', '黄金3条', '老友先导',
  '三层降级链', 'polarity_extraction', 'item 19', 'item 17', 'item 20', 'item 0',
  'boundary_with_layer8', '子agent审计'];
for (const w of DEPRECATED) {
  const n = (src.match(new RegExp(w, 'g')) || []).length;
  if (n) { warn(`已废除术语残留「${w}」×${n}`); errors += n; }
}

// ---------- 5. checklist 编号连续性 ----------
const ids = (src.match(/<item id="\d+"/g) || []).map((x) => parseInt(x.match(/\d+/)[0], 10));
const sorted = [...ids].sort((a, b) => a - b);
const continuous = sorted.length && sorted.every((v, i) => v === i + 1);
if (!continuous) { warn(`checklist 编号不连续: [${ids.join(',')}]`); errors++; }

// ---------- 6. 版本字段 ----------
const ver = src.match(/<version>([^<]*)<\/version>/);
const prev = src.match(/<previous_version>([^<]*)<\/previous_version>/);
const mod = src.match(/<last_modified>([^<]*)<\/last_modified>/);
if (!ver || !prev || !mod) { warn('version_info 字段缺失'); errors++; }

// ---------- 7. 基线回归对比 ----------
if (BASELINE) {
  try {
    const base = fs.readFileSync(BASELINE, 'utf8');
    const baseTags = (base.match(/<(\/?)[a-z_][a-z0-9_]*/g) || []).length;
    console.log(`基线回归: 标签 ${baseTags} → ${tags.length}（${tags.length >= baseTags ? '+' : ''}${tags.length - baseTags}）`);
    console.log(`基线回归: 字节 ${Buffer.byteLength(base, 'utf8')} → ${Buffer.byteLength(src, 'utf8')}（${Buffer.byteLength(src, 'utf8') - Buffer.byteLength(base, 'utf8') >= 0 ? '+' : ''}${Buffer.byteLength(src, 'utf8') - Buffer.byteLength(base, 'utf8')}）`);
  } catch (e) {
    warn(`基线读取失败: ${BASELINE}`);
    errors++;
  }
}

// ---------- 8. 输出 ----------
console.log('════════════════════════════════════');
console.log(`天衍提示词结构校验 — ${path.basename(TARGET)}`);
console.log(`标签总数: ${tags.length}（开 ${tags.filter((t) => t.type === 'open').length} / 闭 ${tags.filter((t) => t.type === 'close').length} / 自闭合 ${tags.filter((t) => t.type === 'self').length}）`);
if (ver) console.log(`版本: ${ver[1]} (prev ${prev[1]}, ${mod[1]})`);
console.log(`checklist item: ${ids.join(',')}${continuous ? ' ✓连续' : ' ✗'}`);
console.log('────────────────────────────────────');
if (problems.length === 0) {
  console.log('✓ 通过：无结构错误、无残留、编号连续');
  process.exit(0);
} else {
  console.log(`✗ 失败：${problems.length} 个问题`);
  problems.forEach((p) => console.log('  -', p));
  process.exit(1);
}
