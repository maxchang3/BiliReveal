import { isElementLoaded } from '@/utils/dom'
import { logger } from '@/utils/'
import type { InitialState, ReadViewInfo } from './types'
import { unsafeWindow } from '$'

declare global {
  interface Window {
    __INITIAL_STATE__?: InitialState
  }
}

const fetchArticleViewInfo = async (cv: string | number): Promise<ReadViewInfo | undefined> => {
  try {
    const response = await fetch(`https://api.bilibili.com/x/article/viewinfo?id=${cv}`, {
      credentials: 'include',
    })
    const { data } = await response.json()
    return data
  } catch (error) {
    logger.error('获取文章 IP 属地失败：', error)
    return undefined
  }
}

let opusLocationObserver: MutationObserver | undefined

const serveNewOpusArticle = async (initialState?: InitialState) => {
  // 没有这些参数说明不是专栏文章的 opus
  const basic = initialState?.detail?.basic
  if (!basic?.rid_str || basic.article_type !== 0) return

  const viewinfo = await fetchArticleViewInfo(basic.rid_str)
  if (!viewinfo?.location) {
    logger.warn(`[IP属地解析] 新版专栏 (opus) 未携带 IP 数据 (cv: ${basic.rid_str})`)
    return
  }

  const location = viewinfo.location
  const insertLocation = () => {
    const currentAuthorPub = document.querySelector('.opus-module-author__pub')
    if (!currentAuthorPub) return
    const text = `${location} ·\u00a0`
    const existingLocation = currentAuthorPub.querySelector('.opus-module-author__pub__bilireveal')
    if (existingLocation) {
      if (existingLocation.textContent !== text) existingLocation.textContent = text
      return
    }

    logger.incrementIpCount()
    const locationEl = document.createElement('span')
    locationEl.textContent = text
    locationEl.className = 'opus-module-author__pub__bilireveal'
    currentAuthorPub.insertAdjacentElement('afterbegin', locationEl)
  }

  // 页面 hydration 会替换作者区域；复用已获取的属地，恢复被移除的节点。
  opusLocationObserver?.disconnect()
  opusLocationObserver = new MutationObserver(insertLocation)
  opusLocationObserver.observe(document, { childList: true, subtree: true })
  insertLocation()
}

export const injectArticleLocation = async (url: string) => {
  const match = url.match(/\/cv(\d+)/)
  const cv = match ? match[1] : undefined

  if (!cv) {
    // 新版专栏文章（opus）
    if (unsafeWindow.__INITIAL_STATE__) {
      serveNewOpusArticle(unsafeWindow.__INITIAL_STATE__)
      return
    }

    let initialState: InitialState | undefined
    Object.defineProperty(unsafeWindow, '__INITIAL_STATE__', {
      get: () => initialState,
      set: (value: InitialState) => {
        initialState = value
        serveNewOpusArticle(initialState)
      },
      configurable: true,
    })
    return
  }

  // 普通专栏文章处理逻辑
  const viewinfo = await fetchArticleViewInfo(cv)
  if (!viewinfo?.location) {
    logger.warn(`[IP属地解析] 专栏文章 未携带 IP 数据 (cv: ${cv})`)
    return
  }

  const articleDetail = await isElementLoaded('.article-detail')
  const publishText = articleDetail?.querySelector('.publish-text')
  if (!publishText) return

  if (publishText.parentElement?.querySelector('.article-location-bilireveal')) return

  logger.incrementIpCount()
  const locationEl = document.createElement('span')
  locationEl.textContent = `${viewinfo.location} · `
  locationEl.className = 'article-location-bilireveal'
  publishText.insertAdjacentElement('afterend', locationEl)
}
