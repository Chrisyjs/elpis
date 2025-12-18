# Elpis 项目 Wiki

## 📋 目录
- [项目概述](#项目概述)
- [技术架构](#技术架构)
- [项目结构](#项目结构)
- [核心模块](#核心模块)
- [开发指南](#开发指南)
- [API 文档](#api-文档)
- [部署指南](#部署指南)
- [常见问题](#常见问题)

## 🚀 项目概述

**Elpis** 是一个企业级应用框架，基于 Node.js 和 Koa.js 构建，提供了完整的全栈开发解决方案。

### 主要特性
- 🏗️ **模块化架构**: 基于约定的目录结构和自动加载机制
- 🔧 **插件化设计**: 支持中间件、控制器、服务等模块的自动加载
- 🎯 **统一错误处理**: 内置全局异常处理机制
- 📦 **开箱即用**: 预配置开发和生产环境
- 🔄 **热重载**: 支持开发环境下的自动重启

### 技术栈
- **后端**: Node.js + Koa.js
- **前端**: Vue.js 3 + Element Plus + Pinia
- **构建工具**: Webpack 5
- **数据库**: MySQL (通过 Knex.js)
- **日志**: Log4js
- **认证**: JWT

## 🏛️ 技术架构

### 整体架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端 (Vue.js)  │ ←→ │  API 层 (Koa)   │ ←→ │  数据层 (MySQL) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │ Elpis Core 框架  │
                       └─────────────────┘
```

### 核心设计模式
- **MVC 模式**: Controller → Service → Model 的分层架构
- **依赖注入**: 通过 app 实例进行模块间通信
- **约定优于配置**: 基于目录结构的自动加载机制

## 📁 项目结构

```
elpis/
├── app/                          # 应用业务代码
│   ├── controller/               # 控制器层
│   │   ├── base.js              # 基础控制器
│   │   ├── project.js           # 项目控制器
│   │   └── view.js              # 视图控制器
│   ├── service/                 # 服务层
│   │   ├── base.js              # 基础服务
│   │   └── project.js           # 项目服务
│   ├── middleware/              # 中间件
│   │   ├── api-params-verify.js # API 参数验证
│   │   ├── api-sign-verify.js   # API 签名验证
│   │   └── error-handle.js      # 错误处理
│   ├── router/                  # 路由配置
│   │   ├── project.js           # 项目路由
│   │   └── view.js              # 视图路由
│   ├── router-schema/           # 路由模式定义
│   ├── view/                    # 视图模板
│   ├── webpack/                 # Webpack 配置
│   ├── pages/                   # 前端页面
│   └── public/                  # 静态资源
├── elpis-core/                  # 框架核心
│   ├── index.js                 # 框架入口
│   ├── env.js                   # 环境配置
│   └── loader/                  # 自动加载器
│       ├── config.js            # 配置加载器
│       ├── controller.js        # 控制器加载器
│       ├── extend.js            # 扩展加载器
│       ├── middleware.js        # 中间件加载器
│       ├── router.js            # 路由加载器
│       ├── router-schema.js     # 路由模式加载器
│       └── service.js           # 服务加载器
├── config/                      # 配置文件
│   ├── config.default.js        # 默认配置
│   ├── config.beta.js           # 测试环境配置
│   └── config.prod.js           # 生产环境配置
├── index.js                     # 应用入口
└── package.json                 # 项目配置
```

## 🔧 核心模块

### 1. Elpis Core 框架

**位置**: `elpis-core/index.js`

框架的核心启动模块，负责：
- Koa 应用实例创建
- 环境配置初始化
- 各种加载器的顺序执行
- 服务器启动

**启动流程**:
```javascript
1. 创建 Koa 实例
2. 设置应用配置和路径
3. 初始化环境配置
4. 按顺序加载各模块：
   - middleware → router-schema → controller → service → config → extend
5. 注册全局中间件
6. 加载路由
7. 启动服务器
```

### 2. 自动加载机制

框架提供了完整的自动加载机制，支持：

#### Controller 加载器
- **路径**: `elpis-core/loader/controller.js`
- **功能**: 自动扫描 `app/controller/` 目录下的所有 `.js` 文件
- **命名规则**: 支持驼峰命名转换，如 `custom-controller.js` → `customController`
- **访问方式**: `app.controller.${目录}.${文件名}`

#### Service 加载器
- **功能**: 自动加载服务层模块
- **访问方式**: `app.service.${serviceName}`

#### Router 加载器
- **功能**: 自动注册路由配置
- **支持**: RESTful API 和视图路由

#### Middleware 加载器
- **功能**: 自动加载和注册中间件

### 3. 基础控制器

**位置**: `app/controller/base.js`

提供统一的响应格式：

```javascript
// 成功响应
success(ctx, data = {}, metadata = {})

// 失败响应  
fail(ctx, message, code)
```

**响应格式**:
```json
{
  "success": true/false,
  "data": {},
  "metadata": {},
  "message": "错误信息",
  "code": "错误码"
}
```

### 4. 错误处理中间件

**位置**: `app/middleware/error-handle.js`

**功能**:
- 全局异常捕获
- 统一错误响应格式
- 模板未找到时的重定向处理
- 错误日志记录

### 5. 环境配置

支持多环境配置：
- **local**: 本地开发环境
- **beta**: 测试环境  
- **production**: 生产环境

**配置文件**:
- `config/config.default.js`: 默认配置
- `config/config.beta.js`: 测试环境配置
- `config/config.prod.js`: 生产环境配置

## 💻 开发指南

### 环境要求
- Node.js >= 12.0.0
- npm >= 6.0.0

### 安装依赖
```bash
npm install
```

### 开发命令

```bash
# 本地开发
npm run dev

# 测试环境
npm run beta

# 生产环境
npm run prod

# Windows 环境
npm run dev:win
npm run beta:win
npm run prod:win

# 前端构建
npm run build:dev    # 开发环境构建
npm run build:prod   # 生产环境构建

# 代码检查
npm run lint
```

### 创建新模块

#### 1. 创建 Controller
```javascript
// app/controller/example.js
module.exports = (app) => {
    const BaseController = require('./base')(app);
    return class ExampleController extends BaseController {
        async index(ctx) {
            const { example: exampleService } = app.service;
            const result = await exampleService.getData();
            this.success(ctx, result);
        }
    };
}
```

#### 2. 创建 Service
```javascript
// app/service/example.js
module.exports = (app) => {
    const BaseService = require('./base')(app);
    return class ExampleService extends BaseService {
        async getData() {
            // 业务逻辑
            return { message: 'Hello World' };
        }
    }
}
```

#### 3. 创建 Router
```javascript
// app/router/example.js
module.exports = (app, router) => {
    const { example: exampleController } = app.controller;
    router.get('/api/example', exampleController.index.bind(exampleController));
}
```

### 中间件开发

```javascript
// app/middleware/custom-middleware.js
module.exports = (app) => {
    return async (ctx, next) => {
        // 前置处理
        console.log('Before request');
        
        await next();
        
        // 后置处理
        console.log('After request');
    }
}
```

## 📚 API 文档

### 项目管理 API

#### 获取项目列表
- **URL**: `POST /api/project/getList`
- **Method**: POST
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "name": "project1",
      "desc": "11111"
    },
    {
      "name": "project2", 
      "desc": "22222"
    }
  ]
}
```

#### 获取项目列表 (GET)
- **URL**: `GET /api/project/list`
- **Method**: GET
- **Response**: 同上

### 视图路由

- **首页**: `/view/page1`
- **其他页面**: 根据路由配置动态生成

## 🚀 部署指南

### 生产环境部署

1. **环境准备**
```bash
# 安装 Node.js 和 npm
# 安装 PM2 (推荐)
npm install -g pm2
```

2. **代码部署**
```bash
# 克隆代码
git clone [repository-url]
cd elpis

# 安装依赖
npm install --production

# 构建前端资源
npm run build:prod
```

3. **启动服务**
```bash
# 使用 PM2 启动
pm2 start index.js --name "elpis"

# 或直接启动
npm run prod
```

4. **环境变量配置**
```bash
export _ENV=production
export PORT=8080
export IP=0.0.0.0
```

### Docker 部署

```dockerfile
FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build:prod

EXPOSE 8080
CMD ["npm", "run", "prod"]
```

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /static {
        alias /app/app/public;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## ❓ 常见问题

### Q: 如何添加新的中间件？
A: 在 `app/middleware/` 目录下创建新的中间件文件，框架会自动加载。然后在 `app/middleware.js` 中注册使用。

### Q: 如何配置数据库连接？
A: 在对应环境的配置文件中添加数据库配置，如 `config/config.default.js`。

### Q: 如何处理跨域问题？
A: 项目已集成 `koa2-cors` 中间件，可在配置文件中进行跨域设置。

### Q: 如何添加新的路由？
A: 在 `app/router/` 目录下创建路由文件，框架会自动加载并注册路由。

### Q: 前端资源如何管理？
A: 前端代码放在 `app/pages/` 目录下，使用 Webpack 进行构建，静态资源放在 `app/public/` 目录。

### Q: 如何查看日志？
A: 项目使用 Log4js 进行日志管理，可通过 `app.logger` 进行日志记录。

### Q: 如何进行单元测试？
A: 项目集成了 Mocha 测试框架，可在 `test/` 目录下编写测试用例。

---

## 📞 联系信息

- **作者**: luopeng
- **仓库**: https://e.coding.net/g-fnsq8787/elpis/Elpis.git
- **许可证**: ISC

---

*最后更新时间: 2025-12-18*
