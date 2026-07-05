import { hookBBComment, hookLit, injectArticleLocation } from '@/injection'
import { isElementLoaded } from '@/utils/'

export const handleOpusRoute = async (url: string) => {
  hookLit()
  injectArticleLocation(url)
}

export const handleSpaceHomeRoute = async () => {
  const biliMainHeader = await isElementLoaded('#biliMainHeader')
  const isFreshSpace = biliMainHeader?.tagName === 'HEADER'
  const dynamicTabSelector = isFreshSpace ? '.nav-tab__item:nth-child(2)' : '.n-dynamic'
  const dyanmicTab = await isElementLoaded(dynamicTabSelector)
  dyanmicTab.addEventListener('click', hookLit, { once: true })
}

export const handleDynamicHomeRoute = async () => {
  const dynHome = await isElementLoaded('.bili-dyn-home--member')
  const dynBtnText = (dynHome.querySelector('.bili-dyn-sidebar__btn') as HTMLElement | undefined)
    ?.textContent
  const isNewDyn = dynBtnText ? !dynBtnText.includes('体验新版') : false
  if (isNewDyn) {
    hookLit()
  } else {
    hookBBComment()
  }
}

export const handleDynamicItemRoute = async () => {
  const dynItem = await isElementLoaded('.bili-dyn-item')
  const isNewDyn = !dynItem.querySelector('.bili-dyn-item__footer')
  if (isNewDyn) {
    hookLit()
  } else {
    hookBBComment()
  }
}
