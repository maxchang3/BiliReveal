import { isElementLoaded } from '@/utils/dom'
import { getLocationString } from '@/utils/location'
import { logger } from '@/utils/'
import { hookVue3App } from './shims/hook-vue3-app'
import type { ReplyElement, SubReplyElement } from './types'

const extractLocationFromReplyElement = (replyItemEl: HTMLDivElement) => {
  let replyElement: SubReplyElement | ReplyElement
  let locationString: string | undefined
  if (replyItemEl.className.startsWith('sub')) {
    replyElement = replyItemEl as SubReplyElement
    locationString = getLocationString(replyElement?.__vue__.vnode.props.subReply)
  } else {
    replyElement = replyItemEl as ReplyElement
    locationString = getLocationString(replyElement?.__vue__.vnode.props.reply)
  }
  return locationString
}

const hasLocationInjected = (replyInfo: Element) =>
  replyInfo.children.length !== 0 && replyInfo.children[0].innerHTML.includes('IP属地')

const insertLocation = (replyItemEl: HTMLDivElement) => {
  const replyInfo = replyItemEl.className.startsWith('sub')
    ? replyItemEl.querySelector('.sub-reply-info')
    : replyItemEl.querySelector('.reply-info')
  if (!replyInfo) throw new Error('Can not detect reply info')

  const locationString = extractLocationFromReplyElement(replyItemEl)
  if (!locationString) {
    logger.warn('[IP属地解析] vue3 未携带 IP 数据 (解析为空)')
    return
  }
  if (hasLocationInjected(replyInfo)) return

  logger.incrementIpCount()
  replyInfo.children[0].innerHTML += `&nbsp;&nbsp;${locationString}`
}

const isReplyItem = (el: Node): el is HTMLDivElement =>
  el instanceof HTMLDivElement && ['reply-item', 'sub-reply-item'].includes(el.className)

export const observeAndInjectComments = async (root?: HTMLElement) => {
  logger.info('[Strategy] 启用 observeAndInjectComments (Vue3)')
  hookVue3App()
  const targetNode = await isElementLoaded('.reply-list', root)
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'childList') continue
      mutation.addedNodes.forEach((node) => {
        if (!isReplyItem(node)) return
        try {
          insertLocation(node)
          if (node.className.startsWith('sub')) return
          const subReplyListEl = node.querySelector('.sub-reply-list')
          if (!subReplyListEl) return
          const subReplyList = Array.from(subReplyListEl.children) as HTMLDivElement[]
          subReplyList.pop()
          subReplyList.forEach(insertLocation)
        } catch (error) {
          logger.error('[Hook异常] observeAndInjectComments (Vue3) 处理失败', error)
        }
      })
    }
  })
  observer.observe(targetNode, { childList: true, subtree: true })
}
