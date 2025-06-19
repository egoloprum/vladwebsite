'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { redirect, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Car, User } from '@/lib/types'

const Page = () => {
  const userId = Cookies.get('user')
  const [formData, setFormData] = useState<Car>({
    id: 0,
    image: '',
    mark: '',
    model: '',
    releaseDate: 0,
    mileage: 0,
    endDate: '',
    price: 0,
    rating: 0,
    auctionList: ''
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  const [helperFields, setHelperFields] = useState({
    frontBumper: '',
    rearBumper: '',
    hood: '',
    trunk: '',
    frontRightFender: '',
    frontLeftFender: '',
    rearRightFender: '',
    rearLeftFender: '',
    rightThreshold: '',
    leftThreshold: '',
    frontRightDoor: '',
    frontLeftDoor: '',
    rearRightDoor: '',
    rearLeftDoor: '',
    frontRightWindow: '',
    frontLeftWindow: '',
    rearRightWindow: '',
    rearLeftWindow: '',
    windshield: '',
    rearWindow: '',
    roof: '',
    interior: ''
  })

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
          image: reader.result as string
        }))
      }

      if (file) {
        reader.readAsDataURL(file)
      }
    } else if (name === 'pdf' && e.target.files) {
      const file = e.target.files[0]
      setPdfFile(file)
    } else if (name in helperFields) {
      setHelperFields(prev => ({
        ...prev,
        [name]: value
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]:
          name === 'releaseDate' || name === 'mileage' || name === 'price'
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
    if (!formData.price)
      newErrors.rating = 'Оценка автомобиля обязательна для заполнения.'
    if (!pdfFile)
      newErrors.auctionList = 'Аукционный лист обязателен для заполнения.'

    if (
      formData.releaseDate <= 1885 ||
      formData.releaseDate > new Date().getFullYear()
    ) {
      newErrors.releaseDate = 'Введите корректный год выпуска.'
    }
    if (formData.mileage < 0) {
      newErrors.mileage = 'Пробег не может быть отрицательным.'
    }
    if (formData.price < 0 || formData.price > 100000000) {
      newErrors.price = 'Начальная стоимость должна быть от 0 до 100000000.'
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

    const isAnyHelperFieldFilled = Object.values(helperFields).some(
      field => field.trim() !== ''
    )

    const newCar: Car = {
      ...formData,
      id: newId,
      rating: isAnyHelperFieldFilled ? 4.5 : 5
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const pdfBase64 = reader.result as string
      newCar.auctionList = pdfBase64
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
        price: 0,
        rating: 0,
        auctionList: ''
      })
      setErrors({})
      setPdfFile(null)
      setHelperFields({
        frontBumper: '',
        rearBumper: '',
        hood: '',
        trunk: '',
        frontRightFender: '',
        frontLeftFender: '',
        rearRightFender: '',
        rearLeftFender: '',
        rightThreshold: '',
        leftThreshold: '',
        frontRightDoor: '',
        frontLeftDoor: '',
        rearRightDoor: '',
        rearLeftDoor: '',
        frontRightWindow: '',
        frontLeftWindow: '',
        rearRightWindow: '',
        rearLeftWindow: '',
        windshield: '',
        rearWindow: '',
        roof: '',
        interior: ''
      })

      router.push(`/cars/${newCar.id}`)
    }

    if (pdfFile) {
      reader.readAsDataURL(pdfFile)
    }
  }

  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <div className="p-4 max-w-[700px] my-30">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Добавление нового автомобиля
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Изображение</Label>
              <Input
                required
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                placeholder="Выберите файл"
              />
              {errors.image && <p className="text-red-500">{errors.image}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Марка</Label>
              <Input
                required
                type="text"
                name="mark"
                value={formData.mark}
                onChange={handleChange}
                placeholder="Марка"
              />
              {errors.mark && <p className="text-red-500">{errors.mark}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Модель</Label>
              <Input
                required
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Модель"
              />
              {errors.model && <p className="text-red-500">{errors.model}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Год выпуска</Label>
              <Input
                required
                type="number"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                placeholder="Год выпуска"
              />
              {errors.releaseDate && (
                <p className="text-red-500">{errors.releaseDate}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Пробег</Label>
              <Input
                required
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="Пробег"
              />
              {errors.mileage && (
                <p className="text-red-500">{errors.mileage}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Окончание даты размещения
              </Label>
              <Input
                required
                type="text"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                placeholder="Дата"
              />
              {errors.endDate && (
                <p className="text-red-500">{errors.endDate}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Начальная стоимость, руб.
              </Label>
              <Input
                required
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Начальная стоимость"
              />
              {errors.price && <p className="text-red-500">{errors.price}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Аукционный лист</Label>
              <Input
                required
                type="file"
                name="pdf"
                accept="application/pdf"
                onChange={handleChange}
              />
              {errors.auctionList && (
                <p className="text-red-500">{errors.auctionList}</p>
              )}
            </div>
          </div>
          <p className="text-center text-xl">
            Следующие поля заполняются на основе данных аукционного листа.
            <br></br>В случае отсутствия дефектов или отсутствия элемента в
            конструкции
            <br></br>автомобиля поле соответствующего элемента необходимо
            оставить пустым.
          </p>

          {/* helper fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Передний бампер</Label>
              <Input
                type="text"
                name="frontBumper"
                value={helperFields.frontBumper}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Задний бампер</Label>
              <Input
                type="text"
                name="rearBumper"
                value={helperFields.rearBumper}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Крышка капота</Label>
              <Input
                type="text"
                name="hood"
                value={helperFields.hood}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Крышка багажника</Label>
              <Input
                type="text"
                name="trunk"
                value={helperFields.trunk}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Переднее правое крыло
              </Label>
              <Input
                type="text"
                name="frontRightFender"
                value={helperFields.frontRightFender}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Переднее левое крыло
              </Label>
              <Input
                type="text"
                name="frontLeftFender"
                value={helperFields.frontLeftFender}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Заднее правое крыло
              </Label>
              <Input
                type="text"
                name="rearRightFender"
                value={helperFields.rearRightFender}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Заднее левое крыло
              </Label>
              <Input
                type="text"
                name="rearLeftFender"
                value={helperFields.rearLeftFender}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Правый порог</Label>
              <Input
                type="text"
                name="rightThreshold"
                value={helperFields.rightThreshold}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Левый порог</Label>
              <Input
                type="text"
                name="leftThreshold"
                value={helperFields.leftThreshold}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Передняя правая дверь
              </Label>
              <Input
                type="text"
                name="frontRightDoor"
                value={helperFields.frontRightDoor}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Передняя левая дверь
              </Label>
              <Input
                type="text"
                name="frontLeftDoor"
                value={helperFields.frontLeftDoor}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Задняя правая дверь
              </Label>
              <Input
                type="text"
                name="rearRightDoor"
                value={helperFields.rearRightDoor}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Задняя левая дверь
              </Label>
              <Input
                type="text"
                name="rearLeftDoor"
                value={helperFields.rearLeftDoor}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Стекло передней правой двери
              </Label>
              <Input
                type="text"
                name="frontRightWindow"
                value={helperFields.frontRightWindow}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Стекло передней левой двери
              </Label>
              <Input
                type="text"
                name="frontLeftWindow"
                value={helperFields.frontLeftWindow}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Стекло задней правой двери
              </Label>
              <Input
                type="text"
                name="rearRightWindow"
                value={helperFields.rearRightWindow}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">
                Стекло задней левой двери
              </Label>
              <Input
                type="text"
                name="rearLeftWindow"
                value={helperFields.rearLeftWindow}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Лобовое стекло</Label>
              <Input
                type="text"
                name="windshield"
                value={helperFields.windshield}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Заднее стекло</Label>
              <Input
                type="text"
                name="rearWindow"
                value={helperFields.rearWindow}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Крыша</Label>
              <Input
                type="text"
                name="roof"
                value={helperFields.roof}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xl text-gray-600">Салон</Label>
              <Input
                type="text"
                name="interior"
                value={helperFields.interior}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex justify-center w-full">
            <Button type="submit" className="p-6 text-xl">
              Добавить автомобиль
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page
