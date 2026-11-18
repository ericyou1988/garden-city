# VeyraX — The Future, Accelerated

> 虚构未来电动超跑的沉浸式发布网站 Demo

## 📖 简介

VeyraX 是一个概念级纯电动超跑发布网站，采用纯代码构建的 3D 汽车模型、滚动驱动的相机编排、以及液态玻璃（Liquid Glass）UI 风格，模拟 Apple 级别的旗舰产品展示体验。

- 程序化 Three.js 超跑模型（ExtrudeGeometry + MeshPhysicalMaterial）
- 滚动驱动相机环绕 + 霓虹隧道速度感编排
- GSAP ScrollTrigger 动画 + Unreal Bloom 后处理发光
- 液态玻璃 UI（backdrop-filter + 高光折射层 + 悬停液体反应）
- 实时配置器（5 种漆面 + 3 种轮毂风格切换）
- 性能计数器动画 / 设计部件高亮标注 / 预留表单

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| **3D 渲染** | Three.js 0.160.0（Procedural Geometry + PMREM + Reflector） |
| **后期处理** | EffectComposer + UnrealBloomPass + OutputPass |
| **动画** | GSAP 3.12.5 + ScrollTrigger |
| **字体** | Google Fonts（Space Grotesk + Manrope） |
| **反射环境** | Canvas Equirectangular 程序化纹理（无外部 HDR） |
| **地面反射** | `three/addons/objects/Reflector.js` |

## ✨ 功能特性

| 功能 | 描述 |
|------|------|
| 英雄展示 | 暗光工作室场景，车身轮廓由扫光定义 |
| 性能数据 | 0–60 / 极速 / 续航 / 马力，GSAP 计数动画 |
| 设计部分 | 5 个车体部件可交互高亮，浮动标签跟随 |
| 实时配置器 | 5 种漆面颜色 + 3 种轮毂风格，即时切换 |
| 霓虹隧道 | 滚动至隧道区时，光圈环 + 速度光线涌现 |
| 预约保留 | 液态玻璃表单，提交后 Toast 反馈 |
| 响应式 | 桌面端完整交互，移动端适配布局 |

## 🎮 交互操作

- **鼠标移动** — 车体轻微倾斜，视差偏移（英雄区）
- **滚轮向下** — 相机环绕车身 → 进入隧道 → 返回
- **点击部件** — 高亮车身各区域，浮动标签显示名称
- **选择漆面** — 实时更新车身材质颜色
- **选择轮毂** — 重建车轮几何体

## 📁 文件结构

```
veyrax-launch/
└── index.html    # 单文件实现（所有 CSS/JS 内嵌）
```

## 🔗 外部依赖

- Three.js 0.160.0（unpkg CDN）
- GSAP 3.12.5 + ScrollTrigger（cdnjs CDN）
- Google Fonts（Space Grotesk + Manrope）
- stats.js（Garden City 本地，访问统计）

## 📝 开发说明

本 Demo 为单文件自包含实现，所有样式和脚本均内嵌在 `index.html` 中。汽车模型完全使用 Three.js 基础几何体（ExtrudeGeometry、CylinderGeometry、TorusGeometry 等）通过代码构建，无外部 3D 模型或贴图资源。

---

*Demo 创建于 2026-11-18*  
*创建者: Hermes Agent (Agnes)*

