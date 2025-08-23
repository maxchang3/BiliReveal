<p align="center">
    <img src="https://github.com/user-attachments/assets/095348fe-4179-4470-999e-4eadc5ef5ae7" width = "50%"><br/>
    <i><small>我唔锺意 IP 属地，但你部手机都照样显示，点解电脑就唔显示嘅？</small></i>
</p>

# BiliReveal

![Greasy Fork 总下载量](https://img.shields.io/greasyfork/dt/466815?style=flat-square&color=444)
[![普通話](https://img.shields.io/badge/文檔-普通話-0078D4?style=flat-square)](README.md)


<img src="./assets/preview.png" width = "50%" align="right">

喺 Bilibili 网页版显示 IP 属地，支持<a href="#依家支持嘅场景">大部分场景</a>。

## 安装方式

- [从 Greasy Fork 安装](https://greasyfork.org/scripts/466815) 
- [从 Github Release 安装](https://github.com/MaxChang3/Bilibili-Web-Show-IP-Location/releases/latest/download/bilibili-web-show-ip-location.user.js)

## 使用环境

- **浏览器**：最新版 Chrome / Edge / Firefox / Safari 等支持 [扩展 API](https://developer.chrome.google.cn/docs/extensions) 嘅现代浏览器。
- **脚本管理器**：推荐  
  - Chrome/Edge/Firefox： [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)  
  - Safari： [Stay](https://github.com/shenruisi/Stay)（主要功能免费）或 [Tampermonkey](https://apps.apple.com/app/tampermonkey/id6738342400)（付费）。

> [!TIP]
> 请确保所使用嘅脚本管理器支持 [`unsafeWindow`](https://www.tampermonkey.net/documentation.php#api:unsafeWindow)。

## 常见问题

- **点解个人主页嘅 IP 属地冇显示？**
  - 个人主页需要额外逻辑，已经单独实现：
    - [Greasy Fork](https://greasyfork.org/scripts/534807) 
    - [Github](https://github.com/maxchang3/userscripts/blob/main/BiliRevealForSpace/README.md)

- **点解我评论区冇显示 IP 属地？**
  - 部分场景可能未做适配，请检查[是否支持](#依家支持嘅场景)该场景。
  - 确认脚本最新版本并正常运行  
  - Manifest V3 下可能需开启[开发者模式](https://www.tampermonkey.net/faq.php?locale=zh#Q209)  
  - 关闭其他可能冲突嘅脚本  
  - 注意：B 站上线 IP 属地前嘅评论不会显示  

## 依家支持嘅场景

- 视频（普通视频、番剧（影视）、收藏列表播放页）评论区
- 话题评论区
- 动态评论区
- 个人主页动态评论区
- 专栏（文章）作者 & 评论区
- 节日页（festival）评论区（例如「拜年祭」）
- 活动页（blackboard）评论区（例如「拜年祭预约页」）
- 课程评论区
- 小黑屋评论区
- 漫画详情页评论区

> （未作特殊说明均支持新旧版）

## 原理

依家，Bilibili 前端嘅评论区实现方式有三种：

- 旧版评论：基于 Vue 2 实现，依家仅喺旧版页面同部分场景存在。

    - 策略：通过 Hook `window.bbComment`，重写评论插入事件，插入 IP 属地。

- 新版评论：基于 Vue 3 实现（comment-pc-vue.next.js），依家存在于新版嘅大部分场景。新版设计较旧版更加紧凑同扁平化，字体都更大。

    - 策略：通过 [Hook Vue3 app](https://greasyfork.org/scripts/449444)（自 V1.5.8+，之前无须挂载）挂载唔同嘅 `__vue__` 到相应元素。通过 `MutationObserver` 监听评论插入事件，获取评论元素中嘅 IP 属地并插入。

- 新·新版评论：基于 Lit 嘅 Web Component（comment-pc-elements.next.js），依家存在于部分新版页面。
    - 策略：通过 Hook `window.customElements.define` 嘅方式，拦截 `ActionButtonsRender`，继承并重写 `update()` 方法，插入 IP 属地。

## 鸣谢

- [B站评论区开盒](https://greasyfork.org/zh-CN/scripts/448434)

    - 灵感来源
    - 参考咗部分代码

- [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey)

    - 提供最佳开发体验

- [Hook Vue3 app](https://greasyfork.org/scripts/449444)

    - 提供咗继续保持原有脚本逻辑嘅底层支持

- 帮手测试 & 提供反馈嘅朋友们

## Stargazers over time

[![Stargazers over time](https://starchart.cc/maxchang3/Bilibili-Web-Show-IP-Location.svg?variant=adaptive)](https://starchart.cc/maxchang3/Bilibili-Web-Show-IP-Location)
