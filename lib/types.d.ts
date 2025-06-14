export interface User {
  username: string
  id: string
  addedCars: string[]
  markedCars: string[]
}

export interface Car {
  id: number
  image: string
  mark: string
  model: string
  releaseDate: number
  mileage: number
  endDate: string
  rating: number
}
