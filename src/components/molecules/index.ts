import { badge, escapeHtml, icon } from "../atoms"

export type NavItem = { label: string; icon: string }

export function navItem(item: NavItem, active: boolean, count = 0): string {
  return `<button type="button" aria-label="${escapeHtml(item.label)}" title="${escapeHtml(item.label)}" data-action="navigate" data-page="${escapeHtml(item.label)}" class="nav-item ${
    active ? "nav-item-active" : ""
  }">${icon(item.icon, 18)}<span>${escapeHtml(item.label)}</span>${
    count
      ? `<span class="ml-auto rounded-full ${
          active ? "bg-white text-indigo-700" : "bg-slate-100 text-slate-500"
        } px-2 py-0.5 text-[11px]">${count}</span>`
      : ""
  }</button>`
}

export function statCard(
  title: string,

  value: number | string,

  unit: string,

  note: string,

  iconName: string,

  color: string,
): string {
  return `<article class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div class="flex items-start justify-between"><p class="text-sm text-slate-500">${escapeHtml(title)}</p><span class="stat-icon ${color}">${icon(iconName, 18)}</span></div><p class="mt-4 text-3xl font-semibold tracking-tight text-slate-800">${escapeHtml(value)}<span class="ml-1.5 text-sm font-normal text-slate-400">${escapeHtml(unit)}</span></p><p class="mt-2 text-xs text-slate-400">${escapeHtml(note)}</p></article>`
}

export function taskRow(
  task: { title: string; sub: string; date: string; done: boolean },

  index: number,
): string {
  return `<div class="flex min-h-[60px] items-center gap-3 border-b border-slate-100 py-3 last:border-0"><button data-action="toggle-task" data-index="${index}" aria-label="タスクの完了を切り替え" class="grid size-5 shrink-0 place-items-center rounded-full border ${
    task.done
      ? "border-indigo-600 bg-indigo-600 text-white"
      : "border-slate-300 text-transparent"
  }">${icon("check", 13)}</button><div class="min-w-0 flex-1"><p class="truncate text-sm ${
    task.done ? "text-slate-400 line-through" : "font-medium text-slate-700"
  }">${escapeHtml(task.title)}</p><p class="mt-1 text-xs text-slate-400">${escapeHtml(task.sub)}</p></div>${badge(task.date, task.date.includes("今日") ? "peach" : "slate")}</div>`
}

export function eventSummary(
  event: {
    id: string
    company: string
    type: string
    date: string
    start: string
    end: string
    summary: string
  },

  index: number,
): string {
  const color =
    event.type === "面接"
      ? "peach"
      : event.type === "説明会"
        ? "blue"
        : "purple"

  return `<button data-action="edit-event" data-index="${index}" class="event-summary group flex w-full items-center gap-4 border-b border-slate-100 p-4 text-left last:border-0 hover:bg-slate-50"><span class="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">${icon("calendar", 18)}</span><span class="min-w-0 flex-1"><span class="flex flex-wrap items-center gap-2"><strong class="text-sm text-slate-800">${escapeHtml(event.company)}</strong>${badge(event.type, color)}</span><span class="mt-1 block truncate text-xs text-slate-500">${escapeHtml(event.summary || "予定の詳細を確認する")}</span></span><span class="hidden text-right text-xs text-slate-500 sm:block">${escapeHtml(event.date)}<br>${escapeHtml(event.start)} – ${escapeHtml(event.end)}</span>${icon("chevron", 16, "text-slate-400")}</button>`
}
