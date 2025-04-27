# zsh: command not found: nvm 问题（Mac）

### 打开终端输入
```bash
brew install nvm
```
### 检查是否安装成功
```bash
nvm --version
```
### 若出现 `zsh: command not found: nvm` 报错,解决方法如下

(1) 打开 `.bash_profile` 文件进行修改。

```bash
vim  ~/.bash_profile
```
(2) 按键盘 “i”，可在当前打开的文件中插入文本内容

```bash
export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh
```
(3) 按键盘 shift + ":"，输入 "wq" 进行保存并退出

(4) 打开 `.zshrc `文件进行修改 (插入文本内容同上操作)

```bash
vim ~/.zshrc
```
(5) 打开 `.profile` 文件进行修改 (插入文本内容同上操作)

```bash
vim ~/.profile
```
(6)  依次运行下面代码，进行文件的重新加载

```bash
source  ~/.bash_profile
source  ~/.zshrc
source  ~/.profile
```

(7) 在验证 nvm 是否安装成功

```bash
nvm --version
```

引用内容来自：
- [zsh: command not found: nvm 问题（Mac）](https://blog.csdn.net/qq_50386946/article/details/143053977?spm=1001.2101.3001.6650.5&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-5-143053977-blog-137523394.235%5Ev43%5Epc_blog_bottom_relevance_base2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-5-143053977-blog-137523394.235%5Ev43%5Epc_blog_bottom_relevance_base2&utm_relevant_index=9)
