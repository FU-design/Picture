---
Created At: 8/11/2025, 9:52:40 AM
Updated At: 8/11/2025, 3:46:52 PM
File Name: devploy-project
---

# 项目部署

## 准备工作：

- 云服务器
- GitHub 项目地址
- 操作系统（macOS 或 Linux）

## 使用 SSH 连接到服务器

（一）在本地电脑终端输入连接指令

```bash
ssh root@服务器公网IP

# 例如
ssh root@39.105.23.101
```

连接显示：

```vbnet
The authenticity of host 'xxxxx (39.105.23.101)' can't be established.
ECDSA key fingerprint is SHA256:xxxxxxxxxxxx.
Are you sure you want to continue connecting (yes/no)?
```
输入 `yes ` 回车确认。

若提示以下内容说明

```bash
root@39.105.23.101: Permission denied (publickey).
```

- 没有在本地配置对应的 SSH 私钥
- 服务器上没有把本地创建的公钥添加到 `root` 用户的 `~/.ssh/authorized_keys` 文件里

### 解决方法：

（1）本地生成 SSH 密钥对（若没有），在终端输入：

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"

# ssh-keygen：这是用来生成 SSH 密钥对的命令。
# -t ed25519：指定密钥类型为 ed25519，这是一种现代、安全且速度快的公钥算法，推荐使用。
# -C "your_email@example.com"：这是给密钥加一个注释（comment），可写可不写，实际上这个字符串对密钥功能没有影响。
```

（2）一路回车，默认生成：

- 公钥： `~/.ssh/id_ed25519.pub`
- 私钥： `~/.ssh/id_ed25519`

若显示以下内容：

```bash
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/xxx（用户名）/.ssh/id_ed25519):
```
意思是让你确认把刚生成的密钥保存在哪个文件路径。默认是：

```bash
/Users/xxxx(用户名)/.ssh/id_ed25519
```

后续直接回车即可（其中步骤还有询问是否设置密码，回车则默认不设置）

若出现以下提示：

```bash
Enter passphrase (empty for no passphrase):
```

表示让你为这个密钥设置一个 `口令（密码）`，是对该密钥的额外保护。

这里 `输入一个口令` 或 `直接回车`，(不设置口令。以后用这个私钥登录时，不需要额外输入密码，方便但安全性略低.)

（3）拷贝公钥

```bash
cat ~/.ssh/id_ed25519.pub
```

（4）在已登陆的账号中进入云服务器的后台

- 进入 `网络安全/密钥对` 菜单
- 点击 `创建密钥对`
- 点击 `导入已有密钥对`类型选项
- 粘贴上述复制的 `公钥内容`

(5) 密钥绑定完成后，准备再次登录到云服务器，在本地终端中输入

```bash
ssh -i ~/.ssh/id_ed25519 root@39.105.23.101
```

* `ssh`：表示使用 SSH 客户端发起远程连接。
* `-i`: 表示指定登录时要用的私钥文件路径
* `~/.ssh/id_ed25519`: 是你本地生成的 私钥（和服务器上绑定的公钥是一对的）
* `root`: 是你要登录的远程用户名（这里是云服务器的超级管理员账号）
* `39.105.23.101` 是你云服务器的公网 IP 地址

用这个私钥来验证你就是密钥拥有者，不用密码登录

登陆成功进入服务器后，终端的头部会显示为：

```bash
root@iZbp1a27xd83ndots9hqq9Z:~#

# 输入 exit 即可退出
```

这样就算是使用 SSH 连接云服务器成功。

(6) 为登陆的便捷性，编辑本地 `~/.ssh/config` ，

`nano` 是终端中简单的文本编辑器

```bash
nano ~/.ssh/config
```

粘贴以下内容，按下 `Ctrl + O`(提示文件名时，按回车确认)，回车确认保存，然后按 `Ctrl + X` 退出。

* `Host aliyun-server` ：这是给这条连接起的别名，以后只要输入 `ssh aliyun-server` 就能登录。
* `HostName` ：你的服务器公网 IP 或域名。
* `User` ：登录用户名（你一般用 root）。
* `IdentityFile` ：你本地私钥的路径。

```text
Host aliyun-server
  HostName 39.105.23.101
  User root
  IdentityFile ~/.ssh/id_ed25519
```

以后登陆到服务器只需要输入：

```bash
ssh aliyun-server
```

## 开始部署

（1）连接到云服务器后，终端中输入以下指令，更新云服务器系统和安装必要软件

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git
```

若出现以下内容：直接选择 `OK`（提示有服务（这里是 packagekit.service）使用了过时的库，需要重启以应用更新。）

```
       Daemons using outdated libraries
│                                             │
│                                             │
│ Which services should be restarted?         │
│                                             │
│    [*] packagekit.service                   │
│                                             │
│                                             │
│          <Ok>              <Cancel>         |

```

（2）安装运行环境（我的项目是 vue 项目， 所以需要 Node.js）

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

sudo apt install -y nodejs
```

- curl 是一个命令行工具，用来从网上下载内容。
- `-f`：失败时不输出错误页面（fail silently）。
- `-s`：静默模式，不显示下载过程。
- `-S`：配合 -s，失败时显示错误信息。
- `-L`：遇到重定向时跟随跳转。
- 网址 https://deb.nodesource.com/setup_20.x 是 NodeSource 提供的一个脚本，用来帮你在 Ubuntu/Debian 系统中配- 置 Node.js 20.x 的官方软件源。
- 管道符` | `把下载下来的脚本直接传给后面执行。
- `sudo -E bash -`：用 root 权限（sudo）执行这个脚本，-E 表示保留当前用户的环境变量，bash - 表示从标准输入读取脚本内容并执行

（可选）使用 npm 全局安装 pnpm（最新的 10.x 版本）：

```bash
sudo npm install -g pnpm@10
```

（3）克隆 GitHub 项目

安装 `git` (若没有)

```bash
sudo apt install git -y
```

拉取项目
```bash
cd /opt  # 或其他你想放项目的目录

git clone https://github.com/你的用户名/你的仓库.git

cd 你的仓库
```
(4) 安装依赖，启动项目

```bash
pnpm install
pnpm build
```

(5) 安装并配置 Nginx 作为静态文件服务器

```bash
sudo apt install nginx -y
```

创建配置文件，配置 nginx

```bash
sudo nano /etc/nginx/sites-available/picture
```

写入下面配置（假设你想用服务器的 80 端口访问）：

```nginx
server {
    listen 80;
    server_name 39.105.23.101;

    # 直接访问根路径时，跳转到 /Picture/
    location = / {
        return 301 /Picture/;
    }

    # 处理 /Picture/ 下的所有请求
    location /Picture/ {
        alias /opt/Picture/dist/;
        index index.html;

        # 支持前端路由
        try_files $uri $uri/ /index.html;

        # 静态文件缓存
        location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|ttf|svg|eot)$ {
            expires 30d;
            access_log off;
            add_header Cache-Control "public";
        }
    }
}

```

启用该配置并重启 Nginx

```bash
sudo ln -s /etc/nginx/sites-available/picture /etc/nginx/sites-enabled/

sudo nginx -t

sudo systemctl restart nginx
```
测试访问

```bash
http://服务器IP(公网IP)
```

(6) 在阿里云控制台检查和开放安全组 80 端口

* 进入 `网络与安全/安全组`
* 点击 `创建安全组`
* 在规则配置选项下，点击 `增加规则`

![增加规则](devploy-01.png)

## 更新服务器项目

登陆云服务，使用指令寻到项目根目录地址

```bash
# 进入项目目录
cd /opt/picture

git pull origin main

pnpm install

pnpm  build

sudo nginx -t

sudo systemctl restart nginx
```

## 问题处理

若在拉取代码的时候出现以下错误：

```bash
fatal: unable to access 'https://github.com/xxxxx/仓库名.git/': Failed to connect to github.com port 443 after 130178 ms: Connection timed out

error: RPC failed; curl 16 Error in the HTTP2 framing layer
fatal: expected flush after ref listing
```

解决方法：

- 增加 Git HTTP 缓冲区大小（设置为 500MB，避免大文件传输时缓冲区过小）

```bash
git config --global http.postBuffer 524288000
```

- 强制 Git 使用 HTTP/1.1 而非 HTTP/2

```bash
git config --global http.version HTTP/1.1
```

- 取消 Git 的 http/https 的代理

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy

# 查看 Git 配置代理
git config --global --get http.proxy
git config --global --get https.proxy

# 设置代理
git config --global http.proxy http://127.0.0.1:9097
git config --global https.proxy http://127.0.0.1:9097
```
