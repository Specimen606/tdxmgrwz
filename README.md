# 宿舍食光 · AI 宿舍低成本食谱搭配机

面向大学生的低成本食谱生成 Web App。九型人格测试仅作引流破冰，食谱真正由月度预算、可用厨具、饮食忌口、饮食目标四项硬数据决定；AI 生成结构化一周食谱并在线永久查看；通过口味评价回流形成「AI 记忆反馈闭环」，持续迭代优化。

## 功能

- 九型人格趣味测试（仅破冰，不参与食谱计算）
- 四项核心参数采集：预算 / 厨具 / 忌口 / 目标
- AI 生成一周三餐、食堂窗口与宿舍快手做法、分天采购清单（默认模拟生成器，预留真实大模型接口）
- 口味打分 + AI 口味档案，下次生成自动优化（localStorage 持久化）
- 菜谱发现页：搜索、分类、个性化推荐、菜品详情
- 菜谱管理后台：添加 / 编辑 / 删除菜品，改动实时保存到本网站
- 三档阶梯定价展示（模拟支付）

## 技术栈

React 18 + TypeScript + Vite 5 + Tailwind CSS 3 + React Router（HashRouter）

## 本地开发

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 部署

推送到 GitHub 后，GitHub Actions 会自动构建并部署到 GitHub Pages（`gh-pages` 分支）。

站点地址：https://Specimen606.github.io/tdxmgrwz/
