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
    currencyIconData: {},
    investmentsMap: {},
    topCurrency: {},
    worstCurrency: {},
    currencyPriceSeries: []
  },
  getters: {
    currentUser: state => {
      return state.user
    },
    transactions: state => {
      return state.user.transactions
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
    },
    currencyPriceSeries: state => {
      return state.currencyPriceSeries
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

        if (currency.rank === '1') {
          topCurrency = currency
        }

        if (worstCurrency === null || parseInt(worstCurrency.rank) < parseInt(currency.rank)) {
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
    setCurrencyHistoricPricing (state, data) {
      let priceSeries = {name: data.currency, data: []}

      _.map(data.price, function (p) {
        priceSeries.data.push(p.high)
      })

      state.currencyPriceSeries.push(priceSeries)
    },
    addMoneyToVirtualWallet (state, data) {
      Vue.set(state.user.virtual_wallet, 'balance', state.user.virtual_wallet.balance + data.amount)
    },
    addBankAccount (state, data) {
      state.user.bank_accounts.push(data)
    },
    commitTransaction (state, data) {
      console.log('commitTransaction: ', data)
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
    addBankAccount ({ commit }, accountData) {
      if (accountData) {
        commit('addBankAccount', accountData)
      }
    },
    getAllCurrentPricingData ({ commit }) {
      let url = window.appConfig.CRYPTOCOMPARE_API_URL + '/data/histohour'

      return Vue.axios.all([
        Vue.axios.get(url + '?fsym=BTC&tsym=USD&limit=30&aggregate=1'),
        Vue.axios.get(url + '?fsym=ETH&tsym=USD&limit=30&aggregate=1')
        // Vue.axios.get(url + '?fsym=XRP&tsym=USD&limit=30&aggregate=1'),
        // Vue.axios.get(url + '?fsym=LTC&tsym=USD&limit=30&aggregate=1')
        // Vue.axios.get(url + '?fsym=BCH&tsym=USD&limit=30&aggregate=1'),
      ])
      .then(Vue.axios.spread(function (bitcoin, ethereum, ripple, litecoin) {
        console.log('getAllCurrentPricingData response: ', bitcoin, ethereum, ripple, litecoin)
        commit('setCurrencyHistoricPricing', {price: bitcoin.data.Data, currency: 'Bitcoin'})
        commit('setCurrencyHistoricPricing', {price: ethereum.data.Data, currency: 'Ethereum'})
      }))
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
    },
    commitTransaction ({ commit }, data) {
      commit('commitTransaction', data)
    }
  }
})

export default store
