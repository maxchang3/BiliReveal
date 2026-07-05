import { getLocationString } from '@/utils/location'
import { logger } from '@/utils/'
import { unsafeWindow } from '$'
import type { Reply } from './types'

interface ActionButtonsRender extends HTMLElement {
  data: Reply
  update(): void
}

interface Constructor<T> {
  new (...args: any[]): T
  readonly prototype: T
}

const updateLocationElement = (thisArg: ActionButtonsRender) => {
  const pubDateEl = thisArg.shadowRoot!.querySelector<HTMLDivElement>('#pubdate')
  if (!pubDateEl) return

  let locationEl = thisArg.shadowRoot!.querySelector<HTMLDivElement>('#location')
  const locationString = getLocationString(thisArg.data)

  if (!locationString) {
    logger.warn('[IP属地解析] lit-component 未携带 IP 数据 (解析为空)')
    if (locationEl) locationEl.remove()
    return
  }

  if (locationEl) {
    locationEl.textContent = locationString
    return
  }

  logger.incrementIpCount()
  locationEl = document.createElement('div')
  locationEl.id = 'location'
  locationEl.textContent = locationString
  pubDateEl.insertAdjacentElement('afterend', locationEl)
}

const createPatch = (ActionButtonsRender: Constructor<ActionButtonsRender>) => {
  const applyHandler = <T extends (typeof ActionButtonsRender.prototype)['update']>(
    target: T,
    thisArg: ActionButtonsRender,
    args: Parameters<T>,
  ) => {
    const result = Reflect.apply(target, thisArg, args)
    try {
      updateLocationElement(thisArg)
    } catch (error) {
      logger.error('[Hook异常] lit-component 处理失败', error)
    }
    return result
  }
  ActionButtonsRender.prototype.update = new Proxy(ActionButtonsRender.prototype.update, {
    apply: applyHandler,
  })
  return ActionButtonsRender
}

export const hookLit = () => {
  logger.info('[Strategy] 启用 hookLit (Web Components)')
  const { define: originalDefine } = unsafeWindow.customElements
  const applyHandler = <T extends typeof originalDefine>(
    target: T,
    thisArg: ActionButtonsRender,
    args: Parameters<T>,
  ) => {
    const [name, classConstructor, ...rest] = args
    if (typeof classConstructor !== 'function' || name !== 'bili-comment-action-buttons-renderer')
      return Reflect.apply(target, thisArg, args)
    const PatchActionButtonsRender = createPatch(
      classConstructor as Constructor<ActionButtonsRender>,
    )
    return Reflect.apply(target, thisArg, [name, PatchActionButtonsRender, ...rest])
  }
  unsafeWindow.customElements.define = new Proxy(originalDefine, {
    apply: applyHandler,
  })
}
