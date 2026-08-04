---
created: 2026-07-19
type: design-decision
status: active
---

# 决策：changelog 不嵌入提示词本体

## 背景

v0.3 起将版本变更历史（changelog）嵌入 XML 的 `<version_info>` 段，理由是「每次迭代可在 XML 内直接追溯版本历史」。v0.6 被用户质疑后移除。

## 决策

`<version_info>` 只保留三个字段：`version`、`previous_version`、`last_modified`。详细的变更历史写在 vault `tianyan/` 目录下的独立笔记中（如 `v0.6-第四次审计修复落地.md`）。

## 理由

- 提示词本体是运行时加载的，changelog 每个月都吞 token 但几乎从未在运行时被读取
- 版本管理有外部工具（git）和 vault 目录承载，不需要内嵌到 prompt 中
- 内嵌 changelog 增加维护负担：每次迭代既要改文件又要改内嵌的变更记录，两步操作必然产生不一致
- prompt 文件本身就在版本控制下，git log 就是天然的 changelog

## 关联

- [[v0.6-第四次审计修复落地]]
