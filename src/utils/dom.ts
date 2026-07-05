import { logger } from './logger'

export const isElementLoaded = async (
  selector: string,
  root: HTMLElement | Document | Element = document,
) => {
  const getElement = () => root.querySelector(selector)
  return new Promise<Element>((resolve) => {
    const element = getElement()
    if (element) {
      logger.debug(`[DOM] 元素就绪 (瞬时): ${selector}`)
      return resolve(element)
    }
    logger.debug(`[DOM] 等待元素渲染: ${selector}`)
    const observer = new MutationObserver((_) => {
      const element = getElement()
      if (!element) return
      logger.debug(`[DOM] 元素就绪 (异步): ${selector}`)
      resolve(element)
      observer.disconnect()
    })
    const target = root === document ? (root.documentElement ?? root) : root
    observer.observe(target, {
      childList: true,
      subtree: true,
    })
  })
}
