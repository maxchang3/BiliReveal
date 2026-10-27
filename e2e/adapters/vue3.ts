import type { Locator, Page } from '@playwright/test'
import type { BiliCommentAdapter } from '.'

export class Vue3Adapter implements BiliCommentAdapter {
  readonly commentAppSelector = '.reply-list'
  readonly locationPattern = /IP属地：.+/

  constructor(private page: Page) {}

  getMainComment(): Locator {
    return this.page.locator('.reply-item').first()
  }

  getLocationTag(commentLocator: Locator): Locator {
    return commentLocator.locator('.reply-time').first()
  }

  async clickSort(): Promise<void> {
    await this.page.locator('.time-sort').click()
  }
}
