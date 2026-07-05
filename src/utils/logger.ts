import {
  GM_getValue,
  GM_registerMenuCommand,
  GM_unregisterMenuCommand,
  GM_setClipboard,
  GM_info,
} from '$'

export const DEBUG_MODE_KEY = 'bili_reveal_debug_mode'
const LOG_VERSION = 1

export const isDebugMode = __LITE_VERSION__ ? false : GM_getValue(DEBUG_MODE_KEY, false)

let memoryLogs: string[] = []

export const logger = {
  log: (level: string, ...args: unknown[]) => {
    if (!isDebugMode) {
      if (level === 'error') console.error('[BiliReveal]', ...args)
      return
    }

    // Output to console
    const consoleMethod =
      level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
    consoleMethod(`[BiliReveal][${level.toUpperCase()}]`, ...args)

    try {
      const MAX_LOGS = 1000
      const time = new Date().toLocaleTimeString()
      const logString = `[${time}] [${level.toUpperCase()}] ${args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ')}`

      memoryLogs.push(logString)
      if (memoryLogs.length > MAX_LOGS) {
        memoryLogs = memoryLogs.slice(-MAX_LOGS)
      }

      updateLogMenu()
    } catch (e) {
      console.error('Failed to process log', e)
    }
  },
  debug: (...args: unknown[]) => logger.log('debug', ...args),
  info: (...args: unknown[]) => logger.log('info', ...args),
  warn: (...args: unknown[]) => logger.log('warn', ...args),
  error: (...args: unknown[]) => logger.log('error', ...args),
  incrementIpCount: () => {
    if (ipInjectCount === 0) {
      logger.info('[IP属地插入] 首次成功解析并插入 IP 属地')
    }
    ipInjectCount++
    updateLogMenu()
  },
}

let ipInjectCount = 0

let logMenuId: string | number | undefined
let menuUpdateTimer: ReturnType<typeof setTimeout> | null = null

export const updateLogMenu = () => {
  if (!isDebugMode || __LITE_VERSION__) return
  if (menuUpdateTimer) clearTimeout(menuUpdateTimer)

  menuUpdateTimer = setTimeout(() => {
    const count = memoryLogs.length

    if (logMenuId !== undefined) {
      try {
        GM_unregisterMenuCommand(logMenuId)
      } catch {
        // Ignored
      }
    }

    logMenuId = GM_registerMenuCommand(`📄 复制本页日志 (${count})`, () => {
      if (memoryLogs.length === 0) return

      const header = [
        `=== BiliReveal Debug Info v${LOG_VERSION}===`,
        `Script Version: ${GM_info?.script?.version || 'Unknown'} (Lite: ${__LITE_VERSION__})`,
        `Script Handler: ${GM_info?.scriptHandler || 'Unknown'} v${GM_info?.version || 'Unknown'}`,
        `User Agent: ${navigator.userAgent}`,
        `URL: ${location.href}`,
        `Time: ${new Date().toLocaleDateString('sv-SE')}`,
        `IP Insertions: ${ipInjectCount}`,
        `=============================`,
        '',
      ].join('\n')

      GM_setClipboard(header + memoryLogs.join('\n'), 'text')
    })
  }, 100)
}
