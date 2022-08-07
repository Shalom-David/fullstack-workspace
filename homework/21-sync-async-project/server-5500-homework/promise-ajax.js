$('#getPromise').on('click', getData)

function getData() {
  const ul = $('#listByPromise')
  console.log('request is sending now!')
  ul.html('')
  const stores = []
  const departments = []
  promisifyAjax('GET', 'http://localhost:3000/stores')
    .then(function (response) {
      const promises = []
      for (const store of response) {
        stores.push(store)
        promises.push(
          promisifyAjax(
            'POST',
            'http://localhost:3000/bulk-departments',
            store.departments
          )
        )
      }

      return Promise.allSettled(promises)
    })
    .then(function (responseArr) {
      const promises = []
      for (const key in responseArr) {
        if (responseArr[key].status === 'fulfilled') {
          for (const department of responseArr[key].value) {
            departments.push(department)
            department.storeName = stores[key].name
            promises.push(
              promisifyAjax(
                'POST',
                `http://localhost:3000/bulk-products`,
                department.products
              )
            )
          }
        } else {
          console.log(responseArr[key].status)
          console.log(responseArr[key].reason)
        }
      }

      return Promise.allSettled(promises)
    })
    .then(function (responseArr) {
      for (const key in responseArr) {
        departments[key].productName = []
        if (responseArr[key].status === 'fulfilled') {
          for (const product of responseArr[key].value) {
            departments[key].productName.push(product.name)
          }
          const storeData = [...departments]

          addStoreToHTML(storeData[key], ul)
        } else {
          console.log(responseArr[key].status)
          console.log(responseArr[key].reason)
        }
      }
    })

    .catch(function (err) {
      console.log(err)
    })
}

function addStoreToHTML(store, element) {
  element.append(
    `
         <li>
           <h2> ${store.storeName}</h2>
            Departments: <b>${store.name}</b>,
            Products: <b>${store.productName}</b>,
         </li>        
            `
  )
}

function promisifyAjax(type, url, data = null) {
  return new Promise(function (resolve, reject) {
    const ajaxObj = {
      type,
      url,
      success: function (data) {
        resolve(data)
      },
      error: function (error) {
        reject(error)
      },
    }
    if (type === 'POST') {
      ajaxObj.contentType = 'application/json; charset=utf-8'
      if (data) {
        ajaxObj.data = JSON.stringify(data)
      }
    }

    $.ajax(ajaxObj)
  })
}
