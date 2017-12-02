import ajax from './ajax'

const get = (endpoint, data, options = {}) => {
  const authtoken = window.localStorage.getItem('authtoken')

  if (authtoken) {
    if (!options.headers) {
      options.headers = {}
    }

    options.headers.Authorization = `Bearer ${authtoken}`
  }

  return ajax(`/api/${endpoint}`, data, options)
}

const post = (endpoint, data, options) => {
  return get(endpoint, data, Object.assign(options || {}, {
    method: 'POST'
  }))
}

const put = (endpoint, data, options) => {
  return get(endpoint, data, Object.assign(options || {}, {
    method: 'PUT'
  }))
}

const del = (endpoint, data, options) => {
  return get(endpoint, data, Object.assign(options || {}, {
    method: 'DELETE'
  }))
}

const api = (endpoint, data, options) => get(endpoint, data, options)

Object.assign(api, {
  get,
  post,
  put,
  del
})

export default api
export { get, post, put, del }
