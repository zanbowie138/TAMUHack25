import { capitalize } from "@/utils/capitalize";

export class CarData {
  model: string;
  year: number;
  price: number;
  mpg: number;
  horsepower: number;
  matchScore: number;

  constructor(model: string, year: number, price: number = 0, mpg: number = 0, horsepower: number = 0, matchScore: number = 0) {
    this.model = model;
    this.year = year;
    this.price = price;
    this.mpg = mpg;
    this.horsepower = horsepower;
    this.matchScore = matchScore;
  }

  string(): string {
    return `${this.year} ${capitalize(this.model)}`;
  }

  displayString(): string {
    return `Toyota ${capitalize(this.model)} (${this.year})`;
  }
}
