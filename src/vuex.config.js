import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    isAuthenticated: false,
    user: null,
    currencyData: null,
    currencyDataMap: {},
    investmentsMap: {},
    topCurrency: {},
    worstCurrency: {}
  },
  getters: {
    currentUser: state => {
      return state.user
    },
    transactions: state => {
      return state.transactions
    },
    bank_accounts: state => {
      return state.user.bank_accounts
    },
    virtualWalletBalance: state => {
      return state.user.virtual_wallet.balance
    },
    portfolioNetWorth: state => {
      return _.round(_.reduce(state.user.investments, function (sum, investment) {
        return sum + investment.value
      }, 0))
    },
    investments: state => {
      return state.user.investments
    },
    investmentsMap: state => {
      return state.investmentsMap
    },
    isAuthenticated: state => {
      return state.isAuthenticated
    },
    currencyData: state => {
      return state.currencyData
    },
    currencyDataMap: state => {
      return state.currencyDataMap
    },
    topCurrency: state => {
      return state.topCurrency
    },
    worstCurrency: state => {
      return state.worstCurrency
    }
  },
  mutations: {
    setAuth (state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated
    },
    setUser (state, user) {
      _.each(user.investments, function (investment) {
        state.investmentsMap[investment.currency] = investment
      })

      state.user = user
    },
    setCurrencyData (state, currencyData) {
      let topCurrency = null
      let worstCurrency = null

      _.each(currencyData, function (currency) {
        state.currencyDataMap[currency.name] = currency

        console.log(currency.price)
        if (topCurrency === null || topCurrency.price_usd < currency.price_usd) {
          topCurrency = currency
        }

        if (worstCurrency === null || worstCurrency.price_usd > currency.price_usd) {
          worstCurrency = currency
        }
      })

      state.topCurrency = topCurrency
      state.worstCurrency = worstCurrency
      state.currencyData = currencyData

      _.each(state.user.investments, function (investment) {
        let currencyDetails = state.currencyDataMap[investment.currency]

        if (currencyDetails !== undefined) {
          investment.value = _.round(investment.amount * currencyDetails.price_usd, 3)
          investment.price = currencyDetails.price_usd
        } else {
          investment.value = 0
          investment.price = 0
        }
      })
    },
    add_money_to_virtual_wallet (state, data) {
      Vue.set(state.user.virtual_wallet, 'balance', state.user.virtual_wallet.balance + data.amount)
    },
    add_bank_account (state, data) {
      state.user.bank_accounts.push(data)
    }
  },
  actions: {
    sessionAuthenticate ({ commit }) {
      store.dispatch('setTempUserData').then(() => {
      // store.dispatch('fetchUserData').then(() => {
        store.dispatch('login')
      })
    },
    login ({ commit }) {
      commit('setAuth', true)
    },
    logout ({ commit }) {
      commit('setAuth', false)
    },
    setTempUserData ({ commit }) {
      /* eslint-disable object-property-newline  */
      let userData = {
        firstName: 'Vineet', lastName: 'Ahirkar', email: 'vinzee93@gmail.com',
        address: 'Maryland, US', city: 'baltimore', country: 'United States', postalCode: '21227',
        virtual_wallet: { balance: 1234 },
        bank_accounts: [
          { id: '1', name: 'Bank of America', account_number: '1234', type: 'credit' }, {id: '2', name: 'PNC', account_number: '6789', type: 'debit'}
        ],
        investments: [
          { currency: 'Bitcoin', amount: 1.7 },
          { currency: 'Litecoin', amount: 1.3 },
          { currency: 'Ethereum', amount: 0.5 },
          { currency: 'Ripple', amount: 0 }
        ],
        transactions: [
          { type: 'Buy', currency: 'Bitcoin', amount: '$36.738', date: 1510930059 },
          { type: 'Buy', currency: 'Bitcoin', amount: '$36.738', date: 1510930059 },
          { type: 'Buy', currency: 'Bitcoin', amount: '$36.738', date: 1510930059 },
          { type: 'Buy', currency: 'Bitcoin', amount: '$36.738', date: 1510930059 }
        ]
      }
      commit('setUser', userData)
    },
    setUserData ({ commit }, userData) {
      commit('setUser', userData)
    },
    fetchUserData ({ dispatch }) {
      Vue.axios.get('/user/info').then((response) => {
        console.log('axios.get /user/info: ', response)
        dispatch('setUserData', response.data.user)
      }, (err) => {
        console.log(err)
      })
    },
    add_bank_account ({ commit }, accountData) {
      if (accountData) {
        commit('add_bank_account', accountData)
      }
    },
    getCoinPricingHistogram ({ commit }, data) {
      // &e=CCCAGG&aggregate=3
      Vue.axios.get(window.appConfig.CRYPTOCOMPARE_API_URL + '/data/histohour?fsym=' + data.coin + '&tsym=USD&limit=60').then((response) => {
        console.log('cryptocompare currencyPrices: ', response.data)
      })
    },
    getCurrencyData ({ commit }) {
      // Vue.axios.get(window.appConfig.CRYPTOCOMPARE_URL + '/api/data/coinlist/')
      return Vue.axios.get(window.appConfig.COINMARKETCAP_API_URL + '/v1/ticker/?limit=5')
        .then((response) => {
          commit('setCurrencyData', response.data)
          // this.coins = response.data
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
})

export default store
