import RatePageContent from './_client'

export function generateStaticParams() {
  return [{ appointmentId: 'appt_demo' }]
}

export default function RatePage({ params }: { params: { appointmentId: string } }) {
  return <RatePageContent params={params} />
}
