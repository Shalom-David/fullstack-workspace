const obj = {}

const objPrototype = Object.getPrototypeOf(obj)
Object.defineProperty(objPrototype, 'toString', {
  configurable: false,
  enumerable: true,
})

console.log(Object.keys(obj))
console.log(Object.keys(obj.constructor.prototype))

