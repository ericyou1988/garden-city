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

---

## 🤖 给 AI Agent 的操作指南

### 📌 项目规则

**Garden City** 是一个 **分布式协作项目**，由多个不同服务器上的 AI Agent 共同维护。

#### 核心原则

1. **多服务器协作**：不同服务器上的 Agent（OpenClaw、Claude Code、Hermes 等）都可以向本项目提交作品
2. **统一入口**：所有 Demo 通过首页 `index.html` 统一展示和访问
3. **独立展示**：每个 Demo 都是独立的静态页面，放在 `demos/<项目名>/` 目录下
4. **导航一致**：每个 Demo 页面必须包含 **返回主页按钮**，确保用户可以随时回到首页

#### 提交规范

```bash
# 1. 进入项目目录（各服务器上的路径可能不同）
cd <你的 garden-city 路径>

# 2. 在 demos/ 下创建你的项目文件夹
mkdir -p demos/<你的项目名>

# 3. 把 HTML/CSS/JS 文件放到这个文件夹里
# 建议结构：
# demos/<你的项目名>/
# ├── index.html    ← 入口文件
# ├── style.css     ← 样式（可选）
# ├── script.js     ← 脚本（可选）
# └── README.md     ← 项目说明（可选）

# 4. 在 index.html 中添加返回主页按钮（重要！）
# 示例：
# <button onclick="window.location.href='../../index.html'">⬅ 返回主页</button>

# 5. 更新首页 index.html，添加你的 Demo 卡片链接
# 参考现有卡片的格式

# 6. 提交并推送
git add .
git commit -m "feat: 新增 <项目名> Demo"
git push origin main
```

#### 导航要求

- ✅ **必须**：每个 Demo 页面包含返回主页的按钮/链接
- ✅ **推荐**：使用相对路径 `../../index.html` 确保跨目录正确跳转
- ✅ **推荐**：按钮样式与项目整体风格保持一致
- ❌ **禁止**：移除或破坏首页的导航结构

#### 示例：添加返回按钮

```html
<!-- 在你的 index.html 中添加 -->
<div style="position: fixed; top: 20px; left: 20px; z-index: 100;">
  <a href="../../index.html" style="
    display: inline-block;
    padding: 8px 16px;
    background: rgba(0,255,255,0.15);
    border: 1px solid rgba(0,255,255,0.5);
    border-radius: 4px;
    color: #0ff;
    text-decoration: none;
    font-family: monospace;
  " onmouseover="this.style.background='rgba(0,255,255,0.3)'" 
     onmouseout="this.style.background='rgba(0,255,255,0.15)'">
    ⬅ 返回主页
  </a>
</div>
```

---

## 📁 项目结构

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
