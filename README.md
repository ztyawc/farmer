# 菜田账本

一个基于 `Next.js 16 + TypeScript + Prisma + SQLite` 的种菜收益统计网站。

支持功能：

- 前台匿名添加作物
- 持久化保存到 SQLite
- 按每小时总利润或每小时经验排序
- 满级加成与小摊加成实时计算
- 管理后台登录与删除错误数据
- 适合直接部署到 VPS / Docker / 1Panel

## 本地开发

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

## 环境变量

参考 `.env.example`：

```env
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-me-now"
ADMIN_SESSION_SECRET="replace-this-with-a-long-random-string"
```

说明：

- 本地开发默认用 `file:./dev.db`
- Docker / VPS 推荐改成 `file:/app/data/dev.db`
- 上线前务必修改管理员账号、密码和会话密钥

## Docker 部署

项目已经提供：

- `Dockerfile`
- `compose.yaml`

直接部署：

```bash
docker compose up -d --build
```

默认监听：

- 容器内：`3000`
- 宿主机：`3000`

数据持久化：

- SQLite 数据库存放在 Docker 卷 `farmer_data`
- 容器内路径：`/app/data/dev.db`

## 1Panel 部署

推荐使用 `1Panel -> 容器 -> 编排` 的方式部署这个项目。

### 方式一：直接上传项目目录

1. 把整个项目上传到服务器，比如：

```bash
/opt/1panel/apps/farmer
```

2. 在 1Panel 中进入：

```text
容器 -> 编排 -> 创建编排
```

3. 选择 `路径选择`
4. 指向项目里的 `compose.yaml`
5. 按需修改环境变量，特别是：
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
6. 创建并启动

### 方式二：在 1Panel Web 编辑器中粘贴 compose

1. 进入：

```text
容器 -> 编排 -> 创建编排
```

2. 选择 `编辑`
3. 把 `compose.yaml` 内容粘进去
4. 修改管理员环境变量
5. 启动编排

### 域名访问

如果你要通过域名访问，推荐：

1. 在 1Panel 中把容器先跑起来
2. 确认应用监听 `3000`
3. 用 1Panel 的网站或反向代理功能，把域名转发到：

```text
127.0.0.1:3000
```

如果只想先测试，也可以直接访问：

```text
http://你的服务器IP:3000
```

## 主要页面

- `/` 前台首页
- `/admin/login` 管理员登录
- `/admin` 管理后台

## API

- `GET /api/crops?sort=profit_per_hour|exp_per_hour`
- `POST /api/crops`
- `DELETE /api/admin/crops/:id`

## 验证命令

```bash
npm run lint
npm test
npm run build
```
