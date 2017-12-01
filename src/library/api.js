import ajax from './ajax'

const api = (endpoint, data, options) => ajax(`/api/${endpoint}`, data, options)

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
