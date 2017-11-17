import Vue from 'vue'

Vue.mixin({
  methods: {
    login (email, password) {
      // this.$auth.login({ email, password }).then((res) => {
      //   if (res.success) {
      /* eslint-disable object-property-newline  */
      let res = {
        session: 'vineet',
        user: {
          firstName: 'Vineet', lastName: 'Ahirkar', email: 'vinzee93@gmail.com',
          address: 'Maryland, US', city: 'baltimore', country: 'United States', postalCode: '21227',
          virtual_wallet: { balance: 1234 },
          bank_accounts: [ { id: '1', name: 'Bank of America', account_number: '1234', type: 'credit' }, {id: '2', name: 'PNC', account_number: '6789', type: 'debit'} ],
          investments: {
            bitcoin: { amount: 1.7 }, litecoin: { amount: 1.3 }, etherium: { amount: 0.5 }, ripple: { amount: 1.5 }
          }
        }
      }

      console.log('login successful !')
      this.$cookie.set('session', res.session, {expires: '1H'}) // , domain: this.$config.baseURL
      console.log(this.$route.query.redirect)

      this.$store.dispatch('setUserData', res.user).then(() => {
        this.$store.dispatch('login')
        let redirectPath = this.$route.query.redirect == null ? '/' : this.$route.query.redirect
        this.$router.push(redirectPath)
        this.$notify('User logged in sucessfully !', 'ti-bank')
      })
      //   } else {
      //     throw new Error('Error in user login: ', res)
      //   }
      // })
    },
    register (userData) {
      this.$auth.register(userData).then(function (res) {
        this.$notify('User registered in sucessfully !', 'ti-bank')
        this.login(userData.email, userData.password)
      })
    },
    logout () {
      this.$cookie.delete('session') // , {domain: this.$config.baseURL}

      this.$store.dispatch('logout').then(() => {
        this.$router.push({ path: '/login' })
        this.$notify('User logged out sucessfully !', 'ti-bank')
      })
    }
  }
})
