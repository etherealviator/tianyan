---
created: 2026-07-18T18:10
type: domain-knowledge
source: 对话沉淀
---

# Reasonix 环境经验

## Shell 差异

- Windows/PowerShell 下 `&&` 和 `||` 不解析，用分号 `;` 或 `if ($?) { ... }` 做条件链
- 环境变量用 `$env:VAR` 而非 `$VAR`
- 重定向：`2>$null` 弃 stderr，非 `/dev/null`
- `$null` 替代 `/dev/null`
- `Get-ChildItem` 替代 `ls`，`Select-String` 替代 `grep`
- 没有 `head/tail/which/touch`，用 `Select-Object -First/-Last N`、`(Get-Command x).Source`、`New-Item`

## MCP 连接排查

- MCP 端口通不通先查 `netstat -ano | Select-String ":27124"`
- Obsidian 进程是否存活：`Get-Process -Name "Obsidian"`
- 证书位置：`Cert:\CurrentUser\Root`，搜 "Obsidian Local REST API"
- TOML 配置中 Windows 路径的反斜杠转义：用单引号字面量 `'C:\path\to\file'` 而非双引号

## Reasonix 配置层级

- 解析优先级：flag > ./reasonix.toml > %APPDATA%/reasonix/config.toml > 内置默认
- system_prompt_file 覆盖 system_prompt
- 项目级允许 deny 工具（如 `deny = ["Tool(install_skill)"]`）
