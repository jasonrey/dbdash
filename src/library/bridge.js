import ajax from './ajax'

class Bridge {
  constructor (host) {
    this.host = host
  }

  get (endpoint, data, options) {
    return ajax(`${this.host}/${endpoint}`, data, Object.assign({}, options, {
      method: 'GET'
    }))
  }

  post (endpoint, data, options) {
    return this.get(endpoint, data, Object.assign({}, options, {
      method: 'POST'
    }))
  }

  put (endpoint, data, options) {
    return this.get(endpoint, data, Object.assign({}, options, {
      method: 'POST'
    }))
  }

  del (endpoint, data, options) {
    return this.get(endpoint, data, Object.assign({}, options, {
      method: 'POST'
    }))
  }
}

export default host => new Bridge(host)
