$('#getStoreDepartmentProducts').on('click', getData)

function getData() {
  const ul = $('#StoreDepartmentProductsList')
  const productsSet = []
  const departmentsSet = []
  console.log('request is sending now!')
  ul.html('')
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/stores',
    success: function (stores) {
      console.log('stores')
      console.log(stores)
      for (const store of stores) {
        $.ajax({
          type: 'POST',
          url: 'http://localhost:3000/bulk-departments',
          data: JSON.stringify(store.departments),
          contentType: 'application/json; charset=utf-8',
          success: function (departments) {
            console.log('department')
            console.log(departments)

            for (const department of departments) {
              $.ajax({
                type: 'POST',
                url: `http://localhost:3000/bulk-products/`,
                data: JSON.stringify(department.products),
                contentType: 'application/json; charset=utf-8',
                success: function (products) {
                  console.log('products')
                  console.log(products)
                  store.departments = department.name
                  for (const product of products) {
                    productsSet.push(product.name)
                    store.products = productsSet
                  }

                  addStoreToHTML(store, ul)
                  productsSet.splice(0, productsSet.length)
                },
                error: function (error) {
                  console.log('product')
                  console.log(error.status)
                },
              })
            }
          },
          error: function (error) {
            console.log('departments')
            console.log(error.status)
          },
        })
      }
    },
    error: function (error) {
      console.log('stores')
      console.error(error.status)
    },
  })
}

function addStoreToHTML(store, element) {
  element.append(
    `
     <li>
        <h2>${store.name}</h2>
        Departments: <b>${store.departments}</b>,
        <br></br>
        Products: <b>${store.products}</b>,
     </li>
        `
  )
}
