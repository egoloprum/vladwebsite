'use client'

import { useEffect, useState, Suspense } from 'react'
import Cookies from 'js-cookie'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { InitialCars } from '@/lib/data'
import { Car } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const CarList = () => {
  const userId = Cookies.get('user')
  const [cars, setCars] = useState<Car[]>([])

  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')

  useEffect(() => {
    if (!userId) {
      redirect('/login')
    } else {
      const storedCars = localStorage.getItem('cars')
      const storedUser = localStorage.getItem(userId)

      switch (filter) {
        case 'chosen':
          if (storedCars && storedUser) {
            const cars: Car[] = JSON.parse(storedCars)
            const user = JSON.parse(storedUser)
            const filteredCars = cars.filter(car =>
              user.markedCars.includes(car.id.toString())
            )
            setCars(filteredCars)
          }
          break

        case 'mycars':
          if (storedCars && storedUser) {
            const cars: Car[] = JSON.parse(storedCars)
            const user = JSON.parse(storedUser)
            const filteredCars = cars.filter(car =>
              user.addedCars.includes(car.id.toString())
            )
            setCars(filteredCars)
          }
          break

        case null:
          if (!storedCars) {
            localStorage.setItem('cars', JSON.stringify(InitialCars))
            setCars(InitialCars)
          } else {
            setCars(JSON.parse(storedCars))
          }
          break
        default:
          break
      }
    }
  }, [userId, filter])

  const router = useRouter()

  const clickHandler = () => {
    Cookies.remove('user')
    router.push('/login')
  }

  return (
    <div className="min-h-[100vh] p-4">
      <h1 className="text-4xl font-bold text-center mb-10">
        Список карточек автомобилей
      </h1>

      <div className="flex gap-4">
        <Link href="/profile">
          <Button type="button" className="cursor-pointer">
            Профиль
          </Button>
        </Link>

        <Button type="button" className="cursor-pointer" onClick={clickHandler}>
          Выход из системы
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {cars.map((car: Car, index) => (
          <Link
            href={`/cars/${car.id}`}
            key={index}
            className="border p-4 rounded">
            <div className="relative h-50">
              <Image
                src={car.image}
                className="w-full h-32 object-cover mb-2"
                fill
                alt={`${car.mark} ${car.model}`}
              />
            </div>
            <p className="text-xl font-semibold">
              {car.mark} {car.model}
            </p>
            <p>Год выпуска: {car.releaseDate}</p>
            <p>Пробег: {car.mileage} км</p>
            <p>Оценка: {car.rating}</p>
            <p>Срок действия: {car.endDate}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarList />
    </Suspense>
  )
}

export default Page
