function Shelter(address, size, perimiter) {
  this.address = address
  this.size = size
  this.perimiter = perimiter
}

function House(szie, perimiter) {}
House.prototype.wallStrength = function () {
  if (this.size > 5 && this.perimiter > 10) {
    return (this.wallStrength = 5)
  } else {
    return (this.wallStrength = 2)
  }
}

function Residence(size, perimiter) {}
Residence.prototype.residents = function () {
  if ((this.size + this.perimiter) / 2 > 5) {
    return (this.residents = 5)
  } else {
    return (this.residents = 2)
  }
}

Object.assign(Shelter.prototype, House.prototype, Residence.prototype)

const shelter = new Shelter('location', 25, 15)
shelter.wallStrength()
shelter.residents()
console.log(shelter)
