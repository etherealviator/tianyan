# 天衍 git 行为规约

> 本工作区 D:\tianyan 已 `git init`（本地版本控制，未接远程）。本文件是 Reasonix 常驻指令（AGENTS.md 机制自动加载进系统提示），天衍每个会话开始时都会读到——按此规约在关键节点自动执行版本控制，不依赖用户提醒。

## 自动提交（关键节点）

以下节点**完成后**执行 `git add -A && git commit -m "<按下方格式>"`：

1. **锻造交付完成**——L8 交付 + 锻造履历写入 vault 后
2. **天衍自我迭代**——框架/提示词修改落盘后
3. **vault 结构性操作**——清理、归档、删除、目录重组完成后
4. **知识库归元**——L9 回写领域积累后
5. **会话收尾**——对话结束前若 `git status` 有未提交改动，提交一次

## 提交信息格式

| 场景 | 格式 | 示例 |
|------|------|------|
| 锻造/交付 | `forge: {成果名} v{版本}` | `forge: 去AI味Skill v2.1` |
| 迭代/修改 | `chore: {改动摘要}` | `chore: 更新积累维度10` |
| 清理/删除 | `chore: 删除/归档 {项目}` | `chore: 删除 business-plan-generator` |
| 收尾兜底 | `auto: 会话收尾提交` | `auto: 会话收尾提交` |

## 约束

- **只提交已跟踪目录**：tianyan/、领域/、成果/、流程证据/、反馈/、.reasonix/skills/、.gitignore
- **提示词白名单例外**：`.reasonix/attachments/tianyan-prompt.xml` 与 `backup/tianyan-prompt.*.xml` 已纳入 git 跟踪（版本历史与 vault 同库可追溯）；attachments/ 其余内容（clipboard、大附件）不提交
- **不提交**：墨猫书架/、inbox/（已在 .gitignore）
- **绝不上传**（2026-08-05 泄漏事故后补充——含密钥/内网信息/机器本地属性，已加入 .gitignore）：`.obsidian/`（Obsidian 工作区+插件 data.json，含 API Key 与私钥）、`reasonix.toml`、`.mcp.json`、`obsidian-local-cert.pem`、`tianyan/obsidian-mcp-手机接入配置.md`、`tianyan/search-mcp-手机接入配置.md`。**任何 `git add -A` 前必须确认无上述文件**（`git status --short` 自查）；发现被跟踪立即 `git rm --cached` 并排查历史。
- **git 失败不阻塞主流程**：git 不可用或 commit 失败时，标注"git 提交失败：{原因}"，继续主任务
- **无改动不空提交**：`git status` 干净时跳过，不用 --allow-empty
- **敏感改动**（删除用户文件、批量移动）commit 前先展示 `git status --short` 摘要，不静默提交

## 注意

- 本文件本身是版本化资产，修改后应提交（`chore: 更新 git 行为规约`）
- 远程仓库未配置；将来接 GitHub 时用 `git remote add` 即可，无需改本规约
