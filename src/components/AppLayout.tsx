import { Outlet, ScrollRestoration } from 'react-router'
import { NotebookCover } from './NotebookCover'
import { StorageNote } from './StorageNote'

export function AppLayout() {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[19rem_minmax(0,1fr)] xl:grid-cols-[21rem_minmax(0,1fr)]">
      <a
        href="#page-content"
        className="sr-only rounded bg-marker px-3 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        İçeriğe geç
      </a>
      <NotebookCover />
      <div className="notebook-page flex min-w-0 flex-col">
        <main id="page-content" tabIndex={-1} className="flex-1 pb-16 focus:outline-none">
          <Outlet />
        </main>
        <footer className="gutter-x pb-8 text-ink-soft lg:hidden">
          <StorageNote />
        </footer>
      </div>
      <ScrollRestoration />
    </div>
  )
}
