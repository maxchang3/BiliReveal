import { unsafeWindow } from '$'

type VueHookElement = Element & {
    __vue__?: VueAppRecord
}

interface VueVNode {
    el?: VueHookElement | null
    component?: VueApp
}

interface VueApp {
    uid: number
    vnode: VueVNode
    isUnmounted?: boolean
}

interface ProxyTargetWithApp {
    _: VueApp
}

type VueAppRecord = VueApp | VueApp[]

const realProxy = unsafeWindow.Proxy
const vueUnhooked = new WeakSet<VueApp>() // 暂存已识别但尚未拿到 el 的 app，仅用于调试
const vueHooked = new WeakMap<VueHookElement, VueAppRecord>()
const watchedVNodes = new WeakSet<VueVNode>()
const watchedApps = new WeakSet<VueApp>()
let isProxyHookInstalled = false

const isVueApp = (value: unknown): value is VueApp => {
    if (!value || typeof value !== 'object') return false
    const app = value as Partial<VueApp>
    return typeof app.uid === 'number' && app.uid >= 0 && !!app.vnode
}

const handleVueApp = (app: VueApp) => {
    const el = app.vnode.el
    if (el) {
        // 已拿到真实 DOM，直接建立双向引用
        recordVue(el, app)
        recordDOM(el, app)
        watchIsUnmounted(app)
        return
    }

    // vnode.el 尚未就绪，先挂观察器等待还原
    vueUnhooked.add(app)
    watchEl(app.vnode)
}

const watchEl = (vnode: VueVNode) => {
    if (watchedVNodes.has(vnode)) return
    watchedVNodes.add(vnode)

    let value = vnode.el
    let hooked = false

    Object.defineProperty(vnode, 'el', {
        configurable: true,
        enumerable: true,
        get() {
            return value
        },
        set(newValue: VueHookElement | null | undefined) {
            value = newValue
            const component = this.component
            if (!hooked && newValue && component) {
                hooked = true
                recordVue(newValue, component)
                recordDOM(newValue, component)
                watchIsUnmounted(component)
            }
        },
    })
}

const watchIsUnmounted = (app: VueApp) => {
    if (watchedApps.has(app)) return
    watchedApps.add(app)

    let value = app.isUnmounted
    let unhooked = false

    Object.defineProperty(app, 'isUnmounted', {
        configurable: true,
        enumerable: true,
        get() {
            return value
        },
        set(newValue: boolean | undefined) {
            value = newValue
            if (!unhooked && this.isUnmounted) {
                unhooked = true
                cleanupAppReference(this)
            }
        },
    })
}

const cleanupAppReference = (app: VueApp) => {
    const el = app.vnode.el
    if (!el) return

    // 清理 DOM.__vue__ 挂载
    const domValue = el.__vue__
    const nextDomValue = removeAppFromRecord(domValue, app)
    if (nextDomValue === undefined) {
        el.__vue__ = undefined
    } else {
        el.__vue__ = nextDomValue
    }

    // 清理 WeakMap 存储
    const mapValue = vueHooked.get(el)
    const nextMapValue = removeAppFromRecord(mapValue, app)
    if (nextMapValue === undefined) {
        vueHooked.delete(el)
    } else {
        vueHooked.set(el, nextMapValue)
    }
}

const removeAppFromRecord = (record: VueAppRecord | undefined, app: VueApp): VueAppRecord | undefined => {
    if (!record) return undefined
    if (!Array.isArray(record)) {
        return record === app ? undefined : record
    }

    const next = record.filter((item) => item !== app)
    if (next.length === 0) return undefined
    return next.length === 1 ? next[0] : next
}

const appendAppToRecord = (record: VueAppRecord | undefined, app: VueApp): VueAppRecord => {
    if (!record) return app
    if (!Array.isArray(record)) {
        return record === app ? record : [record, app]
    }
    return record.includes(app) ? record : [...record, app]
}

const recordVue = (el: VueHookElement, app: VueApp) => {
    vueUnhooked.delete(app)
    vueHooked.set(el, appendAppToRecord(vueHooked.get(el), app))
}

const recordDOM = (el: VueHookElement, app: VueApp) => {
    el.__vue__ = appendAppToRecord(el.__vue__, app)
}

const proxyInterceptor = new Proxy(realProxy, {
    // 拦截 new Proxy(...)，在 Vue app 创建链路中抓取实例
    construct: (target, args, newTarget) => {
        const app = (args[0] as ProxyTargetWithApp | undefined)?._
        if (isVueApp(app)) {
            handleVueApp(app)
        }
        return Reflect.construct(target, args, newTarget)
    },
})

export const hookVue3App = () => {
    if (isProxyHookInstalled) return
    unsafeWindow.Proxy = proxyInterceptor
    isProxyHookInstalled = true
}
