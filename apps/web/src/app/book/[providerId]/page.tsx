import BookingPageContent from './_client'

export function generateStaticParams() {
  return [{ providerId: 'prov_001' }]
}

export default function BookingPage({ params }: { params: { providerId: string } }) {
  return <BookingPageContent params={params} />
}
