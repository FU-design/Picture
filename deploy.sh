#!/bin/bash

# 提示用户输入信息
read -p "Enter server IP: " SERVER_IP
read -p "Enter project directory on server (e.g. /opt/Picture): " PROJECT_DIR
read -p "Enter Git branch to pull (default: main): " GIT_BRANCH

# 如果用户没输入分支，默认用 main
GIT_BRANCH=${GIT_BRANCH:-main}

echo "Deploying to $SERVER_IP, project dir: $PROJECT_DIR, branch: $GIT_BRANCH"

# 这里用 root 用户，如果你需要换用户，改下面这一行即可
SSH_USER="root"

# ssh 执行远程命令
ssh ${SSH_USER}@${SERVER_IP} << EOF
  cd ${PROJECT_DIR} || { echo "Directory not found: ${PROJECT_DIR}"; exit 1; }
  git pull origin ${GIT_BRANCH}
  pnpm install
  pnpm build
  sudo nginx -t
  sudo systemctl restart nginx
EOF

echo "Deployment finished."
