# GlassBento Login Page

现代化的登录页面，采用Sass预处理器和模块化的JavaScript架构。

## 项目结构

```
demo-cloudflare-project/
├── assets/
│   ├── css/
│   │   ├── style-login.scss    # Sass源文件
│   │   └── style-login.css     # 编译后的CSS
│   └── js/
│       └── login.js            # 模块化JavaScript
├── src/
│   └── index.html              # 主HTML文件
├── package.json                # 项目配置和依赖
└── README.md
```

## 特性

- **Sass预处理器**: 使用变量、嵌套、混合等高级特性
- **模块化JavaScript**: 面向对象的代码结构，易于维护
- **响应式设计**: 适配移动设备
- **玻璃拟态UI**: 现代化的视觉效果
- **无障碍支持**: 语义化HTML和ARIA属性

## 安装和开发

### 1. 安装依赖
```bash
npm install
```

### 2. 开发模式（自动编译Sass）
```bash
npm run dev
```

### 3. 生产构建
```bash
npm run build
```

### 4. 本地预览
```bash
npm run serve
```

## Sass特性

- **变量系统**: 颜色、间距、字体大小统一管理
- **嵌套规则**: 更好的CSS组织结构
- **混合宏**: 可复用的样式块
- **响应式**: 移动端优先的设计
- **动画**: 平滑的过渡效果

## JavaScript特性

- **ES6+语法**: 使用class、async/await等现代语法
- **错误处理**: 完善的错误捕获和用户反馈
- **表单验证**: 客户端输入验证
- **加载状态**: 用户友好的加载指示器
- **事件管理**: 清晰的事件绑定和解绑

## 部署到Cloudflare Pages

1. 将代码推送到GitHub
2. 在Cloudflare Pages中连接GitHub仓库
3. 设置构建设置：
   - 构建命令: `npm run build`
   - 输出目录: `src`
4. 部署并享受全球CDN加速！

## 自定义

### 修改主题颜色
编辑 `assets/css/style-login.scss` 中的变量：
```scss
$primary-gradient-start: #667eea;
$primary-gradient-end: #764ba2;
```

### 添加新功能
扩展 `assets/js/login.js` 中的 `LoginManager` 类。