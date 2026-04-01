import { hookBBComment, hookLit, observeAndInjectComments } from '@/processors'
import type { ReadViewInfo } from '@/types/cv'
import { hookVue3App, isElementLoaded, Router, registerConfigMenus } from '@/utils/'

const router = new Router()

router.serve(
    [
        /** 视频 */ 'https://www.bilibili.com/video/',
        /** 新列表 */ 'https://www.bilibili.com/list/',
        /** 新版单独动态页 */ 'https://www.bilibili.com/opus/',
        /** 新番剧播放页 */ 'https://www.bilibili.com/bangumi/play/',
        /** 课程页 */ 'https://www.bilibili.com/cheese/play/',
        /** 话题页 */ 'https://www.bilibili.com/v/topic/detail',
        /** 漫画详情页（无 IP 属地数据） */ 'https://manga.bilibili.com/detail/',
        /** 节日（如：拜年祭） */ 'https://www.bilibili.com/festival/',
    ],
    hookLit
)

router.serve(/** 活动话题页 */ 'https://www.bilibili.com/blackboard/feed-topic.html', () => hookBBComment())

router.serve(/** 活动页 */ 'https://www.bilibili.com/blackboard/', () => {
    hookVue3App()
    observeAndInjectComments()
})

router.serve(/** 专栏 */ 'https://www.bilibili.com/read/', async (url) => {
    hookLit()

    const cv = url.split('/').filter(Boolean).pop()?.replace('cv', '')
    if (!cv) return

    try {
        const { data: viewinfo }: { data: ReadViewInfo } = await fetch(
            `https://api.bilibili.com/x/article/viewinfo?id=${cv}`,
            { credentials: 'include' }
        ).then((res) => res.json())

        if (!viewinfo?.location) return

        const articleDetail = await isElementLoaded('.article-detail')
        const publishText = articleDetail?.querySelector('.publish-text')
        if (!publishText) return

        const locationEl = document.createElement('span')
        locationEl.textContent = `${viewinfo.location} · `
        publishText.insertAdjacentElement('afterend', locationEl)
    } catch (error) {
        console.error('获取文章 IP 属地失败：', error)
    }
})

/**
 * 个人空间动态页
 */
router.serve('https://space.bilibili.com/', hookLit, { endsWith: 'dynamic' })

/**
 * 个人空间首页
 */
router.serve('https://space.bilibili.com/', async () => {
    const biliMainHeader = await isElementLoaded('#biliMainHeader')
    const isFreshSpace = biliMainHeader?.tagName === 'HEADER'
    if (isFreshSpace) {
        const dyanmicTab = await isElementLoaded('.nav-tab__item:nth-child(2)')
        dyanmicTab.addEventListener(
            'click',
            () => {
                hookLit()
            },
            { once: true }
        )
    } else {
        const dynamicTab = await isElementLoaded('.n-dynamic')
        dynamicTab.addEventListener(
            'click',
            () => {
                hookLit()
            },
            { once: true }
        )
    }
})

/**
 * 动态主页
 */
router.serve(
    'https://t.bilibili.com/',
    async () => {
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
    },
    { endsWith: '/' }
)

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

const { origin, pathname } = new URL(location.href)
const urlWithoutQueryOrHash = `${origin}${pathname}`

router.match(urlWithoutQueryOrHash)

if (!__LITE_VERSION__) registerConfigMenus()
