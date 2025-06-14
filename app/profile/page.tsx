'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { redirect } from 'next/navigation'
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

  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <div className="p-10 border-2">
        <h1 className="text-center text-4xl font-bold mb-10">
          Страница пользователя
        </h1>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 self-start">
            <Label className="text-md underline underline-offset-2">
              Имя пользователя:
            </Label>
            <p className="text-2xl">
              {userData ? userData.username : 'Неизвестно'}
            </p>
            <Label className="text-md underline underline-offset-2">
              Логин пользователя:
            </Label>
            <p className="text-2xl">{userData ? userData.id : 'Неизвестно'}</p>
          </div>
          <div className="flex flex-col gap-4 self-center">
            <Link href="/cars">
              <Button className="cursor-pointer w-full" type="button">
                Список карточек автомобилей
              </Button>
            </Link>
            <Link href="/cars?filter=chosen">
              <Button className="cursor-pointer w-full" type="button">
                Избранные автомобили
              </Button>
            </Link>
            <Link href="/cars?filter=mycars">
              <Button className="cursor-pointer w-full" type="button">
                Мои автомобили
              </Button>
            </Link>
            <Link href="/cars/add">
              <Button className="cursor-pointer w-full" type="button">
                Добавить автомобиль
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
