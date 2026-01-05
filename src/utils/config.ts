import { GM, GM_registerMenuCommand } from '$'
import { REPLACEMENTS_KEY, replacements } from './location'

const fromError = (error: unknown): string => error instanceof Error ? error.message : String(error)

/**
 * 注册用户配置菜单命令
 */
export const registerConfigMenus = (): void => {
	GM_registerMenuCommand('配置文本替换', () => {
		const currentRules = JSON.stringify(Object.fromEntries(replacements), null, 2)
		const input = prompt(
			'请输入新的位置替换规则（JSON格式的键值对，例如 {"旧字符串": "新字符串"}）：',
			currentRules
		)

		if (!input) {
			alert('替换规则未更改。')
			return
		}

		// 验证 JSON 格式
		try {
			const parsed = JSON.parse(input)
			if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
				throw new Error('必须是键值对对象格式')
			}
		} catch (error) {
			alert(`JSON 格式错误：${fromError(error)}`)
			return
		}

		// 保存并重载
		GM.setValue(REPLACEMENTS_KEY, input)
			.then(() => {
				location.reload()
			})
			.catch((error: unknown) => {
				alert(`更新替换规则失败：${fromError(error)}`)
			})
	})
}
