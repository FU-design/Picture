# git 常用指令

#### 以 SSH 方式 clone 的远程仓库

#### 以 HTTPS 方式 clone 的远程仓库

#### 查看当前与远程仓库的关联方式

```bash
git remote -v
```

#### 移除当前本地关联的远程仓库

```bash
git remote remove origin
```

#### 本地代码关联远程仓库

```bash
git remote add origin [https | ssh]
```

#### 代码回退

```bash
# 回退到指定版本
git reset --hard commit_id

# 回退到上一个版本
git reset --soft HEAD^
```

#### 分支相关(查看，创建，删除)

```bash
# 查看所有远程分支
git branch - r

# 查看本地分支
git branch --list

# 拉取远程分支并创建本地分支
git checkout -b localBranchName origin/remoteBranchName # 方法1
git fetch origin remoteBranchName:localBranchName # 方法2

# 删除本地分支
git branch -d localBranchName

# 强制删除本地分支
git branch -D branch_name

# 删除远程分支
git push origin --delete remoteBranchName
```
