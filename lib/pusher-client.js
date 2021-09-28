const phin = require('phin').unpromisified
const PUSHER_PAGE_URL = 'https://status.pusher.com/index.json'

class Pusher {
  static status (cb) {
    phin({
      url: PUSHER_PAGE_URL,
      parse: 'json',
      timeout: 5000
    }, (err, res) => {
      if (err) {
        cb(err)
        return
      }

      if (res.statusCode !== 200) {
        cb(new Error(`Status Page error (code: ${res.statusCode})`))
        return
      }

      if (res.body.error) {
        cb(new Error(`Status Page error (code: ${res.body.status}, error: ${res.body.error})`))
        return
      }

      const _status = {
        status: res.body.status.indicator === 'none' ? 'OK' : 'ERROR',
        description: res.body.description,
        components: {
          operational: [],
          outage: []
        }
      }

      res.body.components.forEach((component) => {
        _status.components[(component.status === 'operational') ? 'operational' : 'outage'].push({
          name: component.name,
          position: component.position,
          description: component.description
        })
      })

      cb(null, _status)
    })
  }
}

module.exports = Pusher
