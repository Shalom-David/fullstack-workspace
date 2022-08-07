$('#getFetch').on('click', getData)

async function getData() {
  const ul = $('#listByFetch')
  console.log('request is sending now!')
  ul.html('')

  const stores = []
  const departments = []
  try {
    const storesRes = await generateFetch('GET', 'http://localhost:3000/stores')
    const storesJsonRes = await storesRes.json()

    const promises = []
    for (const store of storesJsonRes) {
      stores.push(store)
      promises.push(
        generateFetch(
          'POST',
          'http://localhost:3000/bulk-departments',
          store.departments
        )
      )
    }

    const bulkDepartmentsRes = await Promise.allSettled(promises)
    const bulkDepartmentsJsonRes = await jsonAll(bulkDepartmentsRes)
    promises.splice(0, promises.length)
    for (const key in bulkDepartmentsJsonRes) {
      if (bulkDepartmentsJsonRes[key].status === 'fulfilled') {
        const storeDepartments = bulkDepartmentsJsonRes[key].value
        for (const department of storeDepartments) {
          department.storeName = stores[key].name
          department.productName = []
          departments.push(department)
          promises.push(
            generateFetch(
              'POST',
              'http://localhost:3000/bulk-products',
              department.products
            )
          )
        }
      } else {
        console.log(bulkDepartmentsJsonRes[key].status)
        console.log(bulkDepartmentsJsonRes[key].reason)
      }
    }

    const productsRes = await Promise.allSettled(promises)
    const productsJsonRes = await jsonAll(productsRes)

    for (const key in productsJsonRes) {
      if (productsJsonRes[key].status === 'fulfilled') {
        for (const index in productsJsonRes[key].value) {
          departments[key].productName.push(
            productsJsonRes[key].value[index].name
          )
        }

        const storeData = new Stores(
          departments[key].storeName,
          departments[key].name,
          departments[key].productName
        )

        console.log(storeData)
        addStoreToHTML(storeData, ul)
      } else {
        console.log(productsJsonRes[key].status)
        console.log(productsJsonRes[key].reason)
      }
    }
  } catch (error) {
    console.log(error)
  }
}
function addStoreToHTML(store, element) {
  element.append(
    `
                 <li>
                   <h2> ${store.name}</h2>
                    Departments: <b>${store.departments}</b>,
                    Products: <b>${store.products}</b>,
                 </li>        
                    `
  )
}
function generateFetch(method, url, data = null) {
  const fetchObj = {
    method,
  }
  if (method === 'POST') {
    fetchObj.headers = { 'Content-Type': 'application/json; charset=utf-8' }
    if (data) {
      fetchObj.body = JSON.stringify(data)
    }
  }

  return fetch(url, fetchObj)
}

async function jsonAll(responses) {
  const promises = []
  for (const response of responses) {
    if (response.status === 'fulfilled') {
      promises.push(response.value.json())
    } else {
      console.error(response.status)
      console.error(response.reason)
    }
  }
  return await Promise.allSettled(promises)
}

class Stores {
  constructor(name, departments, products) {
    this.name = name
    this.departments = departments
    this.products = products
  }
}
