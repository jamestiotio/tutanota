import m, { Component, Vnode } from "mithril"
import { assertMainOrNode } from "../../api/common/Env"
import ColumnEmptyMessageBox from "../../gui/base/ColumnEmptyMessageBox"
import { lang } from "../../misc/LanguageViewModel"
import { BootIcons } from "../../gui/base/icons/BootIcons"
import { theme } from "../../gui/theme"
import type { Mail } from "../../api/entities/tutanota/TypeRefs.js"
import { Button, ButtonType } from "../../gui/base/Button.js"
import { progressIcon } from "../../gui/base/Icon.js"

assertMainOrNode()

export type MultiMailViewerAttrs = {
	selectedEntities: Array<Mail>
	selectNone: () => unknown
	loadingAll: "can_load" | "loading" | "loaded"
	loadAll: () => unknown
	stopLoadAll: () => unknown
}

/**
 * The MailViewer displays the action buttons for multiple selected emails.
 */
export class MultiMailViewer implements Component<MultiMailViewerAttrs> {
	view({ attrs }: Vnode<MultiMailViewerAttrs>) {
		const { selectedEntities } = attrs
		return [
			m(
				".flex.col.fill-absolute",
				m(
					".flex-grow.rel.overflow-hidden",
					m(ColumnEmptyMessageBox, {
						message: () => getMailSelectionMessage(selectedEntities),
						icon: BootIcons.Mail,
						color: theme.content_message_bg,
						backgroundColor: theme.navigation_bg,
						bottomContent: this.renderEmptyMessageButtons(attrs),
					}),
				),
			),
		]
	}

	private renderEmptyMessageButtons({ loadingAll, stopLoadAll, selectedEntities, selectNone, loadAll }: MultiMailViewerAttrs) {
		return loadingAll === "loading"
			? m(".flex.items-center", [
					m(Button, {
						label: "cancel_action",
						type: ButtonType.Secondary,
						click: () => {
							stopLoadAll()
						},
					}),
					m(".flex.items-center.plr-button", progressIcon()),
			  ])
			: selectedEntities.length === 0
			? null
			: m(".flex", [
					m(Button, {
						label: "cancel_action",
						type: ButtonType.Secondary,
						click: () => {
							selectNone()
						},
					}),
					loadingAll === "can_load"
						? m(Button, {
								label: "loadAll_action",
								type: ButtonType.Secondary,
								click: () => {
									loadAll()
								},
						  })
						: null,
			  ])
	}
}

export function getMailSelectionMessage(selectedEntities: ReadonlyArray<Mail>): string {
	let nbrOfSelectedMails = selectedEntities.length

	if (nbrOfSelectedMails === 0) {
		return lang.get("noMail_msg")
	} else if (nbrOfSelectedMails === 1) {
		return lang.get("oneMailSelected_msg")
	} else {
		return lang.get("nbrOfMailsSelected_msg", {
			"{1}": nbrOfSelectedMails,
		})
	}
}
