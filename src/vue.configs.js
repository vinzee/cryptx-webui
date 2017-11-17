import Vue from 'vue'
import vueConfig from 'vue-config'

const configs = {
  BASE_URL: 'http://localhost:8080',
  LOGIN_URL: '/auth/login',
  REGISTER_URL: '/auth/register',
  momentFormat: 'MMMM Do YYYY, h:mm:ss a',
  isLoggingEnabled: true,
  CRYPTOCOMPARE_URL: 'https://www.cryptocompare.com',
  CRYPTOCOMPARE_API_URL: 'https://min-api.cryptocompare.com',
  COINMARKETCAP_API_URL: 'https://api.coinmarketcap.com'

}

Vue.use(vueConfig, configs)

window.appConfig = configs
