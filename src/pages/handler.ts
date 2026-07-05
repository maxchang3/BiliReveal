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

export const handleDynamicHomeRoute = async () => {
  const dynHome = await isElementLoaded('.bili-dyn-home--member')
  const dynBtnText = (dynHome.querySelector('.bili-dyn-sidebar__btn') as HTMLElement | undefined)
    ?.textContent
  const isNewDyn = dynBtnText
    ? dynBtnText.includes('新版反馈') || dynBtnText.includes('回到旧版')
    : false
  logger.info('[handleDynamicHomeRoute] 动态主页是否新版:', isNewDyn, '按钮文字:', dynBtnText)
  if (isNewDyn) {
    hookLit()
  } else {
    hookBBComment()
  }
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
