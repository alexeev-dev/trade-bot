import React from 'react'
import ReactDOM from 'react-dom'
// Подключаем необходимые для корректной работы полифиллы
require('es6-promise').polyfill()
require('isomorphic-fetch')
// Импортируем главный компонент
import App from './components/App'

ReactDOM.render(<App/>, document.getElementById('root'))
