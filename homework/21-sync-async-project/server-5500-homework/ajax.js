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

$('#postAjax').on('click', function () {
  console.log('request is sending now!')

  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/stores-timeout',
    data: JSON.stringify(users),
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
      addUsersToHtml(data)
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
