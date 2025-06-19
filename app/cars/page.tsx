'use client'

import { useEffect, useState, Suspense } from 'react'
import Cookies from 'js-cookie'
import { useSearchParams } from 'next/navigation'
import { InitialCars } from '@/lib/data'
import { Car } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'

const CarList = () => {
  const userId = Cookies.get('user') || 'user'
  const [cars, setCars] = useState<Car[]>([])

  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')

  useEffect(() => {
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
  }, [userId, filter])

  return (
    <div className="min-h-[100vh] p-4 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {cars.map((car: Car, index) => (
          <Link href={`/cars/${car.id}`} key={index} className="p-4">
            <div className="relative h-60">
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
            <p className="text-xl">Год выпуска: {car.releaseDate}</p>
            <p className="text-xl">Пробег: {car.mileage} км</p>
            <p className="text-xl">Оценка: {car.rating}</p>
            <p className="text-xl">Начальная стоимость: {car.price} руб.</p>
            <p className="text-xl">Срок действия: {car.endDate}</p>
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
