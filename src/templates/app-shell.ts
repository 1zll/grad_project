import { footer, sidebar, topbar } from "../components/organisms"

export function appShell(
  page: string,

  companyCount: number,

  profileName: string,

  content: string,

  notice = "",
): string {
  return `<div class="app-shell">${sidebar(page, companyCount, profileName)}<div class="main-shell">${topbar(page)}<main class="content">${notice}${content}${footer()}</main></div></div><div id="overlay-root"></div><div id="toast-root" aria-live="polite"></div>`
}
