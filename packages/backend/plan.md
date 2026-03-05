## 最终设计方案

### 设计要点汇总

| 配置项 | 值 |
|--------|-----|
| 离线缓存有效期 | 14天（可配置） |
| 每月解绑次数限制 | 2次（可配置） |
| 设备订阅宽限期 | 7天 |
| 任务计费透支 | 基于用户等级，默认0 |
| 设备数来源 | 数据库中已绑定的设备数 |
| 计费方式 | 每日计算，月末累加结算 |
| 邮件服务 | SMTP |

---

### 核心计费逻辑

#### 设备订阅 - 每日计费累加

```
每日定时任务 (建议凌晨执行):
    │
    ├─► 遍历所有活跃的设备订阅证书
    │
    ├─► 获取当日设备数 (从上报数据或直接查询)
    │   device_count = license.reportedDeviceCount
    │
    ├─► 根据设备数确定适用档位
    │   tier = findTierByDeviceCount(device_count)
    │
    ├─► 计算当日费用
    │   daily_fee = device_count × tier.pricePerDevicePerDay
    │
    └─► 记录每日计费明细
        INSERT INTO daily_billing_records (...)

每月1日结算任务:
    │
    ├─► 汇总上月所有每日计费记录
    │   monthly_total = SUM(daily_fee) WHERE billing_date IN last_month
    │
    ├─► 生成月度账单
    │
    ├─► 尝试从余额扣除
    │   ├── 成功: 标记账单已支付，续期订阅
    │   └── 失败: 进入宽限期，发送邮件提醒
    │
    └─► 清理每日计费明细 (可选，或保留用于审计)
```

---

### 完整数据库 Schema

```typescript
import { sql } from 'drizzle-orm'
import {
  boolean,
  date,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

// ==================== 枚举定义 ====================

export const userStatus = pgEnum('user_status', [
  'pending_verification',
  'active',
  'suspended',
  'banned',
])

export const licenseStatus = pgEnum('license_status', [
  'inactive',
  'active',
  'suspended',
  'revoked',
])

export const licenseType = pgEnum('license_type', [
  'device_subscription',
  'task_billing',
])

export const subscriptionStatus = pgEnum('subscription_status', [
  'active',
  'grace_period',
  'expired',
  'cancelled',
])

export const bindingAction = pgEnum('binding_action', ['bind', 'unbind'])

export const consumptionType = pgEnum('consumption_type', [
  'subscription',
  'task',
  'recharge',
])

export const paymentMethod = pgEnum('payment_method', [
  'manual',
  'wechat',
  'alipay',
  'stripe',
  'paypal',
])

export const paymentStatus = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
])

export const billStatus = pgEnum('bill_status', [
  'pending',
  'paid',
  'overdue',
])

export const alertType = pgEnum('alert_type', [
  'low_balance',
  'payment_failed',
  'grace_period_warning',
  'service_stopped',
])

// ==================== 用户相关表 ====================

export const users = pgTable('users', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  email: varchar({ length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  nickname: varchar({ length: 100 }),
  phone: varchar({ length: 20 }),
  status: userStatus().default('pending_verification'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_users_email').on(table.email),
  index('idx_users_status').on(table.status),
])

export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: varchar({ length: 64 }).unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('idx_email_verification_tokens_user_id').on(table.userId),
  index('idx_email_verification_tokens_token').on(table.token),
])

export const userLevels = pgTable('user_levels', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  level: integer().default(1),
  totalSpent: decimal('total_spent', { precision: 12, scale: 2 }).default('0'),
  overdraftLimit: decimal('overdraft_limit', { precision: 10, scale: 2 }).default('0'),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const userBalances = pgTable('user_balances', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  balance: decimal({ precision: 12, scale: 2 }).default('0'),
  frozenBalance: decimal('frozen_balance', { precision: 12, scale: 2 }).default('0'),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ==================== 充值与消费记录 ====================

export const rechargeRecords = pgTable('recharge_records', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  amount: decimal({ precision: 12, scale: 2 }).notNull(),
  paymentMethod: paymentMethod('payment_method'),
  paymentId: varchar('payment_id', { length: 255 }),
  status: paymentStatus().default('pending'),
  remark: text(),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
}, (table) => [
  index('idx_recharge_records_user_id').on(table.userId),
  index('idx_recharge_records_status').on(table.status),
])

export const consumptionRecords = pgTable('consumption_records', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  licenseId: uuid('license_id').references(() => licenses.id),
  type: consumptionType().notNull(),
  amount: decimal({ precision: 12, scale: 2 }).notNull(),
  balanceAfter: decimal('balance_after', { precision: 12, scale: 2 }).notNull(),
  description: text(),
  referenceId: uuid('reference_id'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('idx_consumption_records_user_id').on(table.userId),
  index('idx_consumption_records_license_id').on(table.licenseId),
  index('idx_consumption_records_type').on(table.type),
])

// ==================== 计费配置表 ====================

export const subscriptionTiers = pgTable('subscription_tiers', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  minDevices: integer('min_devices').notNull(),
  maxDevices: integer('max_devices'),
  pricePerDevicePerDay: decimal('price_per_device_per_day', { precision: 6, scale: 4 }).notNull(),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('idx_subscription_tiers_active').on(table.isActive),
])

export const taskPricing = pgTable('task_pricing', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  pricePerTaskDevice: decimal('price_per_task_device', { precision: 6, scale: 4 }).notNull(),
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export const levelRules = pgTable('level_rules', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  level: integer().unique().notNull(),
  minTotalSpent: decimal('min_total_spent', { precision: 12, scale: 2 }).notNull(),
  overdraftLimit: decimal('overdraft_limit', { precision: 10, scale: 2 }).notNull(),
  description: varchar({ length: 255 }),
})

// ==================== 证书相关表 ====================

export const licenses = pgTable('licenses', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  licenseKey: varchar('license_key', { length: 64 }).unique().notNull(),
  type: licenseType().notNull(),
  fingerprintHash: varchar('fingerprint_hash', { length: 128 }),
  status: licenseStatus().default('inactive'),
  boundAt: timestamp('bound_at'),
  unbindCountThisMonth: integer('unbind_count_this_month').default(0),
  lastUnbindResetAt: timestamp('last_unbind_reset_at').defaultNow(),
  reportedDeviceCount: integer('reported_device_count').default(0),
  lastDeviceReportAt: timestamp('last_device_report_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_licenses_user_id').on(table.userId),
  index('idx_licenses_license_key').on(table.licenseKey),
  index('idx_licenses_status').on(table.status),
  index('idx_licenses_type').on(table.type),
])

export const licenseBindingHistory = pgTable('license_binding_history', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  licenseId: uuid('license_id').references(() => licenses.id).notNull(),
  fingerprintHash: varchar('fingerprint_hash', { length: 128 }).notNull(),
  action: bindingAction().notNull(),
  reason: varchar({ length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('idx_license_binding_history_license_id').on(table.licenseId),
])

// ==================== 订阅相关表 ====================

export const subscriptions = pgTable('subscriptions', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  licenseId: uuid('license_id').references(() => licenses.id).unique().notNull(),
  status: subscriptionStatus().default('active'),
  currentPeriodStart: date('current_period_start').notNull(),
  currentPeriodEnd: date('current_period_end').notNull(),
  gracePeriodEnd: date('grace_period_end'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_subscriptions_license_id').on(table.licenseId),
  index('idx_subscriptions_status').on(table.status),
])

// ==================== 计费记录表 ====================

// 每日计费明细
export const dailyBillingRecords = pgTable('daily_billing_records', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  licenseId: uuid('license_id').references(() => licenses.id).notNull(),
  billingDate: date('billing_date').notNull(),
  deviceCount: integer('device_count').notNull(),
  tierId: uuid('tier_id').references(() => subscriptionTiers.id).notNull(),
  unitPrice: decimal('unit_price', { precision: 6, scale: 4 }).notNull(),
  dailyAmount: decimal('daily_amount', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('idx_daily_billing_records_license_id').on(table.licenseId),
  index('idx_daily_billing_records_billing_date').on(table.billingDate),
  uniqueIndex('uq_daily_billing_license_date').on(table.licenseId, table.billingDate),
])

// 月度账单
export const monthlyBills = pgTable('monthly_bills', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  licenseId: uuid('license_id').references(() => licenses.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  billingMonth: date('billing_month').notNull(),
  totalDeviceDays: integer('total_device_days').notNull(), // 设备天数总和
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  status: billStatus().default('pending'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('idx_monthly_bills_license_id').on(table.licenseId),
  index('idx_monthly_bills_user_id').on(table.userId),
  index('idx_monthly_bills_status').on(table.status),
  uniqueIndex('uq_monthly_bills_license_month').on(table.licenseId, table.billingMonth),
])

// 任务计费记录
export const taskBillingRecords = pgTable('task_billing_records', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  licenseId: uuid('license_id').references(() => licenses.id).notNull(),
  taskId: varchar('task_id', { length: 100 }).notNull(),
  deviceCount: integer('device_count').notNull(),
  unitPrice: decimal('unit_price', { precision: 6, scale: 4 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('idx_task_billing_records_license_id').on(table.licenseId),
])

// ==================== 验证缓存表 ====================

export const verificationCache = pgTable('verification_cache', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  licenseId: uuid('license_id').references(() => licenses.id).notNull(),
  fingerprintHash: varchar('fingerprint_hash', { length: 128 }).notNull(),
  verificationToken: text('verification_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('idx_verification_cache_license_id').on(table.licenseId),
])

// ==================== 提醒记录表 ====================

export const balanceAlerts = pgTable('balance_alerts', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  licenseId: uuid('license_id').references(() => licenses.id),
  alertType: alertType('alert_type').notNull(),
  currentBalance: decimal('current_balance', { precision: 12, scale: 2 }).notNull(),
  estimatedFee: decimal('estimated_fee', { precision: 12, scale: 2 }),
  emailSent: boolean('email_sent').default(false),
  sentAt: timestamp('sent_at').defaultNow(),
}, (table) => [
  index('idx_balance_alerts_user_id').on(table.userId),
  index('idx_balance_alerts_alert_type').on(table.alertType),
])

// ==================== 管理员表 ====================

export const admins = pgTable('admins', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  username: varchar({ length: 100 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar({ length: 20 }).default('admin'),
  createdAt: timestamp('created_at').defaultNow(),
})

// ==================== 系统配置表 ====================

export const systemConfig = pgTable('system_config', {
  id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
  key: varchar({ length: 100 }).unique().notNull(),
  value: text().notNull(),
  description: varchar({ length: 255 }),
  updatedAt: timestamp('updated_at').defaultNow(),
})
```

---

### 系统配置项

```typescript
// 默认系统配置
const defaultConfig = {
  // 离线缓存有效期（天）
  'license.offline_cache_days': '14',
  
  // 每月解绑次数限制
  'license.monthly_unbind_limit': '2',
  
  // 设备订阅宽限期（天）
  'subscription.grace_period_days': '7',
  
  // 余额不足提醒间隔（天）
  'alert.low_balance_interval_days': '7',
  
  // 每月最大提醒次数
  'alert.max_monthly_alerts': '3',
  
  // 宽限期结束前提醒天数
  'alert.grace_period_warning_days': '3',
  
  // SMTP 配置
  'email.smtp_host': '',
  'email.smtp_port': '587',
  'email.smtp_user': '',
  'email.smtp_pass': '',
  'email.from_address': '',
  'email.from_name': 'Snapmaker Farm',
}
```

---

### 实施阶段规划

| 阶段 | 内容 | 预计时间 |
|------|------|---------|
| 1 | 项目初始化、数据库 Schema、加密服务 | 2天 |
| 2 | 用户认证（注册、邮箱验证、登录） | 2天 |
| 3 | 余额系统、等级系统 | 1.5天 |
| 4 | 证书管理（创建、绑定、解绑） | 2天 |
| 5 | 订阅管理、验证接口 | 2天 |
| 6 | 计费系统（每日计费、月度结算、任务计费） | 3天 |
| 7 | 邮件服务、提醒系统 | 1.5天 |
| 8 | 管理后台 API | 2天 |
| 9 | 客户端 SDK（指纹生成、授权客户端） | 2天 |
| 10 | 测试、文档 | 2天 |

**总计：约 20 天**
