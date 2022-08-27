class User {
  constructor(email, name) {
    this.email = email
    this.name = name
    this.online = false

    this.instanceLogin = () => {}
  }
  login() {
    this.online = true
    console.log(`${this.email} has logged in`)
  }
  logout() {
    this.online = false
    console.log(`${this.email} has logged out`)
  }
}

const user1 = new User('user1@email.com', 'user1')
const user2 = new User('user2@email.com', 'user2')

console.log(user1)
user2.login()
console.log(user2)

class Admin extends User {
  constructor(role, email, name) {
    super(email, name)
    this.role = role
  }
  deleteUser() {}
  login() {
    this.online = true
    console.log(`${this.role} ${this.email} has logged in`)
  }
}

const admin = new Admin('super-admin', 'user3@email.com', 'user3')

console.log(admin)

const users = [user1, user2, admin]

for (const user of users) {
  user.login()
}
