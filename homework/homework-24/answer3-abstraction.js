// תשובה 3 - abstraction

function Location(longitude, latitude) {
    let point = { longitude, latitude }
  
    this.getPoint = function () {
      return point
    }
    this.setPoint = function (longitude, latitude) {
      if (longitude > 0 && latitude > 0) {
        point = { longitude, latitude }
      } else {
        console.log('invalid point')
      }
    }
  }
  
  const location = new Location(33.45, 35.78)
  location.setPoint(0, 89)
  console.log(location.getPoint())
  
  location.point = { longitude: 0, latitude: 0 }
  console.log(location)