export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",

      "<": "&lt;",

      ">": "&gt;",

      '"': "&quot;",

      "'": "&#39;",
    }

    return entities[character]
  })
}

const paths: Record<string, string> = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',

  briefcase:
    '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18m-12 0v2h6v-2"/>',

  chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/>',

  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8m-8 4h8"/>',

  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',

  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',

  plus: '<path d="M12 5v14m-7-7h14"/>',

  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',

  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 13h4"/>',

  chevron: '<path d="m9 18 6-6-6-6"/>',

  left: '<path d="m15 18-6-6 6-6"/>',

  right: '<path d="m9 18 6-6-6-6"/>',

  check: '<path d="m5 12 4 4L19 6"/>',

  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',

  video:
    '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/>',

  sparkle:
    '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2zM19 14l1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2z"/>',

  close: '<path d="m18 6-12 12M6 6l12 12"/>',

  trash: '<path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6"/>',

  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',

  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',

  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',

  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',

  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12"/><circle cx="12" cy="12" r="3"/>',

  location:
    '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/>',

  graduation:
    '<path d="m2 10 10-6 10 6-10 6z"/><path d="M6 12v5c4 3 8 3 12 0v-5m4-2v7"/>',

  arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
}

export function icon(name: string, size = 18, className = ""): string {
  const content = paths[name] ?? paths.sparkle

  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`
}

export function button(
  label: string,

  options: {
    action?: string

    variant?: "primary" | "outline" | "ghost" | "danger"

    iconName?: string

    type?: "button" | "submit"

    extra?: string

    disabled?: boolean
  } = {},
): string {
  const variant = options.variant ?? "primary"

  const colors = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",

    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",

    ghost: "text-slate-600 hover:bg-slate-100",

    danger: "bg-rose-50 text-rose-700 hover:bg-rose-100",
  }

  const disabled = options.disabled ? "disabled" : ""

  return `<button type="${options.type ?? "button"}" ${
    options.action ? `data-action="${escapeHtml(options.action)}"` : ""
  } class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${colors[variant]} ${options.extra ?? ""}" ${disabled}>${
    options.iconName ? icon(options.iconName, 17) : ""
  }<span>${escapeHtml(label)}</span></button>`
}

export function badge(label: string, tone = "slate"): string {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-600",

    indigo: "bg-indigo-50 text-indigo-700",

    blue: "bg-sky-50 text-sky-700",

    peach: "bg-orange-50 text-orange-700",

    green: "bg-emerald-50 text-emerald-700",

    purple: "bg-violet-50 text-violet-700",

    red: "bg-rose-50 text-rose-700",

    white: "bg-white text-indigo-700",
  }

  return `<span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone] ?? tones.slate}">${escapeHtml(label)}</span>`
}
