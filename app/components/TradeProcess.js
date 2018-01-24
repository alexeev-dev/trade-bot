import React from 'react'
import Button from './Button'

const phaseText = (phase) => {
  switch(phase) {
    case 'buy':
      return 'Идёт покупка'
    case 'sell':
      return 'Идёт продажа'
    default:
      return 'Дела стоят'
  }
}

const processText = (phase) => {
  switch(phase) {
    case 'buy':
      return 'Уже куплено'
    case 'sell':
      return 'Уже продано'
    default:
      return 'Дела стоят'
  }
}

const TradeProcess = ({phase, amount, price, done, onCancel}) => (
  <div className="tradeProcess">
    <h2 className="tradeProcess__heading">
      {phaseText(phase)}<br/> ${amount} ETH
    </h2>
    <p className="tradeProcess__price">
      по цене {price} BTC за 1 ETH
    </p>
    <p className="tradeProcess__done">
      {processText(phase)}:<br/> {done} ETH
    </p>
    <div className="tradeProcess__spinner"></div>
    <Button onClick={onCancel}>Отменить!</Button>
  </div>
)

export default TradeProcess
