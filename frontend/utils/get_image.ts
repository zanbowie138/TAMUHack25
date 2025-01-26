import { Car } from "@/config/Car";

export default function getImage(car: Car) {
    return `https://www.toyota.com/imgix/content/dam/toyota/jellies/relative/${Number(car.year) === 2020 ? 2021 : car.year}/${car.model.toLowerCase()}/base.png`
}