# SubsTracker React

一个现代化的订阅管理应用，使用React + Vite构建，专为Cloudflare Pages部署优化。

## ✨ 功能特性

- 🔐 **用户认证**: 安全的登录系统
- 📊 **订阅管理**: 添加、编辑、删除订阅服务
- 💰 **费用追踪**: 实时计算月度和年度支出
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🎨 **玻璃拟态UI**: 现代化的视觉效果
- ⚡ **快速加载**: 基于Vite的极速开发体验
- 🚀 **Cloudflare Pages**: 一键部署到全球CDN

## 🛠️ 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **路由**: React Router v6
- **样式**: CSS3 + 玻璃拟态设计
- **图标**: Lucide React
- **部署**: Cloudflare Pages

## 📦 项目结构

```
subtracker-react/
├── public/                 # 静态资源
├── src/
│   ├── components/          # React组件
│   │   ├── LoginPage.jsx   # 登录页面
│   │   ├── Dashboard.jsx   # 仪表板
│   │   └── *.css          # 组件样式
│   ├── App.jsx            # 主应用组件
│   ├── main.jsx           # 应用入口
│   ├── index.css          # 全局样式
│   └── App.css            # 应用样式
├── index.html             # 主HTML文件
├── package.json           # 项目配置
├── vite.config.js       # Vite配置
├── wrangler.toml         # Cloudflare配置
└── README.md            # 项目文档
```

## 🚀 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `dist/` 目录

## 🌐 部署到Cloudflare Pages

### 方法1: GitHub集成（推荐）

1. 将代码推送到GitHub仓库
2. 登录Cloudflare Dashboard
3. 进入Pages > Create a project
4. 选择GitHub仓库
5. 设置构建设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. 点击Deploy

### 方法2: 手动部署

```bash
npm run deploy
```

### 方法3: Wrangler CLI

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy dist
```

## 🎨 设计特色

### 玻璃拟态设计
- 半透明背景效果
- 现代化模糊背景
- 优雅的阴影和边框
- 流畅的动画过渡

### 响应式布局
- 移动优先设计
- 自适应网格系统
- 触摸友好的交互
- 优化的移动端体验

## 🔐 演示账号

- **邮箱**: demo@subtracker.com
- **密码**: demo123

## 🎯 功能演示

### 登录页面
- 现代化的登录界面
- 实时表单验证
- 密码显示/隐藏切换
- 加载状态指示

### 仪表板
- 订阅总览统计
- 费用计算
- 订阅卡片管理
- 添加新订阅

## 🛠️ 开发指南

### 添加新功能

1. 创建新的React组件
2. 在相应目录添加样式文件
3. 更新路由配置（如需要）
4. 测试响应式布局

### 样式指南

- 使用CSS变量保持一致性
- 遵循BEM命名规范
- 移动优先的媒体查询
- 玻璃拟态设计原则

### 性能优化

- 代码分割和懒加载
- 图片优化
- 缓存策略
- CDN加速

## 📱 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- 移动端浏览器

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🆘 支持

如有问题或建议，请通过以下方式联系：
- 提交Issue
- 发送邮件到 support@subtracker.com

---

**Built with ❤️ using React & Cloudflare Pages**