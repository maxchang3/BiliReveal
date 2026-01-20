import type { Reply } from '@/types/reply'
import { GM_getValue } from '$'

export const REPLACEMENTS_KEY = 'locationReplacements'

type ReplacementMap = Map<string, string>

const safeJSONParse = <T>(text: string, defaultValue: T): T => {
    try {
        return JSON.parse(text) as T
    } catch {
        return defaultValue
    }
}

export const parseReplacements = (rawJson?: string): ReplacementMap => {
    const json = rawJson || GM_getValue(REPLACEMENTS_KEY, '{}')
    const parsed = safeJSONParse<Record<string, string>>(json, {})
    return new Map(Object.entries(parsed))
}

export const replacements = (__FIRE_MONKEY__ ? undefined : parseReplacements())!

const preprocessLocation = (location?: string): string | undefined => {
    if (!location || replacements.size === 0) return location

    let result = location
    for (const [target, replacement] of replacements) {
        if (result.includes(target)) {
            result = result.replaceAll(target, replacement)
        }
    }
    return result
}

export const getLocationString = (replyItem?: Reply): string | undefined => {
    const locationString = replyItem?.reply_control?.location
    if (__FIRE_MONKEY__) return locationString
    return preprocessLocation(locationString)
}
