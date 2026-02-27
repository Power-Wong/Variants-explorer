# VariantExplorer - 基因变异查询平台

一个基于 React + Vite + Tailwind CSS 构建的基因变异数据查询单页应用，使用 MyVariant.info API 获取变异数据。

## 功能特性

- 🔍 **搜索功能**: 支持 HGVS 标识符、rs 号等多种查询方式
- 📊 **数据展示**: 结构化展示变异的基础信息、临床意义、药物信息和预测分值
- 🎨 **现代 UI**: 深蓝色实验室风格设计，响应式布局
- 📱 **折叠面板**: 使用 Accordion 管理复杂数据，避免页面过长
- ⚡ **快速加载**: 基于 Vite 构建，开发体验极佳

## 技术栈

- **框架**: React 18 + Vite 5
- **样式**: Tailwind CSS 3
- **图标**: Lucide React
- **API**: MyVariant.info

## 本地开发

### 前置要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
cd variant-explorer
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录。

## 部署指南

### Vercel 部署 (推荐)

1. **注册 Vercel 账号**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/variant-explorer.git
   git push -u origin main
   ```

3. **在 Vercel 导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - Vercel 会自动检测 Vite 项目
   - 点击 "Deploy"

4. **等待部署完成**
   - 通常 1-2 分钟即可完成
   - 你会获得一个 `.vercel.app` 域名

### Netlify 部署

#### 方法一: Git 集成 (推荐)

1. **推送代码到 GitHub** (同上)

2. **在 Netlify 导入项目**
   - 访问 [netlify.com](https://netlify.com) 并登录
   - 点击 "Add new site" > "Import an existing project"
   - 选择你的 Git 提供商
   - 选择仓库

3. **配置构建设置**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - 点击 "Deploy site"

4. **配置重定向 (重要!)**
   
   创建 `public/_redirects` 文件:
   ```
   /*    /index.html   200
   ```

#### 方法二: 手动部署

1. **本地构建**
   ```bash
   npm run build
   ```

2. **拖拽部署**
   - 访问 [app.netlify.com/drop](https://app.netlify.com/drop)
   - 将 `dist` 文件夹拖拽到页面中
   - 等待部署完成

### GitHub Pages 部署

1. **安装 gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **修改 package.json**
   ```json
   {
     "homepage": "https://你的用户名.github.io/variant-explorer",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **修改 vite.config.js**
   ```js
   export default defineConfig({
     plugins: [react()],
     base: '/variant-explorer/',
   })
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

## 项目结构

```
variant-explorer/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Accordion.jsx      # 折叠面板组件
│   │   ├── Navbar.jsx         # 导航栏组件
│   │   ├── SearchBar.jsx      # 搜索栏组件
│   │   └── VariantResult.jsx  # 结果展示组件
│   ├── App.jsx                # 主应用组件
│   ├── main.jsx               # 入口文件
│   └── index.css              # 全局样式
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## API 参考

本项目使用 [MyVariant.info](https://myvariant.info) API:

- **端点**: `https://myvariant.info/v1/variant/{variant_id}`
- **支持格式**: HGVS, rs ID, dbSNP ID 等
- **文档**: https://myvariant.info/docs

## 使用示例

支持的查询格式:
- rs 号: `rs121434568`
- 基因组坐标: `chr7:g.55241707G>T`
- cDNA 变异: `NM_000546.5:c.743G>A`
- 蛋白变异: `NP_000537.3:p.Arg248Gln`

## 许可证

MIT License

## 致谢

- 数据来源: [MyVariant.info](https://myvariant.info)
- 图标: [Lucide](https://lucide.dev)
