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

const TradeProcess = ({phase, amount, price, done, onCancel}) => (
  <div className="tradeProcess">
    <h2 className="tradeProcess__heading">
      {phaseText(phase)}<br/> ${amount} BTC
    </h2>
    <p className="tradeProcess__price">
      по цене ${price} за 1 BTC
    </p>
    <p className="tradeProcess__done">
      Уже куплено:<br/> {done} BTC
    </p>
    <div className="tradeProcess__spinner"></div>
    <Button onClick={onCancel}>Отменить!</Button>
  </div>
)

export default TradeProcess
