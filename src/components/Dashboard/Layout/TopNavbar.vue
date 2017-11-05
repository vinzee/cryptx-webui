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
          <drop-down v-bind:title="user.email" icon="fa fa-user">
            <li>
              <a href="#/settings" class="btn-rotate">
                <i class="fa fa-gear" aria-hidden="true"></i> Settings
              </a>
            </li>
            <li>
              <a href="#/register" class="btn-rotate">
                <i class="fa fa-sign-out" aria-hidden="true"></i> Register
              </a>
            </li>
            <li>
              <a href="#/login" class="btn-rotate">
                <i class="fa fa-sign-out" aria-hidden="true"></i> LogIn
              </a>
            </li>
            <li>
              <a href="#" class="btn-rotate">
                <i class="fa fa-sign-out" aria-hidden="true"></i> Logout
              </a>
            </li>

            <!-- <li class="open">
              <a href="#" class="dropdown-toggle btn-magnify" data-toggle="dropdown">
                <i class="ti-panel"></i>
                <p>Settings</p>
              </a>
            </li> -->
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
      }
    }
  }

</script>
<style>

</style>
