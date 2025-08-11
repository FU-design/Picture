#!/bin/bash

# 提示输入信息
read -p "Enter server IP: " SERVER_IP
read -p "Enter project directory on server (e.g. /opt/Picture): " PROJECT_DIR
read -p "Enter Git branch to pull (default: main): " GIT_BRANCH

# 默认用 main
GIT_BRANCH=${GIT_BRANCH:-main}

echo "Deploying to $SERVER_IP, project dir: $PROJECT_DIR, branch: $GIT_BRANCH"

# 云服务器 root 用户
SSH_USER="root"

# ssh 执行远程命令
ssh ${SSH_USER}@${SERVER_IP} bash -e << EOF
  set -e  # 遇错即停
  cd ${PROJECT_DIR}
  git pull origin ${GIT_BRANCH}
  pnpm install
  pnpm build
  sudo nginx -t
  sudo systemctl restart nginx
EOF

if [ $? -eq 0 ]; then
  echo "Deployment finished successfully."
else
  echo "Deployment failed."
fi
