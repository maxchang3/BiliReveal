import type { Reply } from '@/types/reply'
import { getLocationString } from '@/utils'
import { unsafeWindow } from '$'

interface ActionButtonsRender extends HTMLElement {
    data: Reply
    update(): void
}

interface Constructor<T> {
    new (...args: any[]): T
    readonly prototype: T
}

const createPatch = (ActionButtonsRender: Constructor<ActionButtonsRender>) => {
    if ((ActionButtonsRender as any).__patched) return ActionButtonsRender
    ;(ActionButtonsRender as any).__patched = true

    const applyHandler = <T extends (typeof ActionButtonsRender.prototype)['update']>(
        target: T,
        thisArg: ActionButtonsRender,
        args: Parameters<T>
    ) => {
        const result = Reflect.apply(target, thisArg, args)

        const shadow = thisArg.shadowRoot
        if (!shadow) return result

        const pubDateEl = shadow.querySelector<HTMLDivElement>('#pubdate')
        const locationString = getLocationString(thisArg.data)

        if (!locationString) {
            const loc = shadow.querySelector<HTMLDivElement>('#location')
            if (loc) loc.remove()
            return result
        }

        const insertLocation = () => {
            let loc = shadow.querySelector<HTMLDivElement>('#location')
            if (loc) {
                loc.textContent = locationString
                return
            }
            loc = document.createElement('div')
            loc.id = 'location'
            loc.textContent = locationString
            const pub = shadow.querySelector('#pubdate')
            pub?.insertAdjacentElement('afterend', loc)
        }

        if (pubDateEl) {
            insertLocation()
        } else {
            const observer = new MutationObserver(() => {
                const pub = shadow.querySelector('#pubdate')
                if (pub) {
                    observer.disconnect()
                    insertLocation()
                }
            })
            observer.observe(shadow, { childList: true, subtree: true })
        }

        return result
    }

    ActionButtonsRender.prototype.update = new Proxy(ActionButtonsRender.prototype.update, { apply: applyHandler })
    return ActionButtonsRender
}

export const hookLit = () => {
    const { define: originalDefine } = unsafeWindow.customElements

    const applyHandler = <T extends typeof originalDefine>(
        target: T,
        thisArg: ActionButtonsRender,
        args: Parameters<T>
    ) => {
        const [name, classConstructor, ...rest] = args
        if (typeof classConstructor !== 'function' || name !== 'bili-comment-action-buttons-renderer')
            return Reflect.apply(target, thisArg, args)
        const PatchActionButtonsRender = createPatch(classConstructor as Constructor<ActionButtonsRender>)
        return Reflect.apply(target, thisArg, [name, PatchActionButtonsRender, ...rest])
    }

    unsafeWindow.customElements.define = new Proxy(originalDefine, { apply: applyHandler })

    const observeRouter = () => {
        const root = document.querySelector('#app')
        if (!root) return
        let lastUrl = location.href
        new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href
                const comp = unsafeWindow.customElements.get('bili-comment-action-buttons-renderer')
                if (comp) createPatch(comp as Constructor<ActionButtonsRender>)
            }
        }).observe(root, { childList: true, subtree: true })
    }

    setTimeout(observeRouter, 2000)
}
