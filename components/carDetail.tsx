'use client'

import { FC, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { redirect } from 'next/navigation'
import { Car, User } from '@/lib/types'
import Image from 'next/image'
import { Button } from './ui/button'

interface CarDetailProps {
  id: string
}

export const CarDetail: FC<CarDetailProps> = ({ id }) => {
  const userId = Cookies.get('user')
  const [car, setCar] = useState<Car | null>(null)

  useEffect(() => {
    if (!userId) {
      redirect('/login')
    } else {
      const storedCars = localStorage.getItem('cars')
      if (storedCars) {
        const cars: Car[] = JSON.parse(storedCars)

        const foundCar = cars.find(car => car.id === Number(id))
        if (foundCar) {
          setCar(foundCar)
        }
      }
    }
  }, [userId, id])

  if (!car) {
    return <p>Загрузка...</p>
  }

  const clickHandler = (carId: number) => {
    if (!userId) {
      redirect('/login')
    }
    const userData = localStorage.getItem(userId)
    if (userData) {
      const user: User = JSON.parse(userData)
      if (!user.markedCars.includes(carId.toString())) {
        user.markedCars.push(carId.toString())
        localStorage.setItem(userId, JSON.stringify(user))
        alert('Автомобиль добавлен в Избранные!')
      } else {
        alert('Этот автомобиль уже в Избранных!')
      }
    } else {
      alert('Пользователь не найден!')
    }
  }

  const handleDownloadClick = () => {
    if (!car.auctionList) {
      alert('Аукционный лист недоступен')
      return
    }

    try {
      const link = document.createElement('a')
      link.href = car.auctionList
      link.download = 'аукционный_лист.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => URL.revokeObjectURL(car.auctionList), 10000)
    } catch {
      alert('Ошибка при загрузке аукционного листа.')
    }
  }

  return (
    <div>
      <div className="p-4 rounded flex gap-8 justify-center">
        <div className="relative h-50 w-100">
          <Image
            src={car.image}
            className="w-full h-32 object-cover mb-2"
            fill
            alt={`${car.mark} ${car.model}`}
          />
        </div>
        <div>
          <p className="text-xl font-semibold">
            {car.mark} {car.model}
          </p>
          <p>Год выпуска: {car.releaseDate}</p>
          <p>Пробег: {car.mileage} км</p>
          <p>Оценка: {car.rating}</p>
          <p>Срок действия: {car.endDate}</p>
          <div className="flex flex-col">
            <Button
              type="button"
              className="mt-4 cursor-pointer"
              onClick={() => clickHandler(car.id)}>
              Добавить в Избранные
            </Button>
            <Button
              type="button"
              className="mt-4 cursor-pointer"
              onClick={handleDownloadClick}>
              Скачать аукционный лист
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetail
