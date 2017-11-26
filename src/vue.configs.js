import Vue from 'vue'
import vueConfig from 'vue-config'

const configs = {
  BASE_URL: 'http://10.0.0.93:8080',
  LOGIN_URL: '/login',
  REGISTER_URL: '/register',
  momentFormat: 'MMMM Do YYYY, h:mm:ss a',
  isLoggingEnabled: true,
  CRYPTOCOMPARE_URL: 'https://www.cryptocompare.com',
  CRYPTOCOMPARE_API_URL: 'https://min-api.cryptocompare.com',
  COINMARKETCAP_API_URL: 'https://api.coinmarketcap.com'

}

Vue.use(vueConfig, configs)

window.appConfig = configs
