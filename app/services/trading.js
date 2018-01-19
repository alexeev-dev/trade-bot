const doneEvent = phase => phase === 'sell' ? 'sell-done' : 'buy-done'

class TradingBot {
  constructor() {
    this.phase = 'prepare'
    this.order = '240001395917498'
    this.handleSellDone = this.handleSellDone.bind(this)
    this.handleBuyDone = this.handleBuyDone.bind(this)
    this.watch = this.watch.bind(this)
    this.events = {
      'sell-done': [this.handleSellDone],
      'buy-done': [this.handleBuyDone],
      'update': []
    }
  }

  handleSellDone() {
    const {buyAmount, buyPrice} = this
    this.phase = 'buy'
    this.buy(buyAmount, buyPrice).then(remains => {
      if (remains === 0) {
        this.trigger('buy-done')
      } else {
        this.watch()
      }
    })
  }

  handleBuyDone() {
    this.phase = 'done'
  }

  sell(amount, price) {
    return new Promise((resolve, reject) => {
      fetch('/api/sell', {
        method: 'post',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `amount=${amount}&price=${price}`
      }).then(result => {
        result.json().then((jsonResult) => {
          if (jsonResult.success === 1) {
            this.order = jsonResult.return.order_id
            resolve(jsonResult.return.remains)
          } else {
            reject()
          }
        })
      }).catch(reject)
    })
  }

  buy(amount, price) {
    return new Promise((resolve, reject) => {
      fetch('/api/buy', {
        method: 'post',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `amount=${amount}&price=${price}`
      }).then(result => {
        result.json().then((jsonResult) => {
          if (jsonResult.success === 1) {
            this.order = jsonResult.return.order_id
            resolve(jsonResult.return.remains)
          } else {
            reject()
          }
        })
      }).catch(reject)
    })
  }

  start(amount, price, percent) {
    const sellAmount = amount
    const sellPrice = price
    const buyAmount = sellAmount + (sellAmount * percent) / 100
    const buyPrice = price / (1 + percent / 100)
    this.sellAmount = sellAmount
    this.sellPrice = sellPrice
    this.buyAmount = buyAmount
    this.buyPrice = buyPrice
    this.phase = 'sell'
    this.sell(sellAmount, sellPrice).then(remains => {
      if (remains === 0) {
        this.trigger('sell-done')
      } else {
        this.watch()
      }
    })
  }

  watch() {
    this.status().then(result => {
      const {amount} = result
      if (amount === 0) {
        this.trigger(doneEvent(this.phase))
      } else {
        const total = this.phase === 'sell' ? this.sellAmount : this.buyAmount
        const price = this.phase === 'sell' ? this.sellPrice : this.buyPrice
        this.trigger('update', this.phase, total, total - amount, price)
        setTimeout(this.watch, 120000)
      }
    })
  }

  trigger(event, phase, amount = 0, done = 0, price = 0) {
    this.events[event].forEach(callback => {
      callback(phase, amount, done, price)
    })
  }

  on(event, callback) {
    this.events[event].push(callback)
  }

  status() {
    return new Promise((resolve, reject) => {
      fetch(`/api/status?order=${this.order}`, {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        }
      }).then(result => {
        result.json().then((jsonResult) => {
          if (jsonResult.success === 1) {
            resolve(jsonResult.return[this.order])
          }
        })
      }).catch(reject)
    })
  }
}

export default new TradingBot()
