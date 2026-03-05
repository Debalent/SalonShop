import ProviderProfileContent from './_client'

export function generateStaticParams() {
  return [{ slug: 'alex-rivera' }]
}

export default function ProviderProfilePage({ params }: { params: { slug: string } }) {
  return <ProviderProfileContent params={params} />
}
