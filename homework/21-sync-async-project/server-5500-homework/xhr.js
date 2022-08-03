const getSync = document.querySelector('#getXhrSync')
const getAsync = document.querySelector('#getXhrAsync')
const postSync = document.querySelector('#postXhrSync')
const postAsync = document.querySelector('#postXhrAsync')
const test = document.querySelector('#test')

test.addEventListener('click', testLogger)
getSync.addEventListener('click', getDataSync)
getAsync.addEventListener('click', getDataAsync)
postSync.addEventListener('click', postDataSync)
postAsync.addEventListener('click', postDataAsync)

function getDataSync() {
  const xhr = new XMLHttpRequest()
  console.log('unset', xhr.readyState)
  xhr.open('GET', 'http://localhost:3000/stores-timeout', false)
  console.log('opened', xhr.readyState)
  xhr.send()
  if (xhr.status === 200) {
    addItemsToHtml(JSON.parse(xhr.response))
  } else {
    console.log(xhr.status)
  }
}

function getDataAsync() {
  const xhr = new XMLHttpRequest()
  console.log('unset', xhr.readyState)
  xhr.open('GET', 'http://localhost:3000/stores-timeout')
  console.log('opened', xhr.readyState)
  xhr.responseType = 'json'
  xhr.onprogress = function () {
    console.log('loading', xhr.readyState)
  }

  xhr.onload = function () {
    if (xhr.status === 200 && xhr.readyState === 4) {
      console.log('done', xhr.readyState)
      addItemsToHtml(xhr.response)
    } else {
      console.log(xhr.status)
    }
  }
  xhr.send()
}

const stores = [
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

function postDataSync() {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', 'http://localhost:3000/stores-timeout', false)

  xhr.setRequestHeader('content-type', 'application/json; charset=UTF-8')

  xhr.send(JSON.stringify(stores))
  if (xhr.status === 200) {
    addItemsToHtml(JSON.parse(xhr.response))
  } else {
    console.log(xhr.status)
  }
}


function postDataAsync() {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', 'http://localhost:3000/stores-timeout')
  xhr.setRequestHeader('content-type', 'application/json; charset=UTF-8')

  xhr.onload = function () {
    if (xhr.status === 200) {
      addItemsToHtml(JSON.parse(xhr.response))
    } else {
      console.log(xhr.status)
    }
  }
  xhr.send(JSON.stringify(stores))
}


function addItemsToHtml(items) {
  console.log(items)
  const ul = document.querySelector('#itemsXhr')
  ul.innerHTML = ''
  for (const item of items) {
    const li = document.createElement('li')

    li.innerHTML = `Id: <b>${item.id}</b>, Name: <b>${item.name}</b>, Departments: <b>${item.departments}</b>`

    ul.appendChild(li)
  }
}

function testLogger() {
  console.log(`I'm handled now!`)
}
