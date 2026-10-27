import { registerConfigMenus } from '@/config'
import { registerRoutes } from '@/pages'
import { Router } from '@/utils/'

const router = new Router()

registerRoutes(router)

const { origin, pathname } = new URL(location.href)
const normalizedPathname = pathname.replace(/^\/zh-H(?:ans|ant)(?=\/)/, '')
const urlWithoutQueryOrHash = `${origin}${normalizedPathname}`

router.match(urlWithoutQueryOrHash)

if (!__LITE_VERSION__) registerConfigMenus()
