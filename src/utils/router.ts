import { logger } from './logger'

type RouteAction = (url: string) => void | Promise<void>

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
      logger.info(
        `[Router] 匹配到路由: ${prefix}`,
        constrait.endsWith ? `(要求以 ${constrait.endsWith} 结尾)` : '',
      )
      action(url)
      break
    }
  }
}
