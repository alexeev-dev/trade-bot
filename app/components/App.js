import React, {Component} from 'react'

import TradeStart from './TradeStart'
import TradeProcess from './TradeProcess'
import TradeEnd from './TradeEnd'

import tradingBot from '../services/trading'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      screen: 1,
      phase: 'none',
      amount: 0,
      price: 0,
      done: 0,
      profit: 0
    }
    this.handleStart = this.handleStart.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleRestart = this.handleRestart.bind(this)
  }

  componentDidMount() {
    console.log('!!!')
    tradingBot.testAPI().then(result => {
      console.log(result)
    }).catch(error => {
      console.log(error)
    })
  }

  handleStart({amount, price}) {
    this.setState({
      screen: 2,
      phase: 'buy',
      done: 0,
      amount,
      price,
    })
  }

  handleCancel() {
    console.log('Операция отменена!')
  }

  handleRestart() {
    console.log('Торгуем снова!')
  }

  render() {
    const {screen, phase, amount, price, done, profit} = this.state
    return (
      <div className="app">
      <div className="app__title">
        <h2>Trade Bot</h2>
        <i className="icon ion-ios-ionic-outline" aria-hidden="true"></i>
        <p>The Future Is Here</p>
      </div>
        <div className="app__window">
          {screen === 1 && <TradeStart onStart={this.handleStart}/>}
          {screen === 2 && <TradeProcess
            phase={phase}
            amount={amount}
            price={price}
            done={done}
            onCancel={this.handleCancel}
          />}
          {screen === 3 && <TradeEnd
            profit={profit}
            onRestart={this.handleRestart}
          />}
        </div>
      </div>
    )
  }
}

export default App
