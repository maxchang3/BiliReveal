import { VueLegacyAdapter } from './adapters'
import { defineTestSuite } from './utils'

defineTestSuite('Vue Legacy', VueLegacyAdapter, [
  {
    name: '小黑屋',
    url: 'https://www.bilibili.com/blackroom/ban/262773',
  },
  {
    name: '活动页（旧活动）',
    url: 'https://www.bilibili.com/blackboard/activity-xinxinghj.html',
  },
  {
    name: '活动话题页',
    url: 'https://www.bilibili.com/blackboard/feed-topic.html?topic_id=1332080&sort_by=2',
    setup: (page) => {
      const commentWithCount = page
        .locator('.bili-dyn-action.comment')
        .filter({ hasText: /^\s*\d+\s*$/ })
        .first()
      void commentWithCount.click()
    },
  },
])
