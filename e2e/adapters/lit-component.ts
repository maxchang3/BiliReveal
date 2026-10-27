import type { Locator, Page } from '@playwright/test'
import type { BiliCommentAdapter } from '.'

export class LitComponentAdapter implements BiliCommentAdapter {
  readonly commentAppSelector = 'bili-comments'
  readonly locationPattern = /.+/

  constructor(private page: Page) {}

  getMainComment(): Locator {
    return this.page.locator('bili-comment-thread-renderer:not(:has(#top))').first()
  }

  getLocationTag(commentLocator: Locator): Locator {
    return commentLocator
      .locator('bili-comment-action-buttons-renderer')
      .first()
      .locator('#location')
  }

  async clickSort(): Promise<void> {
    // 排序项的结构一致，避免依赖不同语言的「最新」文案。
    await this.page.locator('bili-comments #sort-actions bili-text-button').nth(1).click()
  }
}
