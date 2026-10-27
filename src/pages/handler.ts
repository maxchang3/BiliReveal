import { hookBBComment, hookLit, injectArticleLocation } from '@/injection'
import { isElementLoaded, logger } from '@/utils/'

export const handleOpusRoute = async (url: string) => {
  logger.info('[handleOpusRoute] 处理新版专栏:', url)
  hookLit()
  injectArticleLocation(url)
}

export const handleSpaceHomeRoute = async () => {
  const biliMainHeader = await isElementLoaded('#biliMainHeader')
  const isFreshSpace = biliMainHeader?.tagName === 'HEADER'
  logger.info('[handleSpaceHomeRoute] 是否新版空间:', isFreshSpace)
  const dynamicTabSelector = isFreshSpace ? '.nav-tab__item:nth-child(2)' : '.n-dynamic'
  const dyanmicTab = await isElementLoaded(dynamicTabSelector)
  dyanmicTab.addEventListener('click', hookLit, { once: true })
}

export const handleDynamicHomeRoute = () => {
  // 提前挂接两种评论组件，按页面实际加载的组件生效，避免依赖本地化按钮文案。
  logger.info('[handleDynamicHomeRoute] 挂接新旧版动态评论组件')
  hookLit()
  hookBBComment()
}

export const handleDynamicItemRoute = async () => {
  const dynItem = await isElementLoaded('.bili-dyn-item')
  const isNewDyn = !dynItem.querySelector('.bili-dyn-item__footer')
  logger.info('[handleDynamicItemRoute] 动态详情页是否新版:', isNewDyn)
  if (isNewDyn) {
    hookLit()
  } else {
    hookBBComment()
  }
}
