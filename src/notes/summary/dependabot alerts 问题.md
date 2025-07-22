# Dependabot alerts（即远程仓库关于，依赖包的版本风险监测）

## 风险查找

#### 查看依赖树

  ```bash
  pnpm why xxx // xxx 依赖包名

  或

  pnpm list xxx // xxx 依赖包名
  ```

#### 清理锁文件和 node_modules，重新安装

  ```bash
  rm -rf node_modules pnpm-lock.yaml

  pnpm install
  ```

####  向 npm 安全数据库查询你项目中使用的依赖是否存在安全漏洞。它分析你的 `pnpm-lock.yaml` 中锁定的包及其版本。（其中的 pnpm 的版本要和本地的 `pnpm-lock.yaml` 中的版本保持一致）

  ```bash
  pnpm audit --audit-level=moderate
  ```

 ` --audit-level=moderate` : 过滤等级

🔐 安全等级说明

| 等级       | 描述                             |
| ---------- | ------------------------------ |
| `low`      | 轻微漏洞，通常不易被利用，影响有限              |
| `moderate` | 有一定风险，可能影响数据完整性或功能             |
| `high`     | 漏洞容易被利用，可能造成服务中断或数据泄漏          |
| `critical` | 严重漏洞，易被攻击者远程利用，可能控制系统、导致重大安全事故 |

✅ 常见用途

- 在 CI/CD 中确保构建不会上线存在 中等及以上漏洞 的代码
- 在开发中有选择性地处理问题，避免被低危漏洞干扰

## 风险处理

1. 一般情况下会让其升级到某个版本即可

2. 存在内部依赖的包，即在 `package.json` 中的依赖项中不存在的，可通过以下配置覆盖指定依赖包的版本。

    ```bash
    dependencies:
      axios 1.8.2
        └── form-data 4.0.3
    ```

   ```json
   // package.json
   {
     "dependencies": {
       // ...
       "axios": "^1.8.2"
     },
     "devDependencies": {
       // ...
     },
     "pnpm": {
       "overrides": {
         "axios>form-data": "4.0.4"
       }
     }
   }
   ```

    > 这个是 pnpm 独有的嵌套 overrides 语法：只对 axios 内部的 form-data 生效。

    `npm 8.x`

    只支持全局统一覆盖，不能指定 axios 单独用什么版本
      ```json
     {
        "overrides": {
          "form-data": "4.0.4"
        }
     }
      ```
