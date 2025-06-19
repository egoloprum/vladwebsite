'use client'

import { FC, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { redirect, useRouter } from 'next/navigation'
import { Car, User } from '@/lib/types'
import Image from 'next/image'
import { Button } from './ui/button'

interface CarDetailProps {
  id: string
}

export const CarDetail: FC<CarDetailProps> = ({ id }) => {
  const userId = Cookies.get('user') || 'user'
  const [car, setCar] = useState<Car | null>(null)
  const [isCarCreatedByUser, setIsCarCreatedByUser] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {
    const storedCars = localStorage.getItem('cars')
    if (storedCars) {
      const cars: Car[] = JSON.parse(storedCars)

      const foundCar = cars.find(car => car.id === Number(id))
      if (foundCar) {
        setCar(foundCar)
      }

      const userData = localStorage.getItem(userId)
      if (userData) {
        const user: User = JSON.parse(userData)
        setIsCarCreatedByUser(user.addedCars.includes(id))
      }
    }
  }, [userId, id])

  if (!car) {
    return <p>Загрузка...</p>
  }

  const clickHandler = (carId: number) => {
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
      redirect('/login')
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

  const handleDeleteCar = () => {
    if (!userId) {
      redirect('/login')
    }
    const userData = localStorage.getItem(userId)
    if (userData) {
      const user: User = JSON.parse(userData)
      user.addedCars = user.addedCars.filter(carId => carId !== id)

      localStorage.setItem(userId, JSON.stringify(user))
      const storedCars = localStorage.getItem('cars')
      if (storedCars) {
        const cars: Car[] = JSON.parse(storedCars)
        const updatedCars = cars.filter(car => car.id !== Number(id))
        localStorage.setItem('cars', JSON.stringify(updatedCars))
      }
      alert('Автомобиль успешно удален!')
      setCar(null)

      router.push('/cars')
    } else {
      alert('Пользователь не найден!')
    }
  }

  return (
    <div>
      <div className="p-4 rounded flex gap-8 justify-center">
        <div className="relative h-60 w-150">
          <Image
            src={car.image}
            className="w-full h-32 object-cover mb-2"
            fill
            alt={`${car.mark} ${car.model}`}
          />
        </div>
        <div>
          <p className="text-2xl font-semibold">
            {car.mark} {car.model}
          </p>
          <p className="text-xl">Год выпуска: {car.releaseDate}</p>
          <p className="text-xl">Пробег: {car.mileage} км</p>
          <p className="text-xl">Оценка: {car.rating}</p>
          <p className="text-xl">Начальная стоимость: {car.price} руб.</p>
          <p className="text-xl">Срок действия: {car.endDate}</p>
          <div className="flex flex-col">
            <Button
              type="button"
              className="mt-4 cursor-pointer p-6 text-xl"
              onClick={() => clickHandler(car.id)}>
              Добавить в Избранные
            </Button>
            <Button
              type="button"
              className="mt-4 cursor-pointer p-6 text-xl"
              onClick={handleDownloadClick}>
              Скачать аукционный лист
            </Button>
            {isCarCreatedByUser && (
              <Button
                type="button"
                className="mt-4 cursor-pointer p-6 text-xl"
                onClick={handleDeleteCar}>
                Удалить автомобиль
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetail
