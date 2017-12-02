import ajax from './ajax'

class Bridge {
  constructor (project) {
    this.host = project.meta.bridge
    this.identifier = project.identifier
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

export default project => new Bridge(project)
