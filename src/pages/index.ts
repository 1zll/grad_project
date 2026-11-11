import { badge, button, escapeHtml, icon } from "../components/atoms"

import { eventSummary, statCard, taskRow } from "../components/molecules"

import { calendar, pageHeading } from "../components/organisms"

import {
  companyStatuses,
  eventTypes,
  initialState,
  type AppState,
} from "../model"

const sampleNote = "今日の一歩が、理想のキャリアにつながります。"

function dashboard(
  state: AppState,

  week: number,

  view: "週" | "月",

  taskFilter: string,
): string {
  const pending = state.tasks.filter((task) => !task.done).length

  const done = state.tasks.filter((task) => task.done).length

  const filteredTasks = state.tasks.filter(
    (task) =>
      taskFilter === "すべて" ||
      (taskFilter === "完了" ? task.done : !task.done),
  )

  const interviews = state.events.filter((event) => event.type === "面接")

  return `<div class="eyebrow"><span class="size-1.5 rounded-full bg-indigo-500"></span>YOUR CAREER, YOUR STORY</div>${pageHeading(`おかえりなさい、${state.profile.split(" ")[1] || state.profile}さん`, sampleNote, "予定を追加")}<section class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">${statCard("エントリー企業", state.companies.length + 7, "社", "先週から +2社", "briefcase", "stat-lavender")}${statCard("選考中の企業", state.companies.filter((company) => !["不合格", "内定"].includes(company.status)).length, "社", "あなたの可能性が広がっています", "chart", "stat-blue")}${statCard("今週の予定", state.events.length, "件", "面接・説明会など", "calendar", "stat-peach")}${statCard("未完了のタスク", pending, "件", "今日締切のタスクがあります", "check", "stat-green")}</section>${calendar(state.events, week, view)}<section class="mt-6 grid gap-5 lg:grid-cols-2"><article class="rounded-2xl border border-slate-100 bg-white shadow-sm"><div class="flex items-center justify-between px-5 py-4"><div class="flex items-center gap-3"><span class="text-indigo-600">${icon("check", 18)}</span><h2 class="text-sm font-semibold">タスク</h2>${badge(`${pending}件`, "indigo")}</div>${button("追加", { action: "add-task", iconName: "plus", variant: "ghost", extra: "px-2" })}</div><div class="flex gap-2 px-5 pb-2">${["すべて", "未完了", "完了"].map((filter) => `<button data-action="task-filter" data-filter="${filter}" class="rounded-full px-3 py-1 text-xs ${filter === taskFilter ? "bg-indigo-50 font-medium text-indigo-700" : "text-slate-500 hover:bg-slate-50"}">${filter}</button>`).join("")}</div><div class="px-5">${filteredTasks.map((task) => taskRow(task, state.tasks.indexOf(task))).join("")}</div><div class="px-5 py-4"><div class="mb-2 flex justify-between text-xs"><span class="text-slate-500">今週の達成率</span><strong class="text-indigo-600">${
    state.tasks.length ? Math.round((done / state.tasks.length) * 100) : 0
  }%</strong></div><div class="h-1.5 overflow-hidden rounded-full bg-indigo-50"><div class="h-full rounded-full bg-indigo-500" style="width:${
    state.tasks.length ? (done / state.tasks.length) * 100 : 0
  }%"></div></div></div></article><article class="rounded-2xl border border-slate-100 bg-white shadow-sm"><div class="flex items-center justify-between px-5 py-4"><div class="flex items-center gap-3"><span class="text-indigo-600">${icon("video", 18)}</span><h2 class="text-sm font-semibold">直近の面接予定</h2></div><button class="text-xs font-medium text-indigo-600" data-action="navigate" data-page="選考イベント">すべて見る ${icon("arrow", 13)}</button></div><div>${interviews.map((event) => eventSummary(event, state.events.indexOf(event))).join("") || `<p class="px-5 py-8 text-center text-sm text-slate-400">面接予定はありません。</p>`}</div><div class="mx-5 mb-4 flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs text-indigo-700">${icon("sparkle", 16)}<span class="flex-1">面接前に、企業情報と自己PRを振り返りましょう。</span><button aria-label="自己PRを見る" data-action="navigate" data-page="テンプレート">${icon("arrow", 15)}</button></div></article></section>`
}

function companies(state: AppState, query: string): string {
  const rows = state.companies.filter((company) =>
    company.name.toLowerCase().includes(query.toLowerCase()),
  )

  return `${pageHeading("企業分析", "気になる企業を整理して、あなたに合う一社を見つけましょう。", "企業を追加")}<section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><label class="relative mb-4 block max-w-sm">${icon("search", 17, "absolute left-3 top-3 text-slate-400")}<input class="form-input pl-10" data-query="company" placeholder="企業名で検索" value="${escapeHtml(query)}"></label><div class="overflow-x-auto"><table class="w-full min-w-[780px] border-collapse text-left text-sm"><thead><tr class="border-b border-slate-100 text-xs text-slate-400">${["企業名", "選考ステータス", "職種", "基本給（月額）", "職場環境", "成長環境", "希望度", ""].map((heading) => `<th class="px-4 py-4 font-medium">${heading}</th>`).join("")}</tr></thead><tbody>${rows.map((company) => `<tr class="border-b border-slate-50 hover:bg-slate-50/80"><td class="px-4 py-4"><button class="font-semibold text-indigo-700 hover:underline" data-action="company-detail" data-company="${escapeHtml(company.name)}">${escapeHtml(company.name)}</button></td><td class="px-4 py-4"><select class="form-select w-32" data-company-status="${escapeHtml(company.name)}">${companyStatuses.map((status) => `<option ${status === company.status ? "selected" : ""}>${status}</option>`).join("")}</select></td><td class="px-4 py-4 text-slate-600">${escapeHtml(company.role)}</td><td class="px-4 py-4 text-slate-600">¥${company.salary.toLocaleString("ja-JP")}</td><td class="px-4 py-4 text-slate-600">${company.environment} / 10</td><td class="px-4 py-4 text-slate-600">${company.growth} / 10</td><td class="px-4 py-4">${badge(`${company.preference} / 10`, "indigo")}</td><td class="px-4 py-4"><button class="icon-button" data-action="company-detail" data-company="${escapeHtml(company.name)}" aria-label="企業詳細">${icon("chevron", 16)}</button></td></tr>`).join("")}</tbody></table>${
    rows.length
      ? ""
      : `<p class="py-12 text-center text-sm text-slate-400">企業が見つかりませんでした。</p>`
  }</div></section>`
}

function chart(state: AppState): string {
  return `${pageHeading("チャート", "あなたの価値観と企業の魅力を、ひと目で比較。", "企業を追加")}<section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"><h2 class="font-semibold text-slate-800">希望度 × 給料チャート</h2><p class="mt-1 text-sm text-slate-500">各企業をクリックすると詳細を確認できます</p><div class="mt-8 flex h-72 gap-4"><div class="flex flex-col justify-between pb-1 text-xs text-slate-400"><span>35万</span><span>30万</span><span>25万</span><span>20万</span></div><div class="chart-grid relative flex-1 border-b border-l border-indigo-100">${state.companies.map((company, index) => `<button title="${escapeHtml(company.name)}：¥${company.salary.toLocaleString("ja-JP")}" class="chart-point" style="left:${Math.max(7, Math.min(93, company.preference * 9))}%;bottom:${Math.max(5, Math.min(88, ((company.salary - 200000) / 150000) * 85))}%" data-action="company-detail" data-company="${escapeHtml(company.name)}"><span></span><strong>${escapeHtml(company.name)}</strong></button>`).join("")}</div></div><p class="mt-4 text-center text-xs text-slate-500">希望度　1 ───────────── 10</p></section><section class="mt-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"><h2 class="font-semibold">総合評価</h2>${state.companies.map((company, index) => `<div class="mt-5 flex items-center gap-4"><span class="w-24 shrink-0 text-sm text-slate-600">${escapeHtml(company.name)}</span><div class="h-2.5 flex-1 overflow-hidden rounded-full bg-indigo-50"><div class="h-full rounded-full bg-indigo-500" style="width:${Math.max(30, 90 - index * 8)}%"></div></div><strong class="w-16 text-right text-sm text-indigo-700">${90 - index * 8} / 100</strong></div>`).join("")}</section>`
}

function templates(
  state: AppState,

  category: string,
): string {
  const categories = [
    "ガクチカ",
    "自己PR",
    "強み／弱み",
    "エンジニア",
    "志望動機",
  ]

  const labels = [
    "簡潔に伝える",
    "経験を具体的に伝える",
    "想いまで、しっかり伝える",
  ]

  return `${pageHeading("テンプレート", "あなたの経験を、伝わる言葉に。文字数別に文章を準備しましょう。", "テンプレートを追加")}<div class="mb-5 flex gap-2 overflow-x-auto pb-1">${categories.map((item) => `<button data-action="template-category" data-category="${item}" class="shrink-0 rounded-full px-4 py-2 text-sm ${category === item ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-600"}">${item}</button>`).join("")}</div><div class="space-y-4">${state.templates
    .map((text, index) => {
      const limit = 200 + index * 100

      return `<article class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"><div class="mb-4 flex items-center gap-3">${badge(`${limit}字`, "indigo")}<h2 class="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">${category} — ${labels[index] ?? "自分らしく伝える"}</h2><button data-action="remove-template" data-index="${index}" aria-label="テンプレート削除" class="icon-button text-slate-400 hover:text-rose-600">${icon("trash", 17)}</button></div><textarea class="form-textarea" rows="4" data-template-index="${index}">${escapeHtml(text)}</textarea><div class="mt-3 flex items-center justify-between"><button data-action="copy-template" data-index="${index}" class="inline-flex items-center gap-2 text-xs font-medium text-indigo-600">${icon("copy", 15)}文章をコピー</button><span class="template-count text-xs ${
        text.length > limit ? "text-rose-600" : "text-slate-400"
      }" data-count-index="${index}">${text.length}字 / ${limit}字</span></div></article>`
    })
    .join("")}</div>`
}

function profile(state: AppState): string {
  const details = state.profileDetails ?? initialState.profileDetails

  const sections = details.sections
    .map(
      (section) =>
        `<section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><h2 class="border-b border-slate-200 pb-3 text-sm font-semibold">${escapeHtml(section.title)}</h2><h3 class="mt-4 text-xs font-medium text-slate-500">結論</h3><p class="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">${escapeHtml(section.summary)}</p><h3 class="mt-4 text-xs font-medium text-slate-500">具体的なエピソードと理由</h3><p class="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">${escapeHtml(section.details)}</p></section>`,
    )
    .join("")

  const information = [
    ["生年月日", details.birthDate.replace(/-/g, "/"), "calendar"],
    ["メールアドレス", details.email, "mail"],
    ["現住所", details.address, "location"],
  ]

  return `${pageHeading("自己分析", "自分を知ることから、あなたらしいキャリアを。", "プロフィールを編集")}<section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8"><div class="flex flex-wrap items-start gap-5"><span class="grid size-24 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-500">${icon("user", 42)}</span><div class="min-w-0 flex-1"><h2 class="text-xl font-semibold text-slate-800">${escapeHtml(state.profile)}</h2><p class="mt-1 text-sm text-slate-500">2027年卒 ・ エンジニア志望</p><div class="mt-5 grid gap-4 sm:grid-cols-2">${information.map(([title, value, iconName]) => `<div class="flex gap-3">${icon(iconName, 17, "mt-0.5 text-slate-400")}<div><p class="text-xs text-slate-400">${title}</p><p class="mt-1.5 whitespace-pre-line text-sm text-slate-700">${escapeHtml(value)}</p></div></div>`).join("")}</div></div></div></section><div class="mt-5 grid gap-4 lg:grid-cols-2"><section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><h2 class="mb-3 text-sm font-semibold">学歴</h2><p class="whitespace-pre-line text-sm leading-7 text-slate-600">${escapeHtml(details.education)}</p></section><section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><h2 class="mb-3 text-sm font-semibold">資格</h2><p class="whitespace-pre-line text-sm leading-7 text-slate-600">${escapeHtml(details.qualifications)}</p></section></div><div class="mt-5 space-y-4">${sections}</div>`
}

function selectionEvents(
  state: AppState,

  query: string,

  filter: string,
): string {
  const visible = state.records.filter(
    (record) =>
      (filter === "すべて" || record.type === filter) &&
      record.company.toLowerCase().includes(query.toLowerCase()),
  )

  return `<div class="eyebrow"><span class="size-1.5 rounded-full bg-indigo-500"></span>EVERY EXPERIENCE COUNTS</div>${pageHeading("選考イベント", "出会いと学びを記録して、次の一歩をもっと確かに。", "イベントを追加")}<section class="mb-5 flex items-center gap-4 rounded-2xl bg-indigo-50 p-5"><span class="hidden text-indigo-600 sm:block">${icon("calendar", 24)}</span><div class="flex-1"><h2 class="font-semibold text-indigo-900">経験を、あなたの強みに。</h2><p class="mt-1 text-sm leading-6 text-indigo-800">説明会から面接まで、5種類のイベントをひとつの場所に。振り返りを残して、企業選びに活かしましょう。</p></div>${badge(`${state.records.length}件の記録`, "white")}</section><section class="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><input class="form-input mb-3 max-w-sm" data-query="event" placeholder="企業名で検索" value="${escapeHtml(query)}"><div class="flex flex-wrap gap-2">${["すべて", ...eventTypes].map((type) => `<button data-action="event-filter" data-filter="${type}" class="rounded-full px-3 py-1.5 text-xs ${filter === type ? "bg-indigo-600 text-white" : "border border-slate-200 text-slate-600"}">${type} ${type === "すべて" ? state.records.length : state.records.filter((record) => record.type === type).length}</button>`).join("")}</div></section><div class="space-y-3">${visible.map((record) => `<article class="rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:border-indigo-200"><div class="flex items-start gap-4 p-4 sm:p-5"><span class="hidden rounded-xl bg-slate-50 p-3 text-indigo-600 sm:block">${icon("briefcase", 20)}</span><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><h2 class="font-semibold text-slate-800">${escapeHtml(record.company)}</h2>${badge(record.type, record.type === "面接" ? "peach" : record.type === "説明会" ? "blue" : "indigo")}</div><div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500"><span>${icon("calendar", 13)} ${escapeHtml(record.date.replace(/-/g, "/"))}</span>${record.type !== "適性検査" ? `<span>${icon("clock", 13)} ${escapeHtml(record.start)} – ${escapeHtml(record.end)}</span>` : ""}${record.type === "インターンシップ" ? `<span class="text-indigo-600">${escapeHtml(record.period)}のプログラム</span>` : ""}</div><p class="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-500">${escapeHtml(record.type === "適性検査" ? record.test : record.summary || record.notes || "まだメモはありません。")}</p></div><button class="icon-button shrink-0" data-action="edit-event" data-id="${escapeHtml(record.id)}" aria-label="${escapeHtml(record.company)}の記録を編集">${icon("arrow", 17)}</button></div></article>`).join("")}${
    visible.length
      ? ""
      : `<section class="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center"><span class="text-indigo-500">${icon("calendar", 24)}</span><h2 class="mt-3 font-semibold">まだイベントがありません</h2><p class="mt-1 text-sm text-slate-500">新しい予定や、振り返りを追加してみましょう。</p><div class="mt-4">${button("イベントを追加", { action: "add-event", variant: "outline", iconName: "plus" })}</div></section>`
  }</div>`
}

export function renderPage(
  page: string,

  state: AppState,

  options: {
    week: number

    view: "週" | "月"

    taskFilter: string

    companyQuery: string

    eventQuery: string

    eventFilter: string

    category: string
  },
): string {
  if (page === "企業分析") return companies(state, options.companyQuery)

  if (page === "チャート") return chart(state)

  if (page === "テンプレート") return templates(state, options.category)

  if (page === "自己分析") return profile(state)

  if (page === "選考イベント")
    return selectionEvents(state, options.eventQuery, options.eventFilter)

  return dashboard(state, options.week, options.view, options.taskFilter)
}
