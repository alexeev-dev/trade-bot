import jsSHA from 'jssha'

const authInfo = {
  key: '92CCCF06A999982E166B6F7277C95F3B',
  secret: 'da67943fbfdd4fa9b43f3e8f8c0d4c76'
}

class TradingBot {
  constructor(key, secret) {
    this.key = key
    this.secret = secret
  }

  signRequest(request) {
    const shaObj = new jsSHA("SHA-512", "TEXT")
    shaObj.setHMACKey(this.secret, "TEXT")
    shaObj.update(request)
    return shaObj.getHMAC("HEX")
  }

  getInfo() {
    return new Promise((resolve, reject) => {
      const request = 'nonce=1'
      fetch('https://yobit.net/tapi/getInfo', {
        method: 'post',
        mode: 'cors',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Access-Control-Allow-Origin': 'https://yobit.net',
          'Key': this.key,
          'Sign': this.signRequest(request)
        },
        body: request
      }).then(resolve).catch(reject)
    })
  }

  testAPI() {
    return new Promise((resolve, reject) => {
      fetch('https://yobit.net/api/3/info', {
        method: 'get',
        mode: 'cors',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Access-Control-Allow-Origin': 'https://yobit.net',
          //'Key': this.key,
          //'Sign': this.signRequest(request)
        }
      }).then(resolve).catch(reject)
    })
  }
}

export default new TradingBot(authInfo.key, authInfo.secret)
