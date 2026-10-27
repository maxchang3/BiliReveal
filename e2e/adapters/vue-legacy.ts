import type { Locator, Page } from '@playwright/test'
import type { BiliCommentAdapter } from '.'

export class VueLegacyAdapter implements BiliCommentAdapter {
  readonly commentAppSelector = '.bb-comment'
  readonly locationPattern = /IP属地：.+/

  constructor(private page: Page) {}

  getMainComment(): Locator {
    return this.page.locator('.list-item.reply-wrap:not(:has(.stick))').first()
  }

  getLocationTag(commentLocator: Locator): Locator {
    return commentLocator.locator('.info').first()
  }

  async clickSort(): Promise<void> {
    await this.page.locator('.new-sort').click()
  }
}
