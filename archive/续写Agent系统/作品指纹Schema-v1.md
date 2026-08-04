# 作品指纹 Schema v1

> 续写Agent双体系统的核心数据结构。检测Agent的输出格式，续写Agent的塌缩输入。
> 状态：已固化（当前对话锻造产出）

---

## 结构总览

```
作品指纹/
├── meta                  # 元信息
├── style_vector          # 风格向量（语言层）
├── narrative_params      # 叙事参数（叙事层）
├── character_system      # 角色系统
├── world_rules           # 世界观规则集
├── plot_status           # 剧情状态寄存器
├── tone_atmosphere       # 基调与氛围
├── dialogue_signature    # 对话特征
├── descriptive_density   # 描写密度
└── structural_patterns   # 结构模式
```

---

## 一、meta — 元信息

```yaml
title:                   # 作品名称（已知时）
author_style_reference:  # 作者风格标注（如：残雪/余华/村上春树调性）
language:                # 语言
genre:                   # 类型（玄幻/科幻/现实主义/推理/等，允许多标签）
status:                  # 已完成 / 连载中 / 片段
analysis_confidence:     # 检测Agent对本指纹的整体置信度 0.0-1.0
analysis_date:           # 分析日期
source_text_span:        # 分析依据的文本范围（起止章节/字数）
```

## 二、style_vector — 风格向量

词汇层、句法层、修辞层的特征参数。

```yaml
vocabulary:
  register:              # 语域：文白/口语/书面/诗化/网络/混合
  formality:             # 正式度 0.0-1.0
  dialect_markers:       # 方言/俚语特征词列表（若有）
  preferred_parts:       # 偏好词类（如：动词密集/形容词节制/成语偏好）
  taboo_vocab:           # 该作品中回避的词汇类别

syntax:
  avg_sentence_length:   # 平均句长（字）
  sentence_variance:     # 句长方差 0.0-1.0（0为均匀，1为极悬殊）
  clause_stacking:       # 复句嵌套倾向 0.0-1.0
  parallelism:           # 排比/对仗使用频率 0.0-1.0
  fragment_usage:        # 不完整句（省略句/独词句）频率 0.0-1.0
  paragraph_rhythm:      # 段长模式：短段密集/长段铺陈/长短交替

rhetoric:
  metaphor_density:      # 隐喻密度 0.0-1.0
  synesthesia:           # 通感使用频率 0.0-1.0
  irony:                 # 反讽/幽默倾向 0.0-1.0
  repetition_pattern:    # 重复修辞（排比/复沓/回环）使用倾向
  rhetorical_questions:  # 反问/设问频率 0.0-1.0
```

## 三、narrative_params — 叙事参数

```yaml
point_of_view:
  type:                  # 第一人称/第三人称有限/第三人称全知/第二人称/多POV
  stability:             # POV稳定性：固定 / 切换（标注切换频率）
  distance:              # 叙事距离：贴近/中等/疏离
  unreliable:            # 是否存疑叙事者  true/false
  focalization:          # 聚焦人物（若有限视角，标注是谁的眼睛）

tense_and_time:
  tense:                 # 时态倾向（中英文通用）：过去/现在/混合
  time_handling:         # 时间处理：线性/倒叙/插叙/多线并行
  ellipsis_style:        # 时间跳跃的处理方式：空行/章节断/顺滑过渡
  summary_ratio:         # 概述（summary）vs 场景（scene）比例 0.0-1.0

narrative_mode_balance:
  action:                # 动作叙述占比 0.0-1.0
  description:           # 描写占比 0.0-1.0
  dialogue:              # 对话占比 0.0-1.0
  exposition:            # 说明/背景交代占比 0.0-1.0
  thought:               # 内心独白/心理活动占比 0.0-1.0
```

## 四、character_system — 角色系统

```yaml
characters:
  - name:                # 角色名
    role:                # 主角/配角/反派/关键NPC/龙套
    personality_axes:    # 性格坐标（如：外倾-内倾 / 理性-感性 / 守序-混乱）
    speech_markers:      # 语言特征（口头禅/句式偏好/语气词）
    motivation:          # 当前驱动力（已知时）
    arc_status:          # 成长弧完成度 0.0-1.0（0=刚出场，1=已完成转变）
    unresolved:          # 该角色未解决的个人线（若有）
    relationship_map:    # 与其他角色的关系索引（角色名: 关系类型）
  - ...                  # 每个角色一条

group_dynamics:          # 角色群体会话时的互动模式（若有）
```

## 五、world_rules — 世界观规则集

```yaml
core_premises:          # 基干设定
  - rule:               # 规则陈述
    type:               # 物理/魔法/社会/超自然/科技
    established:        # 已确认的边界/限制
    unknown:            # 该规则中尚未揭秘的部分（若有）

taboo_boundary:         # 该作品中不会出现的设定方向（潜在禁区）
unresolved_mysteries:   # 未揭示的世界观谜团（每条标注是否为核心谜题）
```

## 六、plot_status — 剧情状态寄存器

```yaml
current_progress:        # 当前进度描述（如：第三卷中段/总进度约45%）
active_threads:          # 活跃剧情线列表
  - thread:              # 线名
    type:                # 主线/支线/感情线/暗线
    last_development:    # 最近一次进展
    next_hint:           # 已有的伏笔/线索/预告（若有）
    tension:             # 当前张力 0.0-1.0

hanging_foreshadowing:   # 已埋未收的伏笔清单
  - item:                # 伏笔内容
    planted_at:          # 埋设位置
    expected_payoff:     # 预期揭晓方向（若有线索）

climax_indicators:       # 高潮信号（若有：节奏加快/冲突密集/释放前压）
overall_arc_position:    # 总故事弧位置：开篇/发展/转折/高潮/尾声
```

## 七、tone_atmosphere — 基调与氛围

```yaml
dominant_register:       # 主导情感色调（悲怆/沉郁/诙谐/温暖/冷峻/激昂）
tone_variance:           # 调性变化幅度 0.0-1.0（0=从头到尾一个调）
humor_frequency:         # 幽默频率 0.0-1.0
humor_type:              # 幽默类型（冷幽默/讽刺/恶搞/黑色/无）
gloom_index:             # 阴沉度 0.0-1.0
sentimental_distance:    # 情感沉浸 vs 冷静疏离 0.0-1.0
cultural_atmosphere:     # 文化氛围标签（中式仙侠/赛博朋克/北欧冷调/等）
sensory_focus:           # 感官侧重：视觉/听觉/触觉/综合
```

## 八、dialogue_signature — 对话特征

```yaml
tag_style:               # 说话标签风格：大量tag/精简tag/无tag（靠内容区分）
tag_variety:             # 标签用词丰富度（说/道/问/嚷/嘟囔/等）
interruption_pattern:    # 对话打断/重叠的频率
dialogue_pacing:         # 对话节奏：一来一回快节奏 / 长篇独白式 / 混合
character_distinction:   # 角色间语言区分度 0.0-1.0
subtext_density:         # 潜台词密度 0.0-1.0（话里有话的程度）
monologue_tendency:      # 独白/内心戏在对话中的穿插频率
```

## 九、descriptive_density — 描写密度

```yaml
description_style:       # 白描/工笔/意象/印象派/极简旁白
sensory_detail_level:    # 感官细节饱和度 0.0-1.0
environment_weight:      # 环境描写占比 0.0-1.0
appearance_desc:         # 外貌描写风格（系统/特征点缀/不写）
action_desc_style:       # 动作描写（电影感/写实/写意）
emotion_expression:      # 情绪表达方式：直抒/暗示/通过动作/留白
```

## 十、structural_patterns — 结构模式

```yaml
chapter_length:          # 典型章节字数范围
chapter_structure:       # 章内结构（起承转合/三段式/意识流/碎片拼接）
chapter_ending_style:    # 章末收束方式（悬念钩子/自然收束/总结性）
section_breaks:          # 章节内分段方式（空行/***/连续文本）
time_structure:          # 时间结构：线性/环形/多线交织
hook_pattern:            # 开篇钩子模式（设悬念/场景切入/哲理语录/即时动作）
narrative_framing:       # 是否有嵌套叙事/文中文/回忆框架
```

---

## 文件存储约定

- 文件位置：`知识库/作品指纹/{作品名简写}.yaml`
- 编码：UTF-8
- 更新策略：检测Agent每次分析时全量覆写，不增量追加
- 缺省规则：所有字段在信息不足时标注 `null` 并在上层标注置信度，不允许虚构填充
