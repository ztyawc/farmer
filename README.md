# 菜田账本

一个基于 `Next.js 16 + TypeScript + Prisma + SQLite` 的种菜数据收益统计网站。

支持能力：

- 前台匿名添加作物数据
- 数据持久化保存到本地 SQLite
- 按 `每小时净利润` 或 `每小时经验` 排序
- 管理员后台登录
- 后台按名称筛选并删除乱填数据

## 启动方式

先安装依赖：

```bash
npm install
```

然后启动开发环境：

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 环境变量

项目已提供 `.env.example`，默认需要以下配置：

```env
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-me-now"
ADMIN_SESSION_SECRET="replace-this-with-a-long-random-string"
```

首次运行时，应用会自动初始化本地 SQLite 数据库和 `Crop` 表。

## 主要页面

- `/` 前台榜单与添加作物
- `/admin/login` 管理员登录
- `/admin` 管理后台

## API

- `GET /api/crops?sort=profit_per_hour|exp_per_hour`
- `POST /api/crops`
- `DELETE /api/admin/crops/:id`

## 校验规则

- 作物名称不能为空，且同名作物不能重复提交
- 购买价格、收益数量、出售总价、成熟时间必须大于 `0`
- 收益经验允许为 `0`
- 成熟时间单位支持 `分钟 / 小时 / 天`

## 验证命令

```bash
npm run lint
npm test
npm run build
```
