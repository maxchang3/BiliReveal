import { expect } from '@playwright/test'
import { LitComponentAdapter } from './adapters'
import { defineTestSuite } from './utils'

defineTestSuite('Lit Component', LitComponentAdapter, [
  { name: '视频', url: 'https://www.bilibili.com/video/BV1tx411w7Ay' },
  { name: '新列表', url: 'https://www.bilibili.com/list/8047632' },
  { name: '新版单独动态页', url: 'https://www.bilibili.com/opus/1108038404888592390' },
  { name: '新番剧播放页', url: 'https://www.bilibili.com/bangumi/play/ss29325' },
  {
    name: '课程页',
    url: 'https://www.bilibili.com/cheese/play/ss66',
    setup: (page) => {
      page.locator('.comment-tab').click()
    },
  },
  {
    name: '话题页',
    url: 'https://www.bilibili.com/v/topic/detail?topic_id=1332080',
    setup: (page) => {
      const commentWithCount = page
        .locator('.bili-dyn-action.comment')
        .filter({ hasText: /^\s*\d+\s*$/ })
        .first()
      commentWithCount.click()
    },
  },
  {
    name: '节日页（拜年祭）',
    url: 'https://www.bilibili.com/festival/bnj2026',
  },
  {
    name: '专栏（opus）',
    url: 'https://www.bilibili.com/opus/840727281150197760',
    verify: async (page) => {
      const readInfo = page.locator('.opus-module-author__pub__bilireveal')
      await expect(readInfo).toContainText('上海', { timeout: 10000 })
    },
  },
  {
    name: '专栏（cv）',
    url: 'https://www.bilibili.com/read/cv26498166/?opus_fallback=1',
    verify: async (page) => {
      const readInfo = page.locator('.article-read-info')
      await expect(readInfo).toContainText('上海', { timeout: 10000 })
    },
    refresh: true,
  },
  {
    name: '个人空间（首页->动态页)',
    url: 'https://space.bilibili.com/8047632',
    setup: (page) => {
      page.locator('.nav-tab__item').nth(1).click()
      page.locator('.bili-dyn-action.comment').first().click()
    },
  },
  {
    name: '动态主页',
    url: 'https://t.bilibili.com/',
    setup: (page) => {
      const commentWithCount = page
        .locator('.bili-dyn-action.comment')
        .filter({ hasText: /^\s*\d+\s*$/ })
        .first()
      commentWithCount.click()
    },
  },
  { name: '旧版单独动态页', url: 'https://t.bilibili.com/385190177693666264' },
  {
    name: '直播间',
    url: 'https://live.bilibili.com/75287',
    setup: (page) => {
      page.mouse.wheel(0, 500)
      const commentWithCount = page
        .locator('.bili-dyn-action.comment')
        .filter({ hasText: /^\s*\d+\s*$/ })
        .first()
      commentWithCount.click()
    },
  },
])
