<template>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" :class="{toggled: $sidebar.showSidebar}" @click="toggleSidebar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar bar1"></span>
          <span class="icon-bar bar2"></span>
          <span class="icon-bar bar3"></span>
        </button>
        <a class="navbar-brand">{{routeName}}</a>
      </div>
      <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav navbar-right">

          <drop-down v-bind:title="userEmail" icon="fa fa-user">
            <li v-if="user">
              <a href="#/settings" class="btn-rotate">
                <i class="fa fa-gear" aria-hidden="true"></i> Settings
              </a>
            </li>
            <li v-if="user">
              <a href="#" class="btn-rotate" @click="logOut">
                <i class="fa fa-sign-out" aria-hidden="true"></i> Logout
              </a>
            </li>
            <li v-if="!user">
              <a href="#/login" class="btn-rotate">
                <i class="fa fa-sign-out" aria-hidden="true"></i> LogIn
              </a>
            </li>
            <li v-if="!user">
              <a href="#/register" class="btn-rotate">
                <i class="fa fa-sign-out" aria-hidden="true"></i> Register
              </a>
            </li>
          </drop-down>

        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
  export default {
    data () {
      return {
        activeNotifications: false
      }
    },
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      },
      user () {
        return this.$store.state.user
      },
      userEmail () {
        return this.user !== null ? this.user.email : 'Guest'
      }
    },
    methods: {
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown () {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown () {
        this.activeNotifications = false
      },
      toggleSidebar () {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar () {
        this.$sidebar.displaySidebar(false)
      },
      logOut () {
        this.$store.dispatch('logout')
      }
    }
  }

</script>
<style>

</style>
