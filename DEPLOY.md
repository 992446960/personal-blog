# 部署到 GitHub Pages

按下面步骤即可把本仓库部署到 GitHub Pages，**我不能代替你登录 GitHub 或执行 push**，需要你在本机完成第 2、3、4 步。

---

## 1. 已就绪的部分（无需你再改）

- 项目已用 **Hash 路由**（`#/`），在 GitHub Pages 静态托管下不会 404。
- `vite.config.ts` 里 **base** 为 `'/personal-blog/'`，部署后访问地址为：  
  **`https://<你的用户名>.github.io/personal-blog/`**
- 已配置 **GitHub Actions**：推送到 `main` 分支会自动构建并部署到 Pages。

---

## 2. 在 GitHub 上新建仓库

1. 打开 [https://github.com/new](https://github.com/new)
2. **Repository name** 填：`personal-blog`（若用别的名字，见下方「改仓库名」）
3. 选 **Public**，不要勾选 “Add a README” / “Add .gitignore”（本地已有）
4. 点 **Create repository**

---

## 3. 本地关联远程并推送

在终端进入项目目录后执行（把 `YOUR_USERNAME` 换成你的 GitHub 用户名）：

```bash
cd /Users/wang/workNotes/小用例/personal-blog

# 添加远程（二选一）
# HTTPS：
git remote add origin https://github.com/YOUR_USERNAME/personal-blog.git

# 或 SSH（若已配置 SSH key）：
# git remote add origin git@github.com:YOUR_USERNAME/personal-blog.git

# 推送
git push -u origin main
```

按提示登录 GitHub 或输入凭据即可完成推送。

---

## 4. 开启 GitHub Pages（用 Actions）

1. 打开仓库：`https://github.com/YOUR_USERNAME/personal-blog`
2. 点 **Settings** → 左侧 **Pages**
3. 在 **Build and deployment** 里：
   - **Source** 选 **GitHub Actions**
4. 保存后，每次推送到 `main` 都会自动跑 workflow，约 1～2 分钟后访问：

   **https://YOUR_USERNAME.github.io/personal-blog/**

若第一次部署后 404，等几分钟或再推一次触发重新部署即可。

---

## 若仓库名不用 personal-blog

若仓库名是别的（例如 `my-hub`），需要让 **base** 和仓库名一致：

1. 改 **vite.config.ts** 第 9 行：
   ```ts
   base: process.env.VITE_BASE ?? '/my-hub/',   // 和仓库名一致
   ```
2. 部署后访问：**https://YOUR_USERNAME.github.io/my-hub/**

---

## 小结

| 步骤 | 你要做的 |
|------|-----------|
| 1 | 无（已配置好） |
| 2 | GitHub 新建空仓库，名字建议 `personal-blog` |
| 3 | 本地 `git remote add origin ...` 和 `git push -u origin main` |
| 4 | 仓库 Settings → Pages → Source 选 **GitHub Actions** |

完成后站点地址：**https://\<用户名\>.github.io/personal-blog/** 。
