import { capitalize } from "@/utils/capitalize";

export class Car {
  model: string;
  year: string;

  constructor(model: string, year: string) {
    this.model = model;
    this.year = year;
  }

  string(): string {
    return `${this.year} ${capitalize(this.model)}`;
  }

  displayString(): string {
    return `Toyota ${capitalize(this.model)} (${this.year})`;
  }
}
