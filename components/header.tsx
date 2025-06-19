import Link from 'next/link'

export const Header = ({}) => {
  return (
    <div className="absolute top-[5%] left-[5%] text-xl">
      <p>Оценка состояния автомобиля</p>
      <div className="flex justify-between">
        <Link href="/cars">Главная</Link>
        <Link href="/profile">Профиль</Link>
        <Link href="/login">Вход</Link>
      </div>
    </div>
  )
}
