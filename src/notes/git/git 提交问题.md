---
Created At: 8/1/2025, 4:22:42 PM
Updated At: 8/4/2025, 9:32:30 AM
File Name: git 提交问题
---

### ✅ **Git 常见问题总结**

---

## 1️⃣ `git pull` 提示 divergent branches

本地与远程分支存在不同提交历史，Git 无法确定使用 **merge**、**rebase** 还是 **fast-forward**。

### 解决办法：

使用 `rebase` 保持提交历史干净：

```bash
git pull origin main --rebase
```

可设置全局默认：

```bash
git config --global pull.rebase true
```

---

## 2️⃣ `git pull --rebase` 报错：You have unstaged changes

工作区存在未提交改动，`rebase` 无法进行。

### 解决办法：

暂存改动后再操作：

```bash
git stash
git pull origin main --rebase
git stash pop
```

---

## 3️⃣ 正在 `rebase` 时卡住，提示 continue 或 amend

在 `rebase` 过程中改动未提交，需要继续操作。

### 解决办法：

```bash
git add .
git commit --amend
git rebase --continue
```

放弃此次 `rebase`：

```bash
git rebase --abort
```

---

## 4️⃣ `git push` 提示 non-fast-forward

远程分支有更新，推送被拒绝。

### 解决办法：

先同步远程，再推送：

```bash
git pull origin main --rebase
git push origin main
```

覆盖远程（慎用）：

```bash
git push origin main --force
```

---

## 5️⃣ 成功 rebase 后的操作

`rebase` 完成后需强制推送：

```bash
git push origin main --force
```

---

## 6️⃣ 撤回上一次提交的操作

### 本地未 push：

| 是否保留改动 | 命令                       |
| ------ | ------------------------ |
| 保留改动   | `git reset --soft HEAD^` |
| 丢弃改动   | `git reset --hard HEAD^` |

### 已 push：

```bash
git reset --soft HEAD^
git push origin main --force
```

---

## 7️⃣ 修改最后一次 commit（已 push）

### 操作步骤：

```bash
git add .
git commit --amend
git push origin main --force
```

---

## 8️⃣ 当进行 push 操作时出现如下错误：

```bash
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/FU-design/Picture.git/'
```
说明当前 Github 拒绝了本机当前使用的用户名或凭据，这时重新登录一下即可：

```bash
git credential-manager github login
```

---

## 🔔 **常见命令总结**

| 操作         | 命令                              |
| ---------- | ------------------------------- |
| 拉远程并保持历史干净 | `git pull origin main --rebase` |
| 暂存改动       | `git stash` / `git stash pop`   |
| 撤回提交保留改动   | `git reset --soft HEAD^`        |
| 撤回提交丢弃改动   | `git reset --hard HEAD^`        |
| 修改最后提交     | `git commit --amend`            |
| 强制推送       | `git push origin main --force`  |
| 放弃 rebase  | `git rebase --abort`            |
| 继续 rebase  | `git rebase --continue`         |

---

## 🚩 **推荐 Git 配置**

```bash
git config --global pull.rebase true       # 默认使用 rebase
git config --global pull.ff only           # 或仅允许 fast-forward
```
