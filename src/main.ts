import { badge, button, escapeHtml, icon } from "./components/atoms"

import { appShell } from "./templates/app-shell"

import { renderPage } from "./pages"

import {
  companyStatuses,
  eventTypes,
  initialState,
  type AppState,
  type CalendarEvent,
  type Company,
  type ProfileDetails,
  type ProfileSection,
  type SelectionRecord,
} from "./model"

import "./index.css"

const STORAGE_KEY = "careernote-demo-state"

const app = document.querySelector<HTMLDivElement>("#app")

if (!app) throw new Error("アプリの表示領域が見つかりません。")

let state = structuredClone(initialState)

let activePage = "ホーム"

let week = 0

let calendarView: "週" | "月" = "週"

let taskFilter = "すべて"

let eventFilter = "すべて"

let eventQuery = ""

let companyQuery = ""

let category = "ガクチカ"

type ModalState = {
  type: string
  id?: string
  company?: string
  date?: string
}

let modal: ModalState | null = null

let accountTab: "login" | "register" = "login"

let backendConnected = false

let saveQueue = Promise.resolve()

let persistTimer = 0

let toastTimer = 0

let eventDraftType = "説明会"

let eventDraftValues: Record<string, string> = {}

const notice = () =>
  backendConnected
    ? ""
    : `<div class="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900"><span class="mt-0.5">${icon("sparkle", 15)}</span><p><strong>ブラウザー内デモモード：</strong>Java サーバーに接続していないため、このブラウザーに変更を保存しています。Java API を起動するとサーバー保存に切り替わります。</p></div>`

function render(): void {
  app!.innerHTML = appShell(
    activePage,

    state.companies.length,

    state.profile,

    renderPage(activePage, state, {
      week,

      view: calendarView,

      taskFilter,

      companyQuery,

      eventQuery,

      eventFilter,

      category,
    }),

    notice(),
  )

  renderModal()
}

function renderModal(): void {
  const root = document.querySelector<HTMLDivElement>("#overlay-root")

  if (!root) return

  if (!modal) {
    root.innerHTML = ""

    return
  }

  if (modal.type === "event") root.innerHTML = eventModal()
  else if (modal.type === "account") root.innerHTML = accountModal()
  else if (modal.type === "edit-profile") root.innerHTML = profileModal()
  else if (modal.type === "company-detail")
    root.innerHTML = companyDetailModal()
  else if (modal.type === "add-company") root.innerHTML = companyModal()
  else root.innerHTML = simpleModal()
}

function eventModal(): string {
  const record =
    state.records.find((item) => item.id === modal?.id) ??
    state.events.find((item) => item.id === modal?.id)

  const details = isSelectionRecord(record) ? record : undefined

  const fieldValue = (name: string, fallback = "") =>
    eventDraftValues[name] ?? fallback

  const company = fieldValue("company", record?.company ?? modal?.company ?? "")

  const type = eventDraftType

  const isInternship = type === "インターンシップ"

  const isTest = type === "適性検査"

  const periodValue = fieldValue("period", details?.period ?? "3日間")

  const periodNumber = periodValue.match(/\d+(?:\.\d+)?/)?.[0] ?? "3"

  const periodUnit = periodValue.includes("週間") ? "週間" : "日間"

  const today = new Date()

  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  const defaultValue = (name: string, fallback: string) =>
    escapeHtml(fieldValue(name, fallback))

  const companyField = modal?.company
    ? `<input type="hidden" name="company" value="${escapeHtml(company)}"><div><span class="form-label">企業名</span><div class="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">${escapeHtml(company)}</div></div>`
    : `<label class="form-label">企業名 <span class="text-rose-500">*</span><input name="company" required class="form-input mt-1.5" placeholder="例：サイボウズ" value="${escapeHtml(company)}"></label>`

  const timeFields = `<fieldset class="sm:col-span-2"><legend class="form-label mb-1.5">時間</legend><div class="grid grid-cols-2 gap-3"><label class="form-label sr-only" for="event-start">開始時刻</label><input id="event-start" name="start" type="time" required class="form-input" aria-label="開始時刻" value="${defaultValue("start", record?.start ?? "10:00")}"><label class="form-label sr-only" for="event-end">終了時刻</label><input id="event-end" name="end" type="time" required class="form-input" aria-label="終了時刻" value="${defaultValue("end", record?.end ?? "11:00")}"></div></fieldset>`

  const descriptionField = (
    name: string,
    label: string,
    placeholder: string,
    fallback = "",
  ) =>
    `<label class="form-label">${label}<textarea name="${name}" class="form-textarea mt-1.5" rows="3" placeholder="${escapeHtml(placeholder)}">${defaultValue(name, fallback)}</textarea></label>`

  let detailFields: string

  if (isInternship) {
    detailFields = `<div class="grid grid-cols-[1fr_150px] gap-3"><label class="form-label">参加期間 <span class="text-rose-500">*</span><input name="period" type="number" min="1" step="1" required class="form-input mt-1.5" placeholder="日数" value="${escapeHtml(fieldValue("period", periodNumber))}"></label><label class="form-label">単位<select name="periodUnit" class="form-select mt-1.5"><option value="日間" ${
      fieldValue("periodUnit", periodUnit) === "日間" ? "selected" : ""
    }>日間</option><option value="週間" ${
      fieldValue("periodUnit", periodUnit) === "週間" ? "selected" : ""
    }>週間</option></select></label></div>${descriptionField("summary", "概要", "プログラムの目的やテーマ", record?.summary ?? "")}${descriptionField("activities", "活動内容（詳細）", "取り組んだ課題や、自分が担当したこと", details?.activities ?? "")}${descriptionField("reflection", "参加後の感想（学んだこと／感じたことなど）", "気づきや、次に活かしたいこと", details?.reflection ?? "")}`
  } else if (isTest) {
    detailFields = `<label class="form-label">適性検査の種類 <span class="text-rose-500">*</span><input name="test" required class="form-input mt-1.5" value="${defaultValue("test", details?.test ?? "SPI")}" placeholder="SPI"></label>`
  } else if (type === "面接") {
    detailFields = `<fieldset><legend class="form-label mb-2">人数</legend><div class="flex flex-wrap gap-5 text-sm text-slate-700"><label class="inline-flex items-center gap-2"><input name="interview" type="radio" value="個人面接" class="size-4 accent-indigo-600" ${
      fieldValue("interview", details?.interview ?? "個人面接") === "個人面接"
        ? "checked"
        : ""
    }>個人面接</label><label class="inline-flex items-center gap-2"><input name="interview" type="radio" value="集団面接" class="size-4 accent-indigo-600" ${
      fieldValue("interview", details?.interview ?? "個人面接") === "集団面接"
        ? "checked"
        : ""
    }>集団面接</label></div></fieldset><label class="form-label">担当者の部署・役職<input name="contact" class="form-input mt-1.5" value="${defaultValue("contact", details?.contact ?? "")}" placeholder="○○さん（部署）"></label>${descriptionField("notes", "聞かれたこと", "質問内容や回答、次回に向けた改善点を記録", details?.notes ?? record?.summary ?? "")}`
  } else {
    detailFields = `<label class="form-label">担当者名（部署）<input name="contact" class="form-input mt-1.5" value="${defaultValue("contact", details?.contact ?? "")}" placeholder="○○さん（部署）"></label>${descriptionField("notes", "メモ", "印象に残ったこと、質問したいことなど", details?.notes ?? record?.summary ?? "")}`
  }

  return `<div class="modal-backdrop" data-action="close-overlay">
    <section class="modal-panel max-w-2xl" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <form id="event-form">
        <header class="flex items-start gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
          <span class="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">${icon("calendar", 20)}</span>
          <div class="flex-1"><h2 id="modal-title" class="font-semibold">${
            record ? "選考イベントを編集" : "選考イベントを追加"
          }</h2><p class="mt-1 text-xs text-slate-500">ひとつの経験を、次のチャンスにつなげよう。</p></div>
          <button type="button" class="icon-button" data-action="close-modal" aria-label="閉じる">${icon("close", 18)}</button>
        </header>
        <div class="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5 sm:px-7">
          <label class="form-label">選考イベント<select name="type" class="form-select mt-1.5">${eventTypes.map((option) => `<option ${type === option ? "selected" : ""}>${option}</option>`).join("")}</select></label>
          ${companyField}
          <label class="form-label">日付 <span class="text-rose-500">*</span><input name="date" type="date" required class="form-input mt-1.5" value="${defaultValue("date", record?.date ?? modal?.date ?? localToday)}"></label>
          ${isTest ? "" : timeFields}
          <div class="space-y-4 border-t border-slate-100 pt-4">
            <h3 class="text-sm font-semibold text-slate-700">${escapeHtml(type)}の詳細</h3>
            ${detailFields}
          </div>
          <p class="text-[11px] text-slate-400">＊ 必須項目　・　デモの記録はブラウザーまたは Java サーバー内に保存されます。</p>
        </div>
        <footer class="flex justify-end gap-2 border-t border-slate-100 px-5 py-4 sm:px-7">${button("キャンセル", { action: "close-modal", variant: "ghost" })}<button type="submit" class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">${icon("check", 16)}${
          record ? "変更を保存" : "イベントを追加"
        }</button></footer>
      </form>
    </section>
  </div>`
}

function accountModal(): string {
  return `<div class="modal-backdrop" data-action="close-overlay"><section class="modal-panel max-w-md p-6 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="account-title"><button type="button" class="icon-button absolute right-4 top-4" data-action="close-modal" aria-label="閉じる">${icon("close", 18)}</button><div class="text-center"><span class="mx-auto grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">${icon("graduation", 25)}</span><h2 id="account-title" class="mt-4 text-lg font-semibold">あなたの「これから」を、ここから。</h2><p class="mt-1 text-xs text-slate-500">CareerNote のアカウントへアクセス</p></div><div class="mt-6 grid grid-cols-2 border-b border-slate-100">${["login", "register"].map((tab) => `<button data-action="account-tab" data-tab="${tab}" class="border-b-2 py-3 text-sm font-medium ${accountTab === tab ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-400"}">${tab === "login" ? "ログイン" : "新規登録"}</button>`).join("")}</div><p class="my-4 rounded-xl bg-sky-50 px-3 py-2 text-xs leading-5 text-sky-800">デザイン確認用のデモです。実際のアカウント作成・認証は行いません。実際のパスワードは入力しないでください。</p><form id="account-form" class="space-y-4">${
    accountTab === "register"
      ? `<label class="form-label">お名前<input name="name" required class="form-input mt-1.5" placeholder="岩崎 太郎"></label>`
      : ""
  }<label class="form-label">メールアドレス<input name="email" type="email" required class="form-input mt-1.5" placeholder="example@mail.com"></label><label class="form-label">パスワード<input name="password" type="password" required minlength="8" pattern="[A-Za-z0-9]+" class="form-input mt-1.5" placeholder="8文字以上・半角英数字"></label><label class="flex items-center gap-2 text-xs text-slate-500"><input type="checkbox" class="size-4 accent-indigo-600">ログイン状態を保存する（デモ）</label><button class="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700">${
    accountTab === "login" ? "ログイン" : "アカウントを作成"
  }</button></form><p class="mt-4 text-center text-xs text-slate-400">一歩ずつ、あなたらしいキャリアへ。</p></section></div>`
}

function profileModal(): string {
  const details = state.profileDetails ?? initialState.profileDetails

  const field = (name: string, label: string, value: string, type = "text") =>
    `<label class="form-label">${label}<input name="${name}" type="${type}" ${
      name === "name" ? "required" : ""
    } class="form-input mt-1.5" value="${escapeHtml(value)}"></label>`

  const textArea = (name: string, label: string, value: string, rows = 4) =>
    `<label class="form-label">${label}<textarea name="${name}" class="form-textarea mt-1.5" rows="${rows}">${escapeHtml(value)}</textarea></label>`

  return `<div class="modal-backdrop" data-action="close-overlay"><section class="modal-panel profile-editor-panel flex flex-col" role="dialog" aria-modal="true" aria-labelledby="modal-title"><form id="profile-form" class="flex min-h-0 flex-col"><header class="flex shrink-0 items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-7"><span class="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">${icon("user", 20)}</span><div class="flex-1"><h2 id="modal-title" class="font-semibold">プロフィールを編集</h2><p class="mt-1 text-xs text-slate-500">基本情報や学歴、自己分析の内容を編集できます。</p></div><button type="button" class="icon-button" data-action="close-modal" aria-label="閉じる">${icon("close", 18)}</button></header><div class="min-h-0 space-y-5 overflow-y-auto px-5 py-5 sm:px-7"><section class="grid gap-5 md:grid-cols-[128px_1fr]"><div class="grid min-h-36 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">${icon("user", 48)}</div><div class="space-y-4">${field("name", "氏名", state.profile)}<div class="grid gap-4 sm:grid-cols-2">${field("birthDate", "生年月日", details.birthDate, "date")}${field("email", "メールアドレス", details.email, "email")}</div>${textArea("address", "現住所", details.address, 2)}</div></section><div class="grid gap-4 lg:grid-cols-2"><section class="space-y-3 rounded-xl border border-slate-100 p-4"><h3 class="border-b border-slate-200 pb-2 text-sm font-semibold">学歴</h3>${textArea("education", "入学・卒業歴（1行に1件）", details.education, 6)}</section><section class="space-y-3 rounded-xl border border-slate-100 p-4"><h3 class="border-b border-slate-200 pb-2 text-sm font-semibold">資格</h3>${textArea("qualifications", "取得年月・資格名（1行に1件）", details.qualifications, 6)}</section></div>${details.sections.map((section, index) => `<section class="space-y-3 rounded-xl border border-slate-100 p-4"><h3 class="border-b border-slate-200 pb-2 text-sm font-semibold">${escapeHtml(section.title)}</h3>${textArea(`section-summary-${index}`, section.title === "ガクチカ" ? "取り組んだテーマ・成果" : "結論", section.summary, 2)}${textArea(`section-details-${index}`, section.title === "ガクチカ" ? "行動プロセス・学んだこと・活動内容など" : "具体的なエピソードと理由", section.details, 4)}</section>`).join("")}</div><footer class="flex shrink-0 justify-end gap-2 border-t border-slate-100 px-5 py-4 sm:px-7">${button("キャンセル", { action: "close-modal", variant: "ghost" })}<button type="submit" class="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">保存する</button></footer></form></section></div>`
}

function simpleModal(): string {
  const kind = modal?.type ?? ""

  const labels: Record<string, string> = {
    "add-task": "タスクを追加",

    "add-template": "テンプレートを追加",
  }

  const title = labels[kind] ?? "編集"

  const fields = `<label class="form-label">内容<input name="name" required class="form-input mt-1.5" placeholder="入力してください"></label>`

  return `<div class="modal-backdrop" data-action="close-overlay"><section class="modal-panel max-w-md" role="dialog" aria-modal="true" aria-labelledby="modal-title"><form id="simple-form"><header class="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h2 id="modal-title" class="font-semibold">${title}</h2><button type="button" class="icon-button" data-action="close-modal" aria-label="閉じる">${icon("close", 18)}</button></header><div class="space-y-4 p-5">${fields}</div><footer class="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">${button("キャンセル", { action: "close-modal", variant: "ghost" })}<button type="submit" class="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white">保存する</button></footer></form></section></div>`
}

function companyModal(): string {
  const field = (
    name: string,

    label: string,

    options: {
      type?: string
      placeholder?: string
      required?: boolean
      value?: string
    } = {},
  ) =>
    `<label class="form-label">${label}${
      options.required ? ` <span class="text-rose-500">*</span>` : ""
    }<input name="${name}" type="${options.type ?? "text"}" ${
      options.required ? "required" : ""
    } ${
      options.type === "number" ? 'min="0"' : ""
    } class="form-input mt-1.5" placeholder="${escapeHtml(options.placeholder ?? "")}" value="${escapeHtml(options.value ?? "")}"></label>`

  const numberField = (
    name: string,

    label: string,

    value: number,
  ) =>
    `<label class="form-label">${label}<div class="mt-1.5 flex items-center gap-2"><input name="${name}" type="number" min="1" max="10" value="${value}" class="form-input"><span class="shrink-0 text-xs text-slate-400">/ 10</span></div></label>`

  return `<div class="modal-backdrop" data-action="close-overlay">
    <section class="modal-panel max-w-2xl" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <form id="company-form">
        <header class="flex items-start gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
          <span class="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">${icon("briefcase", 20)}</span>
          <div class="flex-1"><h2 id="modal-title" class="font-semibold">企業を追加</h2><p class="mt-1 text-xs text-slate-500">企業の情報や募集要項をまとめて管理しましょう。</p></div>
          <button type="button" class="icon-button" data-action="close-modal" aria-label="閉じる">${icon("close", 18)}</button>
        </header>
        <div class="max-h-[70vh] space-y-6 overflow-y-auto px-5 py-5 sm:px-7">
          <section class="space-y-4">
            <h3 class="border-b border-slate-100 pb-2 text-sm font-semibold text-slate-700">基本情報</h3>
            ${field("name", "企業名", { required: true, placeholder: "例：株式会社 CareerNote" })}
            <div class="grid gap-4 sm:grid-cols-2">${field("industry", "業界", { placeholder: "例：ソフトウェア・ITサービス" })}${field("role", "職種", { placeholder: "例：開発エンジニア", value: "エンジニア職" })}</div>
            <div class="grid gap-4 sm:grid-cols-2">${field("url", "企業 URL", { type: "url", placeholder: "https://example.com" })}${field("location", "本社所在地", { placeholder: "例：東京都渋谷区" })}</div>
            <div class="grid gap-4 sm:grid-cols-2">${field("employees", "社員数", { type: "number", placeholder: "例：1000" })}${field("averageAge", "平均年齢", { type: "number", placeholder: "例：35" })}</div>
            <div class="grid gap-4 sm:grid-cols-2">${field("established", "設立", { placeholder: "例：2010年4月" })}${field("capital", "資本金", { placeholder: "例：1億円" })}</div>
            ${field("revenue", "売上高", { placeholder: "例：100億円" })}
            <label class="form-label">事業内容<textarea name="business" class="form-textarea mt-1.5" rows="3" placeholder="企業の事業内容を記録"></textarea></label>
          </section>
          <section class="space-y-4">
            <h3 class="border-b border-slate-100 pb-2 text-sm font-semibold text-slate-700">募集要項</h3>
            <div class="grid gap-4 sm:grid-cols-2">${field("salary", "基本給（月額・円）", { type: "number", required: true, value: "250000" })}${field("hiringCount", "採用人数", { type: "number", placeholder: "例：50" })}</div>
            <div class="grid gap-4 sm:grid-cols-2">${field("workHours", "勤務時間", { placeholder: "例：9:00〜18:00" })}${field("holidays", "休日・休暇", { placeholder: "例：完全週休二日制（土・日）" })}</div>
            <label class="form-label">選考ステータス<select name="status" class="form-select mt-1.5">${companyStatuses.map((status) => `<option ${status === "エントリー" ? "selected" : ""}>${status}</option>`).join("")}</select></label>
          </section>
          <section class="space-y-4">
            <h3 class="border-b border-slate-100 pb-2 text-sm font-semibold text-slate-700">My Data</h3>
            <div class="grid gap-4 sm:grid-cols-3">${numberField("environment", "職場環境", 7)}${numberField("growth", "成長環境", 7)}${numberField("preference", "希望度", 7)}</div>
          </section>
        </div>
        <footer class="flex justify-end gap-2 border-t border-slate-100 px-5 py-4 sm:px-7">${button("キャンセル", { action: "close-modal", variant: "ghost" })}<button type="submit" class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">${icon("plus", 16)}企業を追加</button></footer>
      </form>
    </section>
  </div>`
}

function companyDetailModal(): string {
  const company = state.companies.find((item) => item.name === modal?.company)

  if (!company) return ""

  const infoRow = (label: string, value: string | number | undefined) =>
    `<div class="flex items-start justify-between gap-4 border-b border-dashed border-slate-200 py-2 text-xs"><span class="shrink-0 text-slate-400">${escapeHtml(label)}</span><span class="text-right text-slate-700">${
      value ? escapeHtml(value) : "—"
    }</span></div>`

  const information: Array<[string, string | number | undefined]> = [
    ["業界", company.industry],

    ["職種", company.role],

    ["URL", company.url],

    ["社員数", company.employees ? `${company.employees}名` : undefined],

    ["平均年齢", company.averageAge ? `${company.averageAge}歳` : undefined],

    ["本社所在地", company.location],

    ["設立", company.established],

    ["資本金", company.capital],

    ["売上高", company.revenue],
  ]

  const recruitment: Array<[string, string | number | undefined]> = [
    ["募集職種", company.role],

    [
      "採用人数",
      company.hiringCount ? `${company.hiringCount}名程度` : undefined,
    ],

    ["基本給", `¥${company.salary.toLocaleString("ja-JP")}`],

    ["勤務時間", company.workHours],

    ["休日", company.holidays],

    ["選考ステータス", company.status],
  ]

  return `<div class="modal-backdrop" data-action="close-overlay"><section class="modal-panel max-w-3xl" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 id="modal-title" class="font-semibold">${escapeHtml(company.name)}</h2><p class="mt-1 text-xs text-slate-500">企業情報と選考メモ</p></div><button class="icon-button" data-action="close-modal" aria-label="閉じる">${icon("close", 18)}</button></header><div class="max-h-[70vh] space-y-4 overflow-y-auto p-5"><div class="flex flex-wrap items-center justify-between gap-3">${badge(company.status, "indigo")}<button class="text-sm font-medium text-indigo-600" data-action="company-add-event">${icon("plus", 15)} 選考イベントを追加</button></div><section class="rounded-xl border border-slate-100 p-4"><h3 class="mb-3 text-sm font-semibold">基本情報</h3><div class="grid gap-x-8 sm:grid-cols-2">${information.map(([label, value]) => infoRow(label, value)).join("")}</div>${
    company.business
      ? `<div class="mt-4"><h4 class="text-xs font-medium text-slate-500">事業内容</h4><p class="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">${escapeHtml(company.business)}</p></div>`
      : ""
  }</section><section class="rounded-xl border border-slate-100 p-4"><h3 class="mb-3 text-sm font-semibold">募集要項</h3><div class="grid gap-x-8 sm:grid-cols-2">${recruitment.map(([label, value]) => infoRow(label, value)).join("")}</div></section><section class="rounded-xl border border-slate-100 p-4"><h3 class="mb-3 text-sm font-semibold">My Data</h3><div class="grid gap-x-8 sm:grid-cols-3">${infoRow("職場環境", `${company.environment} / 10`)}${infoRow("成長環境", `${company.growth} / 10`)}${infoRow("希望度", `${company.preference} / 10`)}</div></section>${["企業理念", "説明会・インターンシップ", "面接メモ"].map((title) => `<section class="rounded-xl border border-slate-100 p-4"><h3 class="mb-3 text-sm font-semibold">${title}</h3><textarea class="form-textarea" rows="2" placeholder="${title}を記録する"></textarea></section>`).join("")}</div><footer class="flex justify-end border-t border-slate-100 p-4">${button("完了", { action: "close-modal" })}</footer></section></div>`
}

function showToast(message: string): void {
  const root = document.querySelector<HTMLDivElement>("#toast-root")

  if (!root) return

  root.innerHTML = `<div class="toast-message">${escapeHtml(message)}</div>`

  window.clearTimeout(toastTimer)

  toastTimer = window.setTimeout(() => {
    root.innerHTML = ""
  }, 3500)
}

function persist(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))

  if (!backendConnected) return

  window.clearTimeout(persistTimer)

  persistTimer = window.setTimeout(() => {
    saveQueue = saveQueue

      .catch(() => undefined)

      .then(async () => {
        const response = await fetch("/api/state", {
          method: "PUT",

          headers: { "Content-Type": "application/json" },

          body: JSON.stringify(state),
        })

        if (!response.ok)
          throw new Error(`Java API returned ${response.status}`)
      })

      .catch(() => {
        backendConnected = false

        render()

        showToast(
          "Java サーバーとの接続が切れたため、ブラウザー内に保存しています。",
        )
      })
  }, 300)
}

function saveAndRender(message?: string): void {
  persist()

  render()

  if (message) showToast(message)
}

function makeId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `event-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

function openEvent(event?: CalendarEvent, company = "", date = ""): void {
  eventDraftType =
    event?.type === "インターン"
      ? "インターンシップ"
      : (event?.type ?? "説明会")

  eventDraftValues = {}

  modal = event
    ? { type: "event", id: event.id }
    : { type: "event", company, date }

  renderModal()
}

function recordFromEvent(event: CalendarEvent): SelectionRecord {
  const existing = state.records.find((record) => record.id === event.id)

  return (
    existing ?? {
      ...event,

      type: event.type === "インターン" ? "インターンシップ" : event.type,

      contact: "",

      notes: event.summary,

      interview: "個人面接",

      period: "",

      activities: "",

      reflection: "",

      test: "SPI",
    }
  )
}

function submitEvent(form: HTMLFormElement): void {
  const data = new FormData(form)

  const previous = modal?.id
    ? (state.records.find((record) => record.id === modal?.id) ??
      state.events.find((event) => event.id === modal?.id))
    : undefined

  const type = String(data.get("type") ?? "説明会")

  const start = isTestType(type) ? "" : String(data.get("start") ?? "")

  const end = isTestType(type) ? "" : String(data.get("end") ?? "")

  if (!isTestType(type) && end <= start) {
    form
      .querySelector<HTMLInputElement>('[name="end"]')
      ?.setCustomValidity("終了時刻は開始時刻より後に設定してください。")

    form.reportValidity()

    return
  }

  const record: SelectionRecord = {
    id: previous?.id ?? makeId(),

    company: String(data.get("company") ?? "").trim(),

    title: type,

    type,

    date: String(data.get("date") ?? ""),

    start,

    end,

    summary: String(data.get("summary") ?? data.get("notes") ?? "").trim(),

    contact: String(data.get("contact") ?? ""),

    notes: String(data.get("notes") ?? ""),

    interview: String(data.get("interview") ?? "個人面接"),

    period:
      type === "インターンシップ"
        ? `${String(data.get("period") ?? "1")}${String(data.get("periodUnit") ?? "日間")}`
        : "",

    activities: String(data.get("activities") ?? ""),

    reflection: String(data.get("reflection") ?? ""),

    test: String(data.get("test") ?? "SPI"),
  }

  const wasRecord = state.records.some((item) => item.id === record.id)

  state.records = wasRecord
    ? state.records.map((item) => (item.id === record.id ? record : item))
    : [...state.records, record]

  state.events = state.events.some((event) => event.id === record.id)
    ? state.events.map((event) => (event.id === record.id ? record : event))
    : [...state.events, record]

  modal = null

  saveAndRender(
    "選考イベントを保存しました。記録一覧とカレンダーに反映されています。",
  )
}

function isTestType(type: string): boolean {
  return type === "適性検査"
}

function isSelectionRecord(
  event: CalendarEvent | undefined,
): event is SelectionRecord {
  return Boolean(event && "contact" in event)
}

function submitSimple(form: HTMLFormElement): void {
  const data = new FormData(form)

  const name = String(data.get("name") ?? "").trim()

  if (!name) return

  switch (modal?.type) {
    case "add-task":
      state.tasks.push({
        title: name,
        sub: "タスク",
        date: "11/10",
        done: false,
      })

      break

    case "add-template":
      state.templates.push(name)

      break
  }

  modal = null

  saveAndRender("保存しました")
}

function submitProfile(form: HTMLFormElement): void {
  const data = new FormData(form)
  const name = String(data.get("name") ?? "").trim()

  if (!name) {
    form.querySelector<HTMLInputElement>('[name="name"]')?.focus()
    return
  }

  const current = state.profileDetails ?? initialState.profileDetails
  const value = (key: string) => String(data.get(key) ?? "").trim()
  const profileDetails: ProfileDetails = {
    birthDate: value("birthDate"),
    email: value("email"),
    address: value("address"),
    education: value("education"),
    qualifications: value("qualifications"),
    sections: current.sections.map((section, index) => ({
      title: section.title,
      summary: value(`section-summary-${index}`),
      details: value(`section-details-${index}`),
    })),
  }

  state.profile = name
  state.profileDetails = profileDetails
  modal = null
  saveAndRender("プロフィールを保存しました")
}

function submitCompany(form: HTMLFormElement): void {
  const data = new FormData(form)

  const name = String(data.get("name") ?? "").trim()

  if (!name) return

  if (
    state.companies.some(
      (company) => company.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    showToast("この企業はすでに登録されています。")

    form.querySelector<HTMLInputElement>('[name="name"]')?.focus()

    return
  }

  const readNumber = (field: string, fallback: number): number => {
    const raw = String(data.get(field) ?? "").trim()

    if (!raw) return fallback

    const parsed = Number(raw)

    return Number.isFinite(parsed) ? parsed : fallback
  }

  const company: Company = {
    name,

    status: String(data.get("status") ?? "エントリー"),

    salary: readNumber("salary", 250000),

    role: String(data.get("role") ?? "").trim() || "エンジニア職",

    environment: Math.min(10, Math.max(1, readNumber("environment", 7))),

    growth: Math.min(10, Math.max(1, readNumber("growth", 7))),

    preference: Math.min(10, Math.max(1, readNumber("preference", 7))),

    industry: String(data.get("industry") ?? "").trim(),

    url: String(data.get("url") ?? "").trim(),

    employees: readNumber("employees", 0) || undefined,

    averageAge: readNumber("averageAge", 0) || undefined,

    location: String(data.get("location") ?? "").trim(),

    established: String(data.get("established") ?? "").trim(),

    capital: String(data.get("capital") ?? "").trim(),

    revenue: String(data.get("revenue") ?? "").trim(),

    workHours: String(data.get("workHours") ?? "").trim(),

    holidays: String(data.get("holidays") ?? "").trim(),

    hiringCount: readNumber("hiringCount", 0) || undefined,

    business: String(data.get("business") ?? "").trim(),
  }

  state.companies.push(company)

  modal = null

  saveAndRender("企業を追加しました")
}

function loadLocalState(): void {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    state = structuredClone(initialState)

    return
  }

  try {
    const parsed: unknown = JSON.parse(stored)

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "companies" in parsed &&
      "events" in parsed &&
      "tasks" in parsed &&
      "records" in parsed &&
      "templates" in parsed
    ) {
      state = (parsed as AppState)
    } else {
      throw new Error("ブラウザーに保存されたデータの形式が正しくありません。")
    }
  } catch (error) {
    console.error("保存データを読み込めませんでした。", error)

    state = structuredClone(initialState)

    showToast("保存データを読み込めなかったため、初期データを表示しています。")
  }
}

function isProfileSection(value: unknown): value is ProfileSection {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    typeof value.title === "string" &&
    "summary" in value &&
    typeof value.summary === "string" &&
    "details" in value &&
    typeof value.details === "string"
  )
}

function isProfileDetails(value: unknown): value is ProfileDetails {
  return (
    typeof value === "object" &&
    value !== null &&
    "birthDate" in value &&
    typeof value.birthDate === "string" &&
    "email" in value &&
    typeof value.email === "string" &&
    "address" in value &&
    typeof value.address === "string" &&
    "education" in value &&
    typeof value.education === "string" &&
    "qualifications" in value &&
    typeof value.qualifications === "string" &&
    "sections" in value &&
    Array.isArray(value.sections) &&
    value.sections.every(isProfileSection)
  )
}

function readCachedProfileDetails(): ProfileDetails | undefined {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) return undefined

  try {
    const parsed: unknown = JSON.parse(stored)

    if (typeof parsed !== "object" || parsed === null) return undefined

    if (!("profileDetails" in parsed)) return undefined

    if (!isProfileDetails(parsed.profileDetails)) {
      throw new Error("保存されたプロフィールの形式が正しくありません。")
    }

    return parsed.profileDetails
  } catch (error) {
    console.error("保存されたプロフィールを読み込めませんでした。", error)
  }

  return undefined
}

async function initialize(): Promise<void> {
  try {
    const response = await fetch("/api/state")

    if (!response.ok) throw new Error(`Java API returned ${response.status}`)

    state = ((await response.json()) as AppState)

    backendConnected = true
  } catch {
    backendConnected = false

    loadLocalState()
  }

  state.profileDetails =
    readCachedProfileDetails() ??
    state.profileDetails ??
    structuredClone(initialState.profileDetails)

  render()
}

app.addEventListener("click", (event) => {
  const target = event.target

  if (!(target instanceof Element)) return

  const control = target.closest<HTMLElement>("[data-action]")

  if (!control) return

  const action = control.dataset.action

  if (action === "close-overlay" && target !== control) return

  switch (action) {
    case "navigate":
      activePage = control.dataset.page ?? "ホーム"

      render()

      break

    case "primary-add":
      if (activePage === "企業分析" || activePage === "チャート") {
        modal = { type: "add-company" }

        renderModal()
      } else if (activePage === "テンプレート") {
        modal = { type: "add-template" }

        renderModal()
      } else if (activePage === "自己分析") {
        modal = { type: "edit-profile" }

        renderModal()
      } else if (activePage === "選考イベント") openEvent()
      else openEvent()

      break

    case "add-task":
      modal = { type: "add-task" }

      renderModal()

      break

    case "add-event":
      openEvent()

      break

    case "edit-event": {
      const item =
        state.records.find((record) => record.id === control.dataset.id) ??
        state.events[Number(control.dataset.index)]

      if (item) openEvent(item)

      break
    }

    case "calendar-event": {
      const item = state.events.find(
        (entry) => entry.id === control.dataset.eventId,
      )

      if (item) openEvent(recordFromEvent(item))

      break
    }

    case "calendar-add":
      openEvent(undefined, "", control.dataset.date ?? "")

      break

    case "calendar-prev":
      week -= 1

      render()

      break

    case "calendar-next":
      week += 1

      render()

      break

    case "calendar-today":
      week = 0

      render()

      break

    case "calendar-view":
      calendarView = control.dataset.view === "月" ? "月" : "週"

      render()

      break

    case "task-filter":
      taskFilter = control.dataset.filter ?? "すべて"

      render()

      break

    case "toggle-task": {
      const task = state.tasks[Number(control.dataset.index)]

      if (task) task.done = !task.done

      saveAndRender()

      break
    }

    case "event-filter":
      eventFilter = control.dataset.filter ?? "すべて"

      render()

      break

    case "company-detail":
      modal = { type: "company-detail", company: control.dataset.company }

      renderModal()

      break

    case "company-add-event":
      openEvent(undefined, modal?.company)

      break

    case "template-category":
      category = control.dataset.category ?? category

      render()

      break

    case "remove-template": {
      const index = Number(control.dataset.index)

      state.templates.splice(index, 1)

      saveAndRender("テンプレートを削除しました")

      break
    }

    case "copy-template": {
      const text = state.templates[Number(control.dataset.index)]

      if (text) {
        void navigator.clipboard.writeText(text).then(
          () => showToast("文章をコピーしました"),

          (error: unknown) => {
            console.error("文章をコピーできませんでした。", error)

            showToast(
              "文章をコピーできませんでした。ブラウザーの権限を確認してください。",
            )
          },
        )
      }

      break
    }

    case "edit-profile":
      modal = { type: "edit-profile" }

      renderModal()

      break

    case "save-profile-note":
      showToast("この画面内で編集内容を反映しました")

      break

    case "account":
      modal = { type: "account" }

      renderModal()

      break

    case "account-tab":
      accountTab = control.dataset.tab === "register" ? "register" : "login"

      renderModal()

      break

    case "close-modal":
      modal = null

      renderModal()

      break

    case "close-overlay":
      if (target === control) {
        modal = null

        renderModal()
      }

      break

    case "notification":
      showToast("今日の締切が1件あります。タスクを確認しましょう。")

      break
  }
})

app.addEventListener("input", (event) => {
  const target = event.target

  if (
    !(
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    )
  )
    return

  target.setCustomValidity("")

  const selectionStart = target.selectionStart

  const selector = target.dataset.query

  if (selector === "company") {
    companyQuery = target.value

    render()

    const replacement = app!.querySelector<HTMLInputElement>(
      '[data-query="company"]',
    )

    replacement?.focus()

    if (selectionStart !== null)
      replacement?.setSelectionRange(selectionStart, selectionStart)
  } else if (selector === "event") {
    eventQuery = target.value

    render()

    const replacement = app!.querySelector<HTMLInputElement>(
      '[data-query="event"]',
    )

    replacement?.focus()

    if (selectionStart !== null)
      replacement?.setSelectionRange(selectionStart, selectionStart)
  } else if (target.dataset.templateIndex !== undefined) {
    const index = Number(target.dataset.templateIndex)

    state.templates[index] = target.value

    const counter = app!.querySelector<HTMLElement>(
      `[data-count-index="${index}"]`,
    )

    const limit = 200 + index * 100

    if (counter) {
      counter.textContent = `${target.value.length}字 / ${limit}字`

      counter.className = `template-count text-xs ${
        target.value.length > limit ? "text-rose-600" : "text-slate-400"
      }`
    }

    persist()
  }
})

app.addEventListener("change", (event) => {
  const target = event.target

  if (!(target instanceof HTMLSelectElement)) return

  if (target.name === "type" && target.form?.id === "event-form") {
    const nextValues = { ...eventDraftValues }

    for (const [key, value] of new FormData(target.form).entries()) {
      if (typeof value === "string") nextValues[key] = value
    }

    eventDraftValues = nextValues

    eventDraftType = target.value

    renderModal()

    return
  }

  if (target.dataset.companyStatus) {
    const company = state.companies.find(
      (item) => item.name === target.dataset.companyStatus,
    )

    if (company) company.status = target.value

    saveAndRender()
  }
})

app.addEventListener("submit", (event) => {
  const target = event.target

  if (!(target instanceof HTMLFormElement)) return

  event.preventDefault()

  if (target.id === "profile-form") submitProfile(target)
  else if (target.id === "event-form") submitEvent(target)
  else if (target.id === "company-form") submitCompany(target)
  else if (target.id === "simple-form") submitSimple(target)
  else if (target.id === "account-form") {
    if (!target.reportValidity()) return

    modal = null

    render()

    showToast("入力を確認しました。デモのため送信・保存はしていません。")
  }
})

void initialize()
