const ajax = (endpoint, data, options) => {
  const fetchData = {
    headers: {}
  }

  if (data) {
    fetchData.body = JSON.stringify(data)
  }

  const authtoken = window.localStorage.getItem('authtoken')

  if (authtoken) {
    fetchData.headers.Authorization = `Bearer ${authtoken}`
  }

  fetchData.headers['Content-Type'] = 'application/json'

  Object.assign(fetchData, options)

  return window.fetch(endpoint, fetchData)
    .then(res => {
      return res.json()
        .then(subres => {
          return {
            status: res.status,
            body: subres
          }
        })
    })
    .then(res => {
      if (res.status !== 200) {
        throw res.body
      }

      return res.body
    })
}

ajax.auth = ''

export default ajax
