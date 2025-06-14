import { CarDetail } from '@/components/carDetail'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface pageProps {
  params: {
    id: string
  }
}

const page = async ({ params }: { params: Promise<pageProps['params']> }) => {
  const resolvedParams = await params
  const { id } = resolvedParams

  return (
    <div className="min-h-[100vh] p-4">
      <h1 className="text-4xl font-bold text-center mb-10">
        Страница автомобиля
      </h1>
      <Link href="/cars">
        <Button type="button" className="cursor-pointer">
          Список карточек автомобилей
        </Button>
      </Link>
      <CarDetail id={id} />
    </div>
  )
}

export default page
