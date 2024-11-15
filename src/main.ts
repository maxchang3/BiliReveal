import type { ArticleDetail } from '@/types/cv'
import {
    hookBBComment,
    hookLit,
    observeAndInjectComments,
    serveNewComments,
} from '@/processors'
import { isConditionTrue, isElementLoaded, Router } from '@/utils/'

const router = new Router()

router.serve([
    /** 视频 */ 'https://www.bilibili.com/video/',
    /** 新列表 */ 'https://www.bilibili.com/list/',
    /** 新版单独动态页 */ 'https://www.bilibili.com/opus/',
    /** 课程页 */ 'https://www.bilibili.com/cheese/play/',
], hookLit)

router.serve(/** 拜年祭 */ 'https://www.bilibili.com/festival/', hookBBComment)

router.serve(/** 专栏 */ 'https://www.bilibili.com/read/', async () => {
    observeAndInjectComments()
    const articleDetail = await isElementLoaded('.article-detail') as ArticleDetail
    await isConditionTrue(() => { // 等待 readViewInfo 加载完毕，后期可能改为 hook 方式
        const readInfo = document.querySelector('.article-read-info')
        return !!(readInfo && readInfo.lastElementChild?.textContent !== '--评论')
    })
    const publishText = articleDetail.querySelector('.publish-text')
    if (!publishText || !articleDetail.__vue__?.readViewInfo?.location) return
    publishText.innerHTML += `&nbsp;&nbsp;IP属地：${articleDetail.__vue__.readViewInfo.location}`
})

/**
 * 番剧播放页
 */
router.serve('https://www.bilibili.com/bangumi/play/', () => {
    const isNewBangumi = !!document.querySelector('meta[name=next-head-count]')
    if (isNewBangumi) {
        hookLit()
    } else {
        hookBBComment()
    }
})

/**
 * 话题页
 */
router.serve('https://www.bilibili.com/v/topic/detail/', () => serveNewComments('.list-view'))

/**
 * 个人空间动态页
 */
router.serve('https://space.bilibili.com/', () => hookLit(), { endsWith: 'dynamic' })

/**
 * 个人空间首页
 */
router.serve('https://space.bilibili.com/', async () => {
    const dynamicTab = await isElementLoaded('#app > div.nav-bar.space-navbar > div > div.nav-bar__main-left > div > a:nth-child(2)')
    dynamicTab.addEventListener('click', () => {
        hookLit()
    }, { once: true })
})

/**
 * 动态主页
 */
router.serve('https://t.bilibili.com/', async () => {
    const dynHome = await isElementLoaded('.bili-dyn-home--member')
    const isNewDyn = (() => {
        const dynBtnText = (dynHome.querySelector('.bili-dyn-sidebar__btn') as HTMLElement | undefined)?.textContent
        return dynBtnText ? dynBtnText.includes('新版反馈') || dynBtnText.includes('回到旧版') : false
    })()
    if (isNewDyn) {
        hookLit()
    } else {
        hookBBComment()
    }
}, { endsWith: '/' })

/**
 * 单独动态页
 */
router.serve('https://t.bilibili.com/', async () => {
    const dynItem = await isElementLoaded('.bili-dyn-item')
    const isNewDyn = !dynItem.querySelector('.bili-dyn-item__footer')
    if (isNewDyn) {
        hookLit()
    } else {
        hookBBComment()
    }
})

/**
 * 小黑屋
 */
router.serve('https://www.bilibili.com/blackroom/ban/', () => hookBBComment({ blackroom: true }))

/**
 * 漫画详情页
 */
router.serve('https://manga.bilibili.com/detail/', observeAndInjectComments)

router.match(location.href)
