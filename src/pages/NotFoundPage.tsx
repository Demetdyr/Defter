import { Link } from 'react-router'
import { PageHeader } from '../components/PageHeader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Sayfa bulunamadı')

  return (
    <>
      <PageHeader title="Sayfa bulunamadı" />
      <div className="gutter-x max-w-2xl">
        <p className="text-lg leading-relaxed text-ink-soft">
          Aradığın sayfa bu defterde yok. Adresi kontrol et ya da görev listesine dön.
        </p>
        <Link to="/" className="button-primary mt-6">
          Görevlere dön
        </Link>
      </div>
    </>
  )
}
