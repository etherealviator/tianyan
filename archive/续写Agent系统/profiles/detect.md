# 检测模式协议

> 由 agent.prompt.md 的模态切换协议调用。
> 当系统处于 detect 模式时，执行此协议。

---

## 输入

用户提供作品文本。接受两种形式：
- 直接粘贴文本（建议单次不超过3万字，超长自动分段）
- 文件路径（若运行环境支持文件读取）

## 分析流水线

### Step 1 — 全局通读
通读全文一次，建立整体感知：类型归属、叙事基调、时间结构、基本角色谱系。
若文本存在语言障碍或内容损毁，在此步标注并决定是否中止。

### Step 2 — 10维萃取
按以下维度逐项提取特征，每维度独立分析：

| 维度 | 核心内容 | 分析方法 |
|------|---------|---------|
| style_vector | 词汇偏好、句法模式、修辞密度 | 采样开头/中间/结尾各≥300字统计 |
| narrative_params | POV、时态、叙事模式平衡 | 叙事标记词推断+全文一致性比对 |
| character_system | 角色谱系、性格坐标、关系地图 | 提取具名角色，跟踪出场+话语模式 |
| world_rules | 核心设定、已知边界、未解谜团 | 从说明段和叙事隐含中提取 |
| plot_status | 进度、活跃线、待收伏笔 | 标记所有未闭合弧线 |
| tone_atmosphere | 情感色调、幽默/阴沉、感官侧重 | 全文情感采样 |
| dialogue_signature | 标签风格、角色区分度、潜台词 | 对话段落统计分析 |
| descriptive_density | 描写风格、感官饱和度 | 描写类段落占比分析 |
| structural_patterns | 章长、节结构、开篇钩子 | 全篇结构扫描 |
| meta | 作品标签、置信度、分析日志 | 综合分析结果聚合 |

### Step 3 — 置信度标注
每字段三级：confirmed（直接文本证据）→ 1.0 / inferred（间接证据）→ 0.6 / insufficient（不足，标null）

### Step 4 — 一致性校验
检查跨维度矛盾（如风格标注文白夹杂但对话全角色口语无分化 → 输出矛盾说明）

### Step 5 — 输出与写入
组装完整YAML → 写入 `knowledge/fingerprints/{作品名}.yaml` → 更新 `knowledge/index.json`

## 指纹YAML格式

严格遵循以下结构（10个顶级字段，每字段下有子字段）：

```yaml
meta: { title, author_style_reference, genre, language, status, analysis_confidence }
style_vector: { vocabulary: { register, formality, dialect_markers, preferred_parts, taboo_vocab }, syntax: { avg_sentence_length, sentence_variance, clause_stacking, parallelism, fragment_usage, paragraph_rhythm }, rhetoric: { metaphor_density, synesthesia, irony, repetition_pattern, rhetorical_questions } }
narrative_params: { point_of_view: { type, stability, distance, unreliable, focalization }, tense_and_time: { tense, time_handling, ellipsis_style, summary_ratio }, narrative_mode_balance: { action, description, dialogue, exposition, thought } }
character_system: { characters: [{ name, role, personality_axes, speech_markers, motivation, arc_status, unresolved, relationship_map }], group_dynamics }
world_rules: { core_premises: [{ rule, type, established, unknown }], taboo_boundary, unresolved_mysteries }
plot_status: { current_progress, active_threads: [{ thread, type, last_development, next_hint, tension }], hanging_foreshadowing: [{ item, planted_at, expected_payoff }], climax_indicators, overall_arc_position }
tone_atmosphere: { dominant_register, tone_variance, humor_frequency, humor_type, gloom_index, sentimental_distance, cultural_atmosphere, sensory_focus }
dialogue_signature: { tag_style, tag_variety, interruption_pattern, dialogue_pacing, character_distinction, subtext_density, monologue_tendency }
descriptive_density: { description_style, sensory_detail_level, environment_weight, appearance_desc, action_desc_style, emotion_expression }
structural_patterns: { chapter_length, chapter_structure, chapter_ending_style, section_breaks, time_structure, hook_pattern, narrative_framing }
```

信息不足的字段标注 `null`，不允许虚构填充。

## 边界场景

| 场景 | 行为 |
|------|------|
| 连载中（30%-70%） | 正常执行，plot_status标注"基于已有章节" |
| 极短文本（<2000字） | 仅执行style_vector + 基础角色提取，其余标null，置信度上限0.5 |
| 多POV/多线 | 按POV分开标注风格，active_threads按线分列 |
| 翻译文本 | 标注source_language，句法分析置信度降级 |
| 文本噪音/损毁 | 先清洗，乱码>20%中止 |
| 语言不可识别 | 返回错误 |
| 输入<50字 | 返回错误 |
