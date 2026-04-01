export interface ReadViewInfo {
    total: number
    like: number
    attention: boolean
    favorite: boolean
    coin: number
    stats: Stats
    title: string
    banner_url: string
    mid: number
    author_name: string
    is_author: boolean
    image_urls: string[]
    origin_image_urls: string[]
    shareable: boolean
    show_later_watch: boolean
    show_small_window: boolean
    in_list: boolean
    pre: number
    next: number
    share_channels: ShareChannel[]
    type: number
    video_url: string
    location: string
    disable_share: boolean
}

interface ShareChannel {
    name: string
    picture: string
    share_channel: string
}

interface Stats {
    view: number
    favorite: number
    like: number
    dislike: number
    reply: number
    share: number
    coin: number
    dynamic: number
}
