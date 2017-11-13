module.exports = fields => {
  return (req, res, next) => {
    if (fields.filter(field => req.body[field] === undefined).length) {
      return next(new Error('Insufficient data.'))
    }

    return next()
  }
}
