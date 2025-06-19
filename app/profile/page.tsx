'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'

const Page = ({}) => {
  const [userData, setUserData] = useState<{
    username: string
    id: string
  } | null>(null)
  const userId = Cookies.get('user')

  useEffect(() => {
    if (!userId) {
      redirect('/login')
    } else {
      const storedData = localStorage.getItem(userId)
      if (storedData) {
        setUserData(JSON.parse(storedData))
      }
    }
  }, [userId])

  const router = useRouter()

  const clickHandler = () => {
    Cookies.remove('user')
    router.push('/login')
  }

  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <div className="py-10">
        <h1 className="text-center text-4xl font-bold mb-10 px-10">
          Страница пользователя
        </h1>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 self-start text-nowrap">
            <Label className="text-xl text-gray-500">Имя пользователя:</Label>
            <p className="text-xl text-gray-500">
              {userData ? userData.username : 'Неизвестно'}
            </p>
            <Label className="text-xl text-gray-500">Логин пользователя:</Label>
            <p className="text-xl text-gray-500">
              {userData ? userData.id : 'Неизвестно'}
            </p>
          </div>
          <div className="flex flex-col gap-4 self-center w-full">
            <Link href="/cars">
              <Button
                className="cursor-pointer w-full text-xl p-6"
                type="button">
                Список автомобилей
              </Button>
            </Link>
            <Link href="/cars?filter=chosen">
              <Button
                className="cursor-pointer w-full text-xl p-6"
                type="button">
                Избранные автомобили
              </Button>
            </Link>
            <Link href="/cars?filter=mycars">
              <Button
                className="cursor-pointer w-full text-xl p-6"
                type="button">
                Мои автомобили
              </Button>
            </Link>
            <Link href="/cars/add">
              <Button
                className="cursor-pointer w-full text-xl p-6"
                type="button">
                Добавить автомобиль
              </Button>
            </Link>
            <Button
              className="cursor-pointer w-full text-xl p-6"
              type="button"
              onClick={clickHandler}>
              Выход из системы
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
