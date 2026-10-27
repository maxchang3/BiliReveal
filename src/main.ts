import { registerConfigMenus } from '@/config'
import { registerRoutes } from '@/pages'
import { Router } from '@/utils/'
import { stripLocalePrefix } from '@/utils/locale'

const router = new Router()

registerRoutes(router)

const { origin, pathname } = new URL(location.href)
const normalizedPathname = stripLocalePrefix(pathname)
const urlWithoutQueryOrHash = `${origin}${normalizedPathname}`

router.match(urlWithoutQueryOrHash)

if (!__LITE_VERSION__) registerConfigMenus()
