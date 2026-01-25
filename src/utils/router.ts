import { patch } from './patch'

type RouteAction = (...args: any[]) => void | Promise<void>

interface RouteConstrait {
    endsWith?: string
}

interface Route {
    prefix: string
    action: RouteAction
    constrait: RouteConstrait
}

export class Router {
    routes: Route[] = []
    serve(prefix: string | string[], action: RouteAction, constrait: RouteConstrait = {}) {
        if (Array.isArray(prefix)) {
            prefix.forEach((p) => {
                this.routes.push({ prefix: p, action, constrait })
            })
            return
        }
        this.routes.push({ prefix, action, constrait })
    }

    match(url: string) {
        for (const { prefix, action, constrait } of this.routes) {
            if (!url.startsWith(prefix)) continue
            if (constrait.endsWith && !url.endsWith(constrait.endsWith)) continue
            patch()
            action()
            break
        }
    }
}
