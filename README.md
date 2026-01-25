<p align="center">
    <img src="https://github.com/user-attachments/assets/095348fe-4179-4470-999e-4eadc5ef5ae7" width = "50%"><br/>
    <i><small>我不喜欢 IP 属地，但是你手机都显示了，为什么电脑不显示呢？</small></i>
</p>

# BiliReveal

![Greasy Fork 总下载量](https://img.shields.io/greasyfork/dt/466815?style=flat-square&color=444)


<img src="./assets/preview.png" width = "50%" align="right">

在哔哩哔哩网页版中显示 IP 属地，支持<a href="#目前支持的场景">大部分场景</a>。

## 安装方式

- [从 Greasy Fork 安装](https://greasyfork.org/scripts/466815)
- [从 Github Release 安装](https://github.com/MaxChang3/Bilibili-Web-Show-IP-Location/releases/latest/download/bilireveal.user.js)

### Lite 版本

为了更好地兼容对上下文要求严格的脚本管理器（如 FireMonkey），我们提供了 Lite 版本：

- 移除了对 GM API 的使用（这意味着「文本替换」功能将不可用）
- 额外添加了 `@inject-into page`（脚本将直接完整注入网页，目前仅在 Firefox 下有效）

[从 Github Release 安装 Lite 版本](https://github.com/MaxChang3/Bilibili-Web-Show-IP-Location/releases/latest/download/bilireveal.lite.user.js)

## 使用环境

- **浏览器**：最新版 Chrome / Edge / Firefox / Safari 等支持 [扩展 API](https://developer.chrome.google.cn/docs/extensions) 的现代浏览器。
- **脚本管理器**：推荐  
  - Chrome/Edge/Firefox： [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)  
  - Safari： [Stay](https://github.com/shenruisi/Stay)（主要功能免费）或 [Tampermonkey](https://apps.apple.com/app/tampermonkey/id6738342400)（付费）。

> [!TIP]
> 请确保所使用的脚本管理器支持 [`unsafeWindow`](https://www.tampermonkey.net/documentation.php#api:unsafeWindow)。


## 配置选项

### 文本替换

对 IP 属地文本进行自定义替换，以简化显示内容，也可用于国际化。一个典型场景是去掉「IP 属地：」前缀，只显示地区名称。

**使用方法：**

1. 点击脚本管理器中的脚本菜单，选择 **「更新替换规则」**
2. 在弹出的对话框中输入 JSON 格式的替换规则，例如：

```json
{"IP属地：":""}
```

3. 点击确定后，页面将自动刷新并应用新规则

**规则说明：**
- 格式为 JSON 对象，键为原始文本，值为替换后的文本
- 支持多个替换规则，按顺序执行
- 替换会应用于所有显示的 IP 属地信息

## 常见问题

- **为什么个人主页的 IP 属地没有显示？**
  - 个人主页需要额外逻辑，已单独实现：
    - [Greasy Fork](https://greasyfork.org/scripts/534807) 
    - [Github](https://github.com/maxchang3/userscripts/blob/main/BiliRevealForSpace/README.md)

- **为什么我的评论区没有显示 IP 属地？**
  - 部分场景可能未做适配，请检查[是否支持](#目前支持的场景)该场景。
  - 确认脚本最新版本并正常运行  
  - Manifest V3 下可能需开启[开发者模式](https://www.tampermonkey.net/faq.php?locale=zh#Q209)  
  - 关闭其他可能冲突的脚本  
  - 注意：B 站上线 IP 属地前的评论不会显示  

## 目前支持的场景

- 视频（普通视频、番剧（影视）、收藏列表播放页）评论区
- 话题评论区
- 动态评论区
- 个人主页动态评论区
- 专栏（文章）作者 & 评论区
- 节日页（festival）评论区（如「拜年祭」」
- 活动页（blackboard）评论区（如「拜年祭预约页」）
- 课程评论区
- 小黑屋评论区
- 漫画详情页评论区

> （未作特殊说明均支持新旧版）

## 原理

目前，哔哩哔哩前端的评论区实现方式有三种：

- 旧版评论：基于 Vue 2 实现，目前仅在旧版页面和部分场景存在。

    - 策略：通过 Hook `window.bbComment` ，重写评论插入事件，插入 IP 属地。

- 新版评论：基于 Vue 3 实现（comment-pc-vue.next.js），目前存在于新版的大部分场景。新版设计较旧版更加紧凑和扁平化，字体也更大。

    - 策略：通过 [Hook Vue3 app](https://greasyfork.org/scripts/449444)（自 V1.5.8+，之前无须挂载） 挂载不同的 `__vue__` 到相应元素。通过 `MutationObserver` 监听评论插入事件，获取评论元素中的 IP 属地并插入。

- 新·新版评论：基于 Lit 的 Web Component（comment-pc-elements.next.js），目前存在于部分新版页面。
    - 策略：通过 Hook `window.customElements.define` 的方式，拦截 `ActionButtonsRender`，继承并重写 `update()` 方法，插入 IP 属地。

## 感谢

- [B站评论区开盒](https://greasyfork.org/zh-CN/scripts/448434)

    - 灵感来源
    - 参考了部分代码

- [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey)

    - 提供最佳开发体验

- [Hook Vue3 app](https://greasyfork.org/scripts/449444)

    - 提供了继续保持原有脚本逻辑的底层支持

- 帮助测试 & 提供反馈的朋友们

## Stargazers over time

[![Stargazers over time](https://starchart.cc/maxchang3/Bilibili-Web-Show-IP-Location.svg?variant=adaptive)](https://starchart.cc/maxchang3/Bilibili-Web-Show-IP-Location)
