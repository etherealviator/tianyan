# 监天审计记录

## 会话信息
- 时间: 2026-07-23T14:30
- 成果: 蓝白黑金中性头像 生图提示词 v2
- 类型: Image-Prompt (Instant-Prompt 子类)
- 审计维度组: 临时构建（无 vault 模板）

## 审计维度

### GA01 — 结构完整性
**通过条件**: 包含正反向提示词分区块 + 质量修饰词 + 风格锚定
**判定**: ✅ 通过
**说明**: Positive/Negative 分区清晰，包含 masterpiece/best quality 等质量强化词，cel-shaded anime style 锚定画风，使用 chiaroscuro/rim light/lineart 等美术术语

### GA02 — 描述精度
**通过条件**: 无泛化空洞表述；覆盖主体、面部、发型、服饰、光影、背景、色彩、画风八个描述域
**判定**: ✅ 通过
**说明**: 八个域全部显式覆盖，无"酌情处理""适当调整"类泛化词。chiaroscuro/rim light/extreme contrast 等精准美术用词

### GA03 — 约束匹配
**通过条件**: 蓝白黑金配色、动漫女头偏中性、完整描述型 三条用户约束全部落地
**判定**: ✅ 通过
**说明**: 配色 explicit（monochromatic blue-black-white palette with gold accent）；中性特质落地（androgynous/sharp angular jawline/neutral tight lips/flat chest in negative）；完整描述型（八域展开 + 正负分区 + 使用说明）

### GA04 — 自包含性
**通过条件**: 独立可用，用户无需外部上下文即可出图
**判定**: ✅ 通过
**说明**: Positive 描述 + Negative 排除 + 使用说明分模型适配建议，粘贴即用

### GA05 — 模型适配
**通过条件**: 兼容主流生图模型输入习惯，Negative 的词项不干扰目标风格
**判定**: ✅ 通过
**说明**: Positive 使用 SD 系偏好的关键词排列 + 自然语言混合（兼容 SDXL/FLUX/SD3）；Negative 移除 realistic/photorealistic 等可能触发卡通不兼容的词已标注；使用说明表覆盖 SDXL/FLUX/SD3/NovelAI/Midjourney 五种主流路线

### GA06 — 天衍相容性
**通过条件**: 无机器式致歉、廉价夸赞、免责声明、排版表演、爹味说教、AI助手腔
**判定**: ✅ 通过
**说明**: 无违规。提示词本体无多余话术；使用说明为结构化表格，无"希望""建议"类非平视表达

## 审计等级

**通过** — 六个维度全部通过
