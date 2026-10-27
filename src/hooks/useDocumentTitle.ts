import { useEffect } from 'react'

const APP_NAME = 'Defter'

export function useDocumentTitle(pageTitle: string) {
  useEffect(() => {
    document.title = `${pageTitle} | ${APP_NAME}`
  }, [pageTitle])
}
