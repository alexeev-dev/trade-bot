import React, {Component} from 'react'
import Button from './Button'

class TradeStart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      price: '',
      percent: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault()
    if (typeof this.props.onStart === 'function') {
      this.props.onStart(this.state)
    }
  }

  render() {
    const {amount, price, percent} = this.state
    return (
      <form className="tradeStart" onSubmit={this.handleSubmit}>
        <h2 className="tradeStart__heading">
          Создание нового торгового запроса
        </h2>
        <input
          value={amount}
          type="text"
          name="amount"
          className="tradeStart__input"
          placeholder="Сумма покупки"
          onChange={this.handleChange}
        />
        <input
          value={price}
          type="text"
          name="price"
          className="tradeStart__input"
          placeholder="Сумма покупки"
          onChange={this.handleChange}
        />
        <input
          value={percent}
          type="text"
          name="percent"
          className="tradeStart__input"
          placeholder="Ожидаемый рост %"
          onChange={this.handleChange}
        />
        <Button>Начать торговлю</Button>
      </form>
    )
  }
}

export default TradeStart
