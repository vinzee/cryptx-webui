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
    currencyDataMap: {}
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
    virtual_wallet_balance: state => {
      return state.user.virtual_wallet.balance
    },
    portfolio_net_worth: state => {
      return 2165
    },
    investments: state => {
      return state.user.investments
    },
    isAuthenticated: state => {
      return state.isAuthenticated
    },
    currencyData: state => {
      return state.currencyData
    },
    currencyDataMap: state => {
      return state.currencyDataMap
    }
  },
  mutations: {
    setAuth (state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated
    },
    setUser (state, user) {
      state.user = user
    },
    setCurrencyData (state, currencyData) {
      state.currencyData = currencyData

      _.each(currencyData, function (currency) {
        state.currencyDataMap[currency.name] = currency
      })

      _.each(state.user.investments, function (investment) {
        let currencyDetails = state.currencyDataMap[investment.currency]

        if (currencyDetails !== undefined) {
          investment.value = investment.amount * currencyDetails.price_usd
        } else {
          investment.value = 10
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
          { currency: 'Ripple', amount: 1.5 }
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
          console.log('currencyData: ', response.data)
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
