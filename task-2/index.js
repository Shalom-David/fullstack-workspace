$('#getCountryData').on('click', getData)
async function getData() {
  const input = $('#countryInput').val()
  const div = $('#dataDiv')
  div.html('')
  const countryName = []
  const countryPop = []
  const regions = []
  const currencies = []
  const currencyList = []
  try {
    const countriesRes = await getCountriesRes(
      input,
      'https://restcountries.com/v3/all',
      `https://restcountries.com/v3.1/name/${countryInput.value}`
    )
    const countriesJsonRes = await countriesRes.json()
    countriesJsonRes.filter((country) => currencies.push(country.currencies))
    countriesJsonRes.filter((country) => regions.push(country.region))
    countriesJsonRes.filter((country) =>
      countryName.push(country.name.official)
    )
    countriesJsonRes.filter((country) => countryPop.push(country.population))

    const table1 = $(`<table> 
    <tr>
    <th>Country Name</th> 
    <th>Population</th>
    </tr>`)
    const totalPop = countryPop.reduce(
      (accumulator, country) => accumulator + country,
      0
    )

    const averagePop = parseInt(totalPop / countriesJsonRes.length)

    for (let i = 0; i < countriesJsonRes.length; i++) {
      const row1 = $('<tr>').append(
        `<td>${countryName[i]}</td> <td> ${countryPop[i]}</td>`
      )
      table1.append(row1)
    }

    const table2 = $(
      `<table> 
      <tr>
      <th>Region</th> 
      <th>Number of Countries</th>
      </tr> 
      </table>`
    )

    const countryCount = regions.reduce(function (prev, cur) {
      prev[cur] = (prev[cur] || 0) + 1
      return prev
    }, {})

    for (const name in countryCount) {
      const row2 = $('<tr>').append(
        `<td>${name}</td> <td> ${countryCount[name]}</td>`
      )
      table2.append(row2)
    }
    const table3 = $(
      `<table> 
        <tr>
        <th>Currency Name</th> 
        <th>Number of Countries Using</th>
        </tr> 
        </table>`
    )
    for (const currency of currencies) {
      for (const [key, value] of Object.entries(currency)) {
        currencyList.push(value.name)
      }
    }
    const currencyCount = currencyList.reduce(function (prev, cur) {
      prev[cur] = (prev[cur] || 0) + 1
      return prev
    }, {})

    for (const curr in currencyCount) {
      const row3 = $('<tr>').append(
        `<td>${curr}</td> <td> ${currencyCount[curr]}</td>`
      )
      table3.append(row3)
    }
    div.append(`<h2>Total Countries Population: ${totalPop}</h2>`)
    div.append(`<h2>Average Population: ${averagePop}</h2>`)
    div.append(table1)
    div.append(table2)
    div.append(table3)
  } catch (error) {
    console.log(error)
  }
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

async function getCountriesRes(input, url1, url2) {
  let res
  if (!input) {
    res = await generateFetch('GET', url1)
  } else {
    res = await generateFetch('GET', url2)
  }
  return res
}
