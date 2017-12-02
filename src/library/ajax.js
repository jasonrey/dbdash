const ajax = (endpoint, data, options = {}) => {
  const fetchData = {
    headers: {}
  }

  if (data) {
    fetchData.body = JSON.stringify(data)
  }

  Object.assign(fetchData, options)

  if (!fetchData.headers['Content-Type']) {
    fetchData.headers['Content-Type'] = 'application/json'
  }

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

export default ajax
