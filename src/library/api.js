const api = (endpoint, data, options) => {
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

  return window.fetch(`/api/${endpoint}`, fetchData)
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

api.auth = ''

const get = (endpoint, data, options) => {
  return api(endpoint, data, Object.assign(options || {}, {
    method: 'GET'
  }))
}

const post = (endpoint, data, options) => {
  return api(endpoint, data, Object.assign(options || {}, {
    method: 'POST'
  }))
}

const put = (endpoint, data, options) => {
  return api(endpoint, data, Object.assign(options || {}, {
    method: 'PUT'
  }))
}

const del = (endpoint, data, options) => {
  return api(endpoint, data, Object.assign(options || {}, {
    method: 'DELETE'
  }))
}

Object.assign(api, {
  get,
  post,
  put,
  del
})

export default api
export { get, post, put, del }
