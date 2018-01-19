import React from 'react'
import Button from './Button'

const TradeEnd = ({profit, onRestart}) => (
  <div className="tradeEnd">
    <h2 className="tradeEnd__heading">
      Операция<br/> завершена!
    </h2>
    <p className="tradeEnd__profit">
      Ваша прибыль:<br/> <strong>${profit}</strong>
    </p>
    <Button onClick={onRestart}>Торговать ещё!</Button>
  </div>
)

export default TradeEnd
