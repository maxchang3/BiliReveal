import { getLocationString } from '@/utils/location'
import { logger } from '@/utils/'
import { unsafeWindow } from '$'
import type { bbComment, CreateListCon, CreateSubReplyItem } from './types'

type HooksFunc = CreateListCon | CreateSubReplyItem

interface InjectorOption {
  variation: boolean
}

const injectBBComment = (
  bbComment: bbComment,
  { variation }: InjectorOption = { variation: false },
) => {
  const { _createListCon: createListCon, _createSubReplyItem: createSubReplyItem } =
    bbComment.prototype
  const applyHandler = <T extends HooksFunc>(
    target: T,
    thisArg: bbComment,
    args: Parameters<T>,
  ) => {
    const [item] = args
    const result: string = Reflect.apply(target, thisArg, args)
    try {
      const replyTimeRegex = /<span class="reply-time">(.*?)<\/span>/
      const location = getLocationString(item)
      if (!location) {
        logger.warn('[IP属地解析] vue-legacy 未携带 IP 数据 (解析为空)')
        return result
      }
      logger.incrementIpCount()
      if (variation) {
        const variationRegex = /<span class="time">(.*?)<\/span>/
        return result.replace(variationRegex, `<span class="time">$1&nbsp;&nbsp;${location}</span>`)
      }
      return result.replace(
        replyTimeRegex,
        `<span class="reply-time">$1</span><span class="reply-location">${location}</span>`,
      )
    } catch (error) {
      logger.error('[Hook异常] vue-legacy 处理失败', error)
      return result
    }
  }
  bbComment.prototype._createListCon = new Proxy(createListCon, {
    apply: applyHandler,
  })
  bbComment.prototype._createSubReplyItem = new Proxy(createSubReplyItem, {
    apply: applyHandler,
  })
}

export const hookBBComment = ({ variation }: InjectorOption = { variation: false }) => {
  logger.info('[Strategy] 启用 hookBBComment', variation ? '(变体)' : '')
  if (unsafeWindow.bbComment) {
    injectBBComment(unsafeWindow.bbComment, { variation })
    return
  }
  let bbComment: bbComment | undefined
  Object.defineProperty(unsafeWindow, 'bbComment', {
    get: (): bbComment | undefined => bbComment,
    set: (value: bbComment) => {
      bbComment = value
      injectBBComment(value, { variation })
    },
    configurable: true,
  })
}
