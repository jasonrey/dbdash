const api = (endpoint, data, options) => {
  const fetchData = {
    headers: {},
    body: JSON.stringify(data || {})
  }

  if (options.auth) {
    fetchData.headers.Authorization = `Bearer ${api.auth}`
  }

  fetchData.headers['Content-Type'] = 'application/json'

  Object.assign(fetchData, options)

  return window.fetch(`/api/${endpoint}`, fetchData)
    .then(res => {
      if (res.status === 200) {
        return res.json()
      }

      throw res.json()
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
