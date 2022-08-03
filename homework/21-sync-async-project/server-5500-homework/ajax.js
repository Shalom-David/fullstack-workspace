$('#getAjax').on('click', function () {
  console.log('request is sending now!')

  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/stores-timeout',
    success: function (data) {
      addItemsToHTML(data)
    },
    error: function (err) {
      console.log(err)
      console.log(err.status)
    },
  })
})

const newStores = [
  {
    name: 'new Rami Levi',
    departments: [1, 7],
  },
  {
    name: 'new IKEA',
    departments: [2, 3, 5, 6],
  },
  {
    name: 'new Zol Stock',
    departments: [4, 8],
  },
]

$('#postAjax').on('click', function () {
  console.log('request is sending now!')

  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/stores-timeout',
    data: JSON.stringify(newStores),
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      addItemsToHTML(data)
    },
    error: function (err) {
      console.log(err)
      console.log(err.status)
    },
  })
})

function addItemsToHTML(items) {
  console.log(items)
  $('#itemsAjax').text('')
  for (const item of items) {
    $('#itemsAjax').append(
      `<li> Id: <b>${item.id}</b>, Name: <b>${item.name}</b>, Departments: <b>${item.departments}</b> </li>`
    )
  }
}
