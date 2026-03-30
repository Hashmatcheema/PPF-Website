/** Fired when main nav starts programmatic scroll (smooth/instant). */
export const PPF_NAV_SCROLL_START = "ppf:nav-scroll-start"
/** Fired when that scroll is finished (scrollend or timeout). `detail.targetId` = section id. */
export const PPF_NAV_SCROLL_END = "ppf:nav-scroll-end"

export type PpfNavScrollDetail = { targetId: string }
