/** 哔哩哔哩语言菜单提供的语言，构建匹配规则与页面路由共用。 */
export const SUPPORTED_LOCALES = [
  'zh-Hans',
  'zh-Hant',
  'en',
  'ja',
  'th',
  'ar',
  'pt',
  'es',
  'id',
  'ms',
  'ru',
  'tr',
  'vi',
] as const

const localePrefix = new RegExp(`^/(?:${SUPPORTED_LOCALES.join('|')})(?=/|$)`)

export const stripLocalePrefix = (pathname: string): string =>
  pathname.replace(localePrefix, '') || '/'
