import { CarDetail } from '@/components/carDetail'

interface pageProps {
  params: {
    id: string
  }
}

const page = async ({ params }: { params: Promise<pageProps['params']> }) => {
  const resolvedParams = await params
  const { id } = resolvedParams

  return (
    <div className="min-h-[100vh] p-4 mt-40">
      <CarDetail id={id[0]} />
    </div>
  )
}

export default page
