//11 + 12 + 13 - inheritance - polymorphism 


function User(email, name) {
  this.email = email
  this.name = name
  this.online = false
}

User.prototype.login = function () {
  this.online = true
  console.log(`${this.email} has logged in`)
}
User.prototype.logout = function () {
  this.online = false
  console.log(`${this.email} has logged out`)
}

const user1 = new User('email1@email.com', 'username1')
const user2 = new User('email2@email.com', 'username2')

user1.login()

console.log(user1)
console.log(user2)

function Admin(email, name, role) {
  this.role = role
  User.apply(this, [email, name])
}

Admin.prototype = Object.create(User.prototype)
const admin = new Admin('email3@email.com', 'username3', 'super admin')

admin.login = function () {
  this.online = true
  console.log(`${this.role}, ${this.email} has logged in`)
}
Admin.prototype.deleteUser = function () {}

admin.login()
console.log(admin)
console.log(user1)

const users = [user1, user2, admin]

for (const user of users) {
  user.login()
}
