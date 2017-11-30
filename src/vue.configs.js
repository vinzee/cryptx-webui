import Vue from 'vue'
import vueConfig from 'vue-config'

const configs = {
  LOGIN_URL: '/login',
  REGISTER_URL: '/register',
  momentFormat: 'MMMM Do YYYY, h:mm:ss a',
  isLoggingEnabled: true,
  CRYPTOCOMPARE_URL: 'https://www.cryptocompare.com',
  CRYPTOCOMPARE_API_URL: 'https://min-api.cryptocompare.com',
  COINMARKETCAP_API_URL: 'https://api.coinmarketcap.com'
}

if (process.env.NODE_ENV === 'production') {
  configs.BASE_URL = 'https://169.55.144.76:8080'
} else {
  configs.BASE_URL = 'https://10.0.0.93:8080'
}

Vue.use(vueConfig, configs)

window.appConfig = configs
