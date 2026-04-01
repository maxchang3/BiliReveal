import type { bbComment, CreateListCon, CreateSubReplyItem } from '@/types/reply'
import { getLocationString } from '@/utils/location'
import { unsafeWindow } from '$'

type HooksFunc = CreateListCon | CreateSubReplyItem

interface InjectorOption {
    blackroom: boolean
}

const injectBBComment = async (bbComment: bbComment, { blackroom }: InjectorOption = { blackroom: false }) => {
    const { _createListCon: createListCon, _createSubReplyItem: createSubReplyItem } = bbComment.prototype
    const applyHandler = <T extends HooksFunc>(target: T, thisArg: bbComment, args: Parameters<T>) => {
        const [item] = args
        const result: string = Reflect.apply(target, thisArg, args)
        const replyTimeRegex = /<span class="reply-time">(.*?)<\/span>/
        const location = getLocationString(item)
        if (!location) return result
        if (blackroom) {
            const blackroomRegex = /<span class="time">(.*?)<\/span>/
            return result.replace(blackroomRegex, `<span class="time">$1&nbsp;&nbsp;${location}</span>`)
        }
        return result.replace(
            replyTimeRegex,
            `<span class="reply-time">$1</span><span class="reply-location">${location}</span>`
        )
    }
    bbComment.prototype._createListCon = new Proxy(createListCon, {
        apply: applyHandler,
    })
    bbComment.prototype._createSubReplyItem = new Proxy(createSubReplyItem, {
        apply: applyHandler,
    })
}

export const hookBBComment = async ({ blackroom }: InjectorOption = { blackroom: false }) => {
    if (unsafeWindow.bbComment) {
        injectBBComment(unsafeWindow.bbComment, { blackroom })
        return
    }
    let bbComment: bbComment | undefined
    Object.defineProperty(unsafeWindow, 'bbComment', {
        get: (): bbComment | undefined => bbComment,
        set: (value: bbComment) => {
            bbComment = value
            injectBBComment(value, { blackroom })
        },
        configurable: true,
    })
}
