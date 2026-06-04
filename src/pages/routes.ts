import { hookBBComment, hookLit, observeAndInjectComments } from '@/injection'
import type { Router } from '@/utils/'
import {
  handleDynamicHomeRoute,
  handleDynamicItemRoute,
  handleOpusRoute,
  handleSpaceHomeRoute,
} from './handler'

export const registerRoutes = (router: Router) => {
  router.serve(
    [
      /** 视频 */ 'https://www.bilibili.com/video/',
      /** 新列表 */ 'https://www.bilibili.com/list/',
      /** 新番剧播放页 */ 'https://www.bilibili.com/bangumi/play/',
      /** 课程页 */ 'https://www.bilibili.com/cheese/play/',
      /** 话题页 */ 'https://www.bilibili.com/v/topic/detail',
      /** 漫画详情页（漫画 APP 端的评论无 IP 属地数据） */ 'https://manga.bilibili.com/detail/',
      /** 节日（如：拜年祭） */ 'https://www.bilibili.com/festival/',
      /** 直播间 */ 'https://live.bilibili.com/',
    ],
    hookLit,
  )

  router.serve(/** 活动话题页 */ 'https://www.bilibili.com/blackboard/feed-topic.html', () =>
    hookBBComment(),
  )

  router.serve(/** 活动页 */ 'https://www.bilibili.com/blackboard/', () => {
    // 部分旧活动用的还是老的评论组件
    hookBBComment({ variation: true })
    // 最近的都是 Vue 3 的了
    observeAndInjectComments()
  })

  router.serve(
    [
      /** 专栏页（cv） */ 'https://www.bilibili.com/read/',
      /** 单独动态页、专栏页（共用 opus，但内部处理不一样） */ 'https://www.bilibili.com/opus/',
    ],
    handleOpusRoute,
  )

  /**
   * 个人空间动态页
   */
  router.serve('https://space.bilibili.com/', hookLit, { endsWith: 'dynamic' })

  /**
   * 个人空间首页
   */
  router.serve('https://space.bilibili.com/', handleSpaceHomeRoute)

  /**
   * 动态主页
   */
  router.serve('https://t.bilibili.com/', handleDynamicHomeRoute, { endsWith: '/' })

  /**
   * 旧版单独动态页
   */
  router.serve('https://t.bilibili.com/', handleDynamicItemRoute)

  /**
   * 小黑屋
   */
  router.serve('https://www.bilibili.com/blackroom/ban/', () => hookBBComment({ variation: true }))
}
