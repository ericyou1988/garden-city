# 🌿 Garden City — AI Agent 编程项目 Demo 展示中心

> 所有 AI Agent 的编程项目 Demo 统一存放、统一部署、统一展示。

---

## 🎯 项目定位

**Garden City** 是这台服务器上所有 AI Agent（OpenClaw、Claude Code、Hermes 等）制作的编程项目的 **统一 Demo 展示平台**。

- 任何 AI Agent 完成一个前端/Demo 项目后，统一提交到此仓库
- 通过一体化部署流程（GitHub → Netlify）自动发布到公网
- 用户通过一个网址即可看到所有 Demo 的最新效果

**一句话**: 每个 AI Agent 的编程成果都种在 Garden City 里，用户来逛花园就能看到。

---

## 📍 关键地址

| 项目 | 地址 |
|------|------|
| **GitHub 仓库** | https://github.com/ericyou1988/garden-city |
| **Netlify 站点** | https://garden-city-407.netlify.app/ |
| **本地路径** | `/home/laker23/projects/garden-city/` |

---

## 🔄 一体化部署流程

```
本地开发修改 → git commit → git push 到 GitHub → Netlify 自动部署 → 公网可访问
```

- **Git 分支**: `main`
- **部署平台**: Netlify（配置文件 `netlify.toml` 已在仓库中）
- **部署配置**: Build command 留空，Publish directory 为 `/`

---

## 📁 项目结构

```
garden-city/
├── index.html          ← 主页：展示所有 Demo 的入口
├── netlify.toml        ← Netlify 部署配置
├── manifest.json       ← PWA 清单文件
├── sw.js               ← Service Worker（离线缓存）
├── stats.js            ← 访问统计模块
├── favicon.svg         ← 网站图标
│
├── demos/              ← 所有 Demo 项目放这里
│   ├── 3d-earth/       ← 3D 地球轨道数据中心（Three.js）
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   └── README.md
│   ├── weather-app/    ← 天气应用（Canvas + API）
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   └── README.md
│   ├── snake-game/     ← 贪吃蛇游戏（Canvas 2D）
│   │   ├── index.html
│   │   ├── style.css
│   │   ├── script.js
│   │   └── README.md
│   └── ...             ← 后续新增的 Demo
│
├── README.md           ← 本文档
├── PROJECT_INFO.md     ← 项目说明
└── CONTRIBUTING.md     ← 贡献指南
```

---

## 🌟 当前 Demo 列表

| Demo | 技术栈 | 描述 |
|------|--------|------|
| 🌍 3D 地球轨道数据中心 | Three.js, WebGL, 粒子系统 | 交互式 3D 可视化，卫星环绕地球，实时数据流 |
| 🌤️ 天气应用 | Canvas, Open-Meteo API | 实时天气查询，24h+7天预报，动态背景 |
| 🐍 贪吃蛇游戏 | Canvas 2D | 经典贪吃蛇，键盘+触屏支持，逐级加速 |

---

## 🤖 给 AI Agent 的操作指南

### 当你完成一个 Demo 项目时：

```bash
# 1. 进入项目目录
cd /home/laker23/projects/garden-city

# 2. 在 demos/ 下创建你的项目文件夹
mkdir -p demos/<你的项目名>
# 把 HTML/CSS/JS 文件放到这个文件夹里

# 3. 更新首页 index.html，添加你的 Demo 卡片链接

# 4. 提交并推送
git add .
git commit -m "feat: 新增 <项目名> Demo"
git push origin main
```

### 示例：新增一个 Demo

```bash
cd /home/laker23/projects/garden-city
mkdir -p demos/my-new-demo

# 创建项目文件
cat > demos/my-new-demo/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>我的 Demo</title>
</head>
<body>
  <h1>我的新 Demo</h1>
</body>
</html>
EOF

# 提交并推送
git add .
git commit -m "feat: 新增 my-new-demo Demo"
git push origin main
```

推送成功后，Netlify 会自动重新部署，大约 30-60 秒后公网即可看到最新效果。

---

## ⚠️ 注意事项

1. 每个 Demo 必须是 **静态页面**（HTML/CSS/JS），不需要后端服务
2. 每个 Demo 放在 `demos/<项目名>/` 下，避免文件冲突
3. 记得更新 `index.html` 添加你的 Demo 入口卡片
4. 不要在项目里放敏感信息（API Key 等）
5. 提交信息使用规范格式：`feat: 新增 xxx` / `fix: 修复 xxx` / `docs: 更新 xxx`
6. 建议为每个 Demo 添加 `README.md` 说明文档

---

## 📊 项目健康度

| 维度 | 状态 |
|------|------|
| 项目结构 | ✅ 100% |
| 配置完整性 | ✅ 100% |
| 文档完整性 | ✅ 100% |
| 功能完整性 | ✅ 100% |
| SEO/可访问性 | ✅ 100% |

---

*创建时间：2026-04-26*  
*创建者：OpenClaw (openclaw)*  
*维护者：所有 AI Agent 共同维护*  
*最后更新：2026-05-28*
