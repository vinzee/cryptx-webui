import Vue from 'vue'

Vue.mixin({
  methods: {
    login (email, password) {
      console.log('login attempt: ', email, password)

      this.$auth.login({ email, password }).then((res) => {
        if (res.success) {
          // let res = { session: 'vineet' }
          console.log('login successful !')
          this.$cookie.set('session', res.session, {expires: '1H'}) // , domain: this.$config.BASE_URL
          console.log(this.$route.query.redirect)

          // this.$store.dispatch('setUserData', res.user).then(() => {
          this.$store.dispatch('setTempUserData').then(() => {
            this.$store.dispatch('login')
            let redirectPath = this.$route.query.redirect == null ? '/' : this.$route.query.redirect
            this.$router.push(redirectPath)
            this.$notify('User logged in sucessfully !', 'ti-bank')
          })
        } else {
          throw new Error('Error in user login: ', res)
        }
      })
    },
    register (userData) {
      this.$auth.register(userData).then(function (res) {
        this.$notify('User registered in sucessfully !', 'ti-bank')
        this.login(userData.email, userData.password)
      })
    },
    logout () {
      this.$cookie.delete('session') // , {domain: this.$config.BASE_URL}

      this.$store.dispatch('logout').then(() => {
        this.$router.push({ path: '/login' })
        this.$notify('User logged out sucessfully !', 'ti-bank')
      })
    }
  }
})
