import { expect, test, type Page } from '@playwright/test'
import type { Reply } from '../src/injection/types'
import { stripLocalePrefix, SUPPORTED_LOCALES } from '../src/utils/locale'
import { LitComponentAdapter } from './adapters'
import { defineTestSuite, openDynamicComments } from './utils'

test('语言前缀归一化保留页面路径，并支持无尾斜杠的语言首页', () => {
  for (const locale of SUPPORTED_LOCALES) {
    expect(stripLocalePrefix(`/${locale}/video/BV1tx411w7Ay`)).toBe('/video/BV1tx411w7Ay')
    expect(stripLocalePrefix(`/${locale}`)).toBe('/')
    expect(stripLocalePrefix(`/${locale}/`)).toBe('/')
  }
})

test('不移除未知语言、相似路径或路径中间的语言代码', () => {
  for (const pathname of [
    '/',
    '/video/BV1tx411w7Ay',
    '/enough/video/1',
    '/ko/video/1',
    '/video/en/1',
  ]) {
    expect(stripLocalePrefix(pathname)).toBe(pathname)
  }
})

const verifyLocalizedLocation = (locale: string) => async (page: Page) => {
  expect(new URL(page.url()).pathname.split('/')[1], '应保留请求的语言前缀').toBe(locale)
  const adapter = new LitComponentAdapter(page)
  const comment = adapter.getMainComment()
  const expectedLocation = await comment
    .locator('bili-comment-action-buttons-renderer')
    .first()
    .evaluate((element) => (element as HTMLElement & { data: Reply }).data.reply_control.location)
  expect(expectedLocation, '评论数据应带有 B 站返回的本地化属地').toBeTruthy()
  await expect(adapter.getLocationTag(comment)).toHaveText(expectedLocation!)
}

defineTestSuite('i18n', LitComponentAdapter, [
  ...SUPPORTED_LOCALES.map((locale) => ({
    name: `视频（${locale}）`,
    url: `https://www.bilibili.com/${locale}/video/BV1tx411w7Ay`,
    verify: verifyLocalizedLocation(locale),
  })),
  {
    name: '列表（英语）',
    url: 'https://www.bilibili.com/en/list/8047632',
    verify: verifyLocalizedLocation('en'),
  },
  {
    name: '番剧（日语）',
    url: 'https://www.bilibili.com/ja/bangumi/play/ss29325',
    verify: verifyLocalizedLocation('ja'),
  },
  {
    name: '个人空间（阿拉伯语）',
    url: 'https://space.bilibili.com/ar/8047632',
    setup: async (page) => {
      await page.locator('.nav-tab__item').nth(1).click()
      await openDynamicComments(page)
    },
    verify: verifyLocalizedLocation('ar'),
  },
])
