'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { redirect, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Car, User } from '@/lib/types'

const Page = ({}) => {
  const userId = Cookies.get('user')
  const [formData, setFormData] = useState<Car>({
    id: 0,
    image: '',
    mark: '',
    model: '',
    releaseDate: 0,
    mileage: 0,
    endDate: '',
    rating: 0
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (!userId) {
      redirect('/login')
    }
  }, [userId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'image' && e.target.files) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string // Set the Base64 string
        }))
      }

      if (file) {
        reader.readAsDataURL(file) // Convert to Base64
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]:
          name === 'releaseDate' || name === 'mileage' || name === 'rating'
            ? Number(value)
            : value
      }))
    }
  }

  const router = useRouter()

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.image)
      newErrors.image = 'Изображение обязательно для заполнения.'
    if (!formData.mark) newErrors.mark = 'Марка обязательна для заполнения.'
    if (!formData.model) newErrors.model = 'Модель обязательна для заполнения.'
    if (!formData.releaseDate)
      newErrors.releaseDate = 'Год выпуска обязателен для заполнения.'
    if (!formData.mileage)
      newErrors.mileage = 'Пробег обязателен для заполнения.'
    if (!formData.endDate)
      newErrors.endDate =
        'Окончание даты размещения обязательно для заполнения.'
    if (!formData.rating)
      newErrors.rating = 'Оценка автомобиля обязательна для заполнения.'

    if (
      formData.releaseDate <= 1885 ||
      formData.releaseDate > new Date().getFullYear()
    ) {
      newErrors.releaseDate = 'Введите корректный год выпуска.'
    }
    if (formData.mileage < 0) {
      newErrors.mileage = 'Пробег не может быть отрицательным.'
    }
    if (formData.rating < 0 || formData.rating > 10) {
      newErrors.rating = 'Оценка должна быть от 0 до 10.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!userId) {
      redirect('/login')
    }

    if (!validateForm()) {
      return
    }

    const storedCars = localStorage.getItem('cars')
    const cars: Car[] = storedCars ? JSON.parse(storedCars) : []

    const newId = cars.length > 0 ? Math.max(...cars.map(car => car.id)) + 1 : 1

    const newCar: Car = {
      ...formData,
      id: newId
    }

    cars.push(newCar)
    localStorage.setItem('cars', JSON.stringify(cars))

    const storedUser = localStorage.getItem(userId)
    if (storedUser) {
      const user: User = JSON.parse(storedUser)
      user.addedCars.push(newCar.id.toString())
      localStorage.setItem(userId, JSON.stringify(user))
    }

    alert('Автомобиль успешно добавлен!')
    setFormData({
      id: 0,
      image: '',
      mark: '',
      model: '',
      releaseDate: 0,
      mileage: 0,
      endDate: '',
      rating: 0
    })
    setErrors({})

    router.push(`/cars/${newCar.id}`)
  }

  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <div className="border-2 p-4">
        <h1 className="text-4xl font-bold mb-10">
          Форма добавления автомобиля
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Изображение</Label>
            <Input
              required
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
            {errors.image && <p className="text-red-500">{errors.image}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Марка</Label>
            <Input
              required
              type="text"
              name="mark"
              value={formData.mark}
              onChange={handleChange}
            />
            {errors.mark && <p className="text-red-500">{errors.mark}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Модель</Label>
            <Input
              required
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
            />
            {errors.model && <p className="text-red-500">{errors.model}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Год выпуска</Label>
            <Input
              required
              type="number"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
            />
            {errors.releaseDate && (
              <p className="text-red-500">{errors.releaseDate}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Пробег</Label>
            <Input
              required
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
            />
            {errors.mileage && <p className="text-red-500">{errors.mileage}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Окончание даты размещения</Label>
            <Input
              required
              type="text"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
            {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Оценка автомобиля</Label>
            <Input
              required
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            />
            {errors.rating && <p className="text-red-500">{errors.rating}</p>}
          </div>
          <Button type="submit" className="self-end">
            Сохранить
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Page
