import { Car } from "@/config/Car"

export function getCarUrl(cars: Car[]) {
  return cars
    .map(car => `${car.model.toLowerCase()}-${car.year}`)
    .join('-vs-')
}

export function getCarFromUrl(url: string) {
  const carParts = url.split('-vs-')
  return carParts.map(carPart => {
    const [model, year] = carPart.split('-')
    return new Car(model, year)
  })
}
