//תשובה 2 - encapsulation

let carCompany1 = 'Mazda'
let carCompany2 = 'Toyota'

let carYear1 = 2012
let carYear2 = 2014


//procedural
function getCar (carCompany, carYaer){
    console.log(`carCompany: ${carCompany}, carYaer: ${carYaer}`);
}

getCar(carCompany1, carYear2)


//OOP
function Car(name, year) {
  this.name = name
  this.year = year
}

const car1 = new Car(carCompany1, carYear1)
const car2 = new Car(carCompany2, carYear2)

console.log(car1)
console.log(car2)

