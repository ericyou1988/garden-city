# 贡献指南

感谢您对 Garden City 项目的关注！我们欢迎社区贡献 Demo 来丰富项目内容。

## 项目简介

Garden City 是一个 Demo 展示平台，用于展示各种创意和技术 Demo。所有 Demo 均为纯静态 HTML/CSS/JS 项目，通过 Netlify 自动部署。

## 贡献流程

### 1. Fork 仓库
点击项目页面右上角的 "Fork" 按钮，将仓库 Fork 到您的 GitHub 账号下。

### 2. 克隆仓库
```bash
git clone https://github.com/<您的用户名>/garden-city.git
cd garden-city
```

### 3. 创建新分支
```bash
git checkout -b feature/your-demo-name
```

### 4. 添加您的 Demo
在 `demos/` 目录下创建新文件夹，按照 [Demo 规范](#demo-规范要求) 添加您的 Demo 文件。

### 5. 提交更改
```bash
git add .
git commit -m "feat: 添加 <Demo 名称> Demo"
```

### 6. 推送并创建 PR
```bash
git push origin feature/your-demo-name
```
然后在 GitHub 上创建 Pull Request。

## Demo 规范要求

### 目录结构
```
demos/
└── your-demo-name/
    ├── index.html          # 主入口文件（必需）
    ├── style.css           # 样式文件（可选）
    ├── script.js           # 脚本文件（可选）
    └── assets/             # 资源文件夹（可选）
```

### 必需文件
- `index.html`：Demo 的主入口文件
- 所有资源文件必须使用相对路径引用

### 技术限制
- 纯静态项目：仅使用 HTML、CSS、JavaScript
- 不得依赖后端服务或数据库
- 不得使用需要构建工具的语言（如 TypeScript、Sass 等需编译的语言）
- 外部 CDN 资源需确保可访问性

### 命名规范
- 文件夹名称使用小写字母和连字符（kebab-case）
- 示例：`3d-earth`、`color-palette`、`clock-widget`

## 代码风格指南

### HTML
- 使用语义化标签
- 保持缩进一致（推荐 2 个空格）
- 添加必要的注释

### CSS
- 使用外部样式表
- 类名使用 kebab-case
- 避免使用 !important

### JavaScript
- 使用 ES6+ 语法
- 保持代码简洁可读
- 添加必要注释
- 避免全局变量污染

## 提交信息格式

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>: <description>

[optional body]

[optional footer]
```

### 类型（Type）
- `feat`：新增功能或 Demo
- `fix`：修复问题
- `docs`：文档更新
- `style`：代码格式调整（不影响功能）
- `refactor`：代码重构
- `test`：测试相关
- `chore`：构建/工具相关

### 示例
```
feat: 添加 3D 地球 Demo

- 实现 WebGL 3D 地球渲染
- 支持鼠标交互旋转
- 响应式设计适配移动端

Closes #4
```

## Issue 模板

如果您想提交新的 Demo 建议，请使用 [Demo 提交模板](/.github/ISSUE_TEMPLATE/demo-submission.md)。

## Pull Request 模板

创建 PR 时，请使用 PR 模板填写必要信息。

## 问题反馈

如有任何问题或建议，欢迎通过 Issue 反馈。

## 许可证

贡献的代码将遵循项目的开源许可证。