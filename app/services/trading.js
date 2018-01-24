const doneEvent = phase => phase === 'sell' ? 'sell-done' : 'buy-done'

const HEADERS = {
  'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
}

function querySell(amount, price) {
  return fetch('/api/sell', {
    method: 'post',
    headers: HEADERS,
    body: `amount=${amount}&price=${price}`
  }).then(result => result.json())
}

function queryBuy(amount, price) {
  return fetch('/api/buy', {
    method: 'post',
    headers: HEADERS,
    body: `amount=${amount}&price=${price}`
  }).then(result => result.json())
}

function queryStatus(order) {
  return new Promise((resolve, reject) => {
    fetch(`/api/status?order=${order}`, {headers: HEADERS})
      .then(result => result.json())
      .then(result => {
        if (result.success === 1) {
          resolve(result.return[order])
        } else {
          reject('Ошибка запроса статуса!')
        }
      }).catch((error) => {
        reject(error)
      })
  })
}

class TradingBot {
  constructor() {
    this.events = {
      'sell-done': [this.handleSellDone],
      'buy-done': [this.handleBuyDone],
      'update': []
    }
  }

  start(amount, price, percent) {
    const sellAmount = amount
    const sellPrice = price
    const buyAmount = sellAmount + (sellAmount * percent) / 100
    const buyPrice = price / (1 + percent / 100)
    this.tradeInfo = {sellAmount, sellPrice, buyAmount, buyPrice}
    console.log('==== Начало торгов ====')
    this.sell(sellAmount, sellPrice)
      .then(result => {
        this.trigger('sell-done')
        return this.buy(buyAmount, buyPrice)
      }).then(result => {
        this.trigger('buy-done')
      }).catch(error => {
        console.error(error)
      })
  }

  watch(order) {
    return new Promise((resolve, reject) => {
      const test = () => {
        console.log(`Watching for order ${order}`)
        queryStatus(order).then((result) => {
          if (result.status === 1) {
            resolve()
          } else {
            this.trigger('update', result.amount)
            setTimeout(test, 120000)
          }
        }).catch((error) => {
          console.error(`Произошла ошибка во время ожидания ордера ${order}`)
          console.error(error)
        })
      }
      test()
    })
  }

  order(orderFunction, amount, price, errorText) {
    return new Promise((resolve, reject) => {
      orderFunction(amount, price).then((result) => {
        if (result.success === 1) {
          const order = result.return.order_id
          this.watch(order).then(() => {
            resolve(order)
          })
        } else {
          reject(errorText)
        }
      }).catch((error) => {
        console.log(error)
      })
    })
  }

  sell(amount, price) {
    const ERROR = 'Не удалось выполнить запрос на продажу!'
    console.log(`Продажа ${amount} ETH по цене ${price} BTC за 1 ETH`)
    return this.order(querySell, amount, price, ERROR)
  }

  buy(amount, price) {
    const ERROR = 'Не удалось выполнить запрос на покупку!'
    console.log(`Покупка ${amount} ETH по цене ${price} BTC за 1 ETH`)
    return this.order(queryBuy, amount, price, ERROR)
  }

  trigger(event, data) {
    if (typeof this.events[event] !== 'undefined') {
      this.events[event].forEach(callback => {
        if (typeof callback === 'function') {
          callback(data, this.tradeInfo)
        }
      })
    }
  }

  on(event, callback) {
    if (typeof this.events[event] !== 'undefined') {
      this.events[event].push(callback)
    } else {
      this.events[event] = [callback]
    }
  }
}

export default new TradingBot()
