import ajax from './ajax'

class Bridge {
  constructor (host, identifier) {
    this.host = host
    this.identifier = identifier
  }

  get (endpoint, data, options = {}) {
    if (!options.headers) {
      options.headers = {}
    }

    options.headers.Authorization = `Bearer ${this.identifier}`

    return ajax(`${this.host}/${endpoint}`, data, options)
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

export default (host, identifier) => new Bridge(host, identifier)
