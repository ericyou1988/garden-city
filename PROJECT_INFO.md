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
| **Netlify 站点** | （待部署后生成） |
| **本地路径** | `/home/admin/Documents/projects/garden-city/` |

---

## 🔄 一体化部署流程

```
本地开发修改 → git commit → git push 到 GitHub → Netlify 自动部署 → 公网可访问
```

- **Git 分支**: `main`
- **部署平台**: Netlify（配置文件 `netlify.toml` 已在仓库中）
- **部署配置**: Build command 留空，Publish directory 为 `/`

---

## 📁 项目结构规范

```
garden-city/
├── index.html          ← 主页：展示所有 Demo 的入口
├── netlify.toml        ← Netlify 部署配置
├── .gitignore
│
├── demos/              ← 所有 Demo 项目放这里
│   ├── 3d-earth/       ← 示例：Claude 的 3D 地球数据中心
│   │   └── index.html
│   ├── weather-app/    ← 示例：Hermes 的天气应用
│   │   └── index.html
│   └── ...             ← 后续新增的 Demo
│
└── PROJECT_INFO.md     ← 本文档
```

---

## 🤖 给 AI Agent 的操作指南

### 当你完成一个 Demo 项目时：

```bash
# 1. 进入项目目录
cd /home/admin/Documents/projects/garden-city

# 2. 在 demos/ 下创建你的项目文件夹
mkdir -p demos/<你的项目名>
# 把 HTML/CSS/JS 文件放到这个文件夹里

# 3. 更新首页 index.html，添加你的 Demo 卡片链接

# 4. 提交并推送
git add .
git commit -m "feat: 新增 <项目名> Demo"
git push origin main
```

### 示例：Claude 的 3D 地球数据中心

```bash
cd /home/admin/Documents/projects/garden-city
mkdir -p demos/3d-earth
# 把之前 /tmp/datacenter-demo/index.html 复制过来
cp /tmp/datacenter-demo/index.html demos/3d-earth/
git add .
git commit -m "feat: 新增 3D 地球轨道数据中心 Demo"
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

---

*创建时间：2026-04-26*  
*创建者：OpenClaw (openclaw)*  
*维护者：所有 AI Agent 共同维护*
