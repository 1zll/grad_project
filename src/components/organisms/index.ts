import { badge, button, escapeHtml, icon } from "../atoms"

import { navItem, type NavItem } from "../molecules"

export const navigation: NavItem[] = [
  { label: "ホーム", icon: "home" },

  { label: "企業分析", icon: "briefcase" },

  { label: "チャート", icon: "chart" },

  { label: "テンプレート", icon: "file" },

  { label: "自己分析", icon: "user" },

  { label: "選考イベント", icon: "calendar" },
]

export function sidebar(
  activePage: string,

  companyCount: number,

  profileName: string,
): string {
  return `<aside class="sidebar"><a class="brand" href="#" data-action="navigate" data-page="ホーム"><span class="brand-mark">${icon("graduation", 22)}</span><span>CareerNote<span class="text-indigo-600">.</span></span></a><p class="mb-3 mt-10 px-3 text-[10px] font-semibold tracking-[.18em] text-slate-400">MY WORKSPACE</p><nav class="space-y-1">${navigation.map((item) => navItem(item, item.label === activePage, item.label === "企業分析" ? companyCount : 0)).join("")}</nav><div class="mt-auto"><section class="m-2 rounded-2xl bg-indigo-50 p-4"><span class="text-indigo-600">${icon("sparkle", 19)}</span><h2 class="mt-3 text-sm font-semibold text-slate-800">一歩ずつ、あなたらしく。</h2><p class="mt-2 text-xs leading-6 text-slate-500">日々の小さな準備が、未来の自分につながります。</p><span class="mt-4 block h-1 w-8 rounded-full bg-indigo-500"></span></section><button class="flex w-full items-center gap-3 border-t border-slate-100 px-2 py-4 text-left" data-action="navigate" data-page="自己分析"><span class="grid size-9 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">${escapeHtml(profileName.trim().charAt(0) || "T")}</span><span class="min-w-0 flex-1"><strong class="block truncate text-xs text-slate-700">${escapeHtml(profileName)}</strong><small class="mt-1 block text-[11px] text-slate-400">2027年卒</small></span>${icon("more", 18, "text-slate-400")}</button></div></aside>`
}

export function topbar(page: string): string {
  return `<header class="topbar"><div class="flex items-center gap-2 text-xs"><span class="text-slate-400">マイワークスペース</span>${icon("chevron", 14, "text-slate-300")}<strong class="font-medium text-slate-700">${escapeHtml(page)}</strong></div><div class="flex items-center gap-2 sm:gap-4">${badge("● 2027年卒", "green")}<button class="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="通知" data-action="notification">${icon("bell", 19)}<span class="absolute right-2 top-2 size-1.5 rounded-full bg-rose-400"></span></button>${button("ログイン / 新規登録", { action: "account", variant: "ghost", extra: "hidden sm:inline-flex" })}<span class="grid size-8 place-items-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">T</span></div></header>`
}

export function pageHeading(
  title: string,

  description: string,

  actionLabel = "予定を追加",
): string {
  return `<div class="mb-6 flex items-start justify-between gap-4"><div><h1 class="text-2xl font-semibold tracking-tight text-slate-800 sm:text-[28px]">${escapeHtml(title)}</h1><p class="mt-2 text-sm text-slate-500">${escapeHtml(description)}</p></div>${button(actionLabel, { action: "primary-add", iconName: "plus", extra: "shrink-0 max-sm:px-3" })}</div>`
}

export function footer(): string {
  return `<footer class="flex justify-between gap-4 py-7 text-[11px] text-slate-400"><span>CareerNote — あなたの「これから」を、ここから。</span><span class="max-sm:hidden">一歩ずつ、未来へ。</span></footer>`
}

export function calendar(
  events: Array<{
    id: string
    company: string
    title: string
    type: string
    date: string
    start: string
    end: string
  }>,

  weekOffset: number,

  view: "週" | "月",
): string {
  const dateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

  const weekStart = new Date(2026, 10, 1 + weekOffset * 7)

  const dayLabels = ["日", "月", "火", "水", "木", "金", "土"]

  const weekEnd = new Date(weekStart)

  weekEnd.setDate(weekEnd.getDate() + 6)

  const dateLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()} – ${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`

  const toolbar = `<div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"><div class="flex items-center gap-3"><span class="text-indigo-600">${icon("calendar", 18)}</span><h2 class="text-sm font-semibold text-slate-800">スケジュール</h2>${badge("2026年11月", "slate")}</div><div class="flex items-center gap-2"><button class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50" data-action="calendar-today">今日</button><button class="icon-button" aria-label="前の週" data-action="calendar-prev">${icon("left", 16)}</button><span class="min-w-24 text-center text-xs text-slate-500">${dateLabel}</span><button class="icon-button" aria-label="次の週" data-action="calendar-next">${icon("right", 16)}</button><div class="ml-1 flex rounded-lg bg-slate-100 p-0.5"><button data-action="calendar-view" data-view="週" class="rounded-md px-3 py-1 text-xs ${
    view === "週" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"
  }">週</button><button data-action="calendar-view" data-view="月" class="rounded-md px-3 py-1 text-xs ${
    view === "月" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"
  }">月</button></div></div></div>`

  const days = dayLabels
    .map((label, index) => {
      const date = new Date(weekStart)

      date.setDate(weekStart.getDate() + index)

      const key = dateKey(date)

      const dayEvents = events.filter((event) => event.date === key)

      return `<div class="calendar-day ${
        index === 0 || index === 6 ? "calendar-weekend" : ""
      }"><div class="calendar-day-label"><span>${label}</span><strong class="${
        index === 3 && weekOffset === 0 ? "calendar-today" : ""
      }">${date.getDate()}</strong></div><div class="calendar-day-events">${dayEvents.map((event) => `<button data-action="calendar-event" data-event-id="${escapeHtml(event.id)}" class="calendar-event ${event.type === "面接" ? "event-peach" : event.type === "説明会" ? "event-blue" : "event-purple"}"><strong>${escapeHtml(event.company)}</strong><span>${escapeHtml(event.type)}</span><small>${escapeHtml(event.start)}–${escapeHtml(event.end)}</small></button>`).join("")}<button class="calendar-add" data-action="calendar-add" data-date="${key}" aria-label="${key}に予定を追加">+</button></div></div>`
    })
    .join("")

  const body =
    view === "週"
      ? `<div class="calendar-scroll"><div class="calendar-week"><div class="calendar-head"><span class="pl-2 text-[10px] text-slate-400">GMT+9</span>${dayLabels.map((label) => `<span>${label}</span>`).join("")}</div><div class="calendar-grid">${days}</div></div></div>`
      : `<div class="month-grid">${Array.from({ length: 35 }, (_, index) => {
          const date = new Date(
            weekStart.getFullYear(),
            weekStart.getMonth(),
            1,
          )

          date.setDate(index - date.getDay() + weekOffset * 7)

          const key = dateKey(date)

          const dayEvents = events.filter((event) => event.date === key)

          return `<div class="month-cell"><span>${date.getDate()}</span>${dayEvents.map((event) => `<button data-action="calendar-event" data-event-id="${escapeHtml(event.id)}" class="month-event">${escapeHtml(event.company)}</button>`).join("")}</div>`
        }).join("")}</div>`

  return `<section class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">${toolbar}${body}<div class="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500"><span class="flex items-center gap-2"><i class="legend-dot bg-orange-300"></i>面接</span><span class="flex items-center gap-2"><i class="legend-dot bg-sky-300"></i>説明会</span><span class="flex items-center gap-2"><i class="legend-dot bg-violet-300"></i>インターン</span><span class="ml-auto max-sm:hidden">すべての予定は日本標準時です</span></div></section>`
}
