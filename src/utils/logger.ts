import {
  GM_getValue,
  GM_setValue,
  GM_registerMenuCommand,
  GM_unregisterMenuCommand,
  GM_setClipboard,
  GM_info,
} from '$'

const DEBUG_MODE_KEY = 'bili_reveal_debug_mode'
const LOGS_KEY = 'bili_reveal_logs'
const LOG_VERSION = 1

export const isDebugMode = __LITE_VERSION__ ? false : GM_getValue(DEBUG_MODE_KEY, false)

// Clear logs on new page load if debug mode is active
if (isDebugMode) {
  GM_setValue(LOGS_KEY, [])
}

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

    // Output to GM storage
    try {
      const MAX_LOGS = 1000
      let currentLogs = (GM_getValue(LOGS_KEY, []) as string[]) || []
      const time = new Date().toLocaleTimeString()
      const logString = `[${time}] [${level.toUpperCase()}] ${args
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
        .join(' ')}`

      currentLogs.push(logString)
      if (currentLogs.length > MAX_LOGS) {
        currentLogs = currentLogs.slice(-MAX_LOGS)
      }
      GM_setValue(LOGS_KEY, currentLogs)
      updateLogMenu()
    } catch (e) {
      console.error('Failed to write log to GM', e)
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
    const currentLogs = (GM_getValue(LOGS_KEY, []) as string[]) || []
    const count = currentLogs.length

    if (logMenuId !== undefined) {
      try {
        GM_unregisterMenuCommand(logMenuId)
      } catch {
        // Ignored
      }
    }

    logMenuId = GM_registerMenuCommand(`📄 复制本页日志 (${count})`, () => {
      const logs = (GM_getValue(LOGS_KEY, []) as string[]) || []
      if (logs.length === 0) return

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

      GM_setClipboard(header + logs.join('\n'), 'text')
    })
  }, 100)
}
