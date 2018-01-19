class TradingBot {
  constructor() {
    this.status = 'prepare'
    this.order = '240001395917498'
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
    this.buyAmount = buyAmount
    this.buyPrice = buyPrice
    this.status = 'sell'
    this.sell(sellAmount, sellPrice).then(remains => {
      if (remains === 0) {
        this.status = 'buy'
        this.trigger('sell-done')
        this.buy(buyAmount, buyPrice).then(remains => {
          if (remains === 0) {
            this.status = 'done'
            this.trigger('buy-done')
          } else {
            this.watch()
          }
        })
      } else {
        this.watch()
      }
    })
  }

  watch() {
    setTimeout(() => {
      this.status().then(status => {
        if (status === 1 && this.status === 'sell') {
          this.status = 'buy'
          this.trigger('sell-done')
          this.buy(this.buyAmount, this.buyPrice).then(remains => {
            if (remains === 0) {
              this.status = 'done'
              this.trigger('buy-done')
            } else {
              this.watch()
            }
          })
        }
      })
    })
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
            resolve(jsonResult.return[this.order].status)
          }
        })
      }).catch(reject)
    })
  }
}

export default new TradingBot()
