<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <router-view v-if="!isBootstrapping"></router-view>

    <!--This sidebar appears only for screens smaller than 992px-->
    <side-bar type="navbar" :sidebar-links="$sidebar.sidebarLinks" v-if="!isBootstrapping">
      <ul class="nav navbar-nav">
        <li>
          <a class="dropdown-toggle" data-toggle="dropdown">
            <i class="ti-panel"></i>
            <p>Stats</p>
          </a>
        </li>

        <li>
          <a>
            <i class="ti-settings"></i>
            <p>Settings</p>
          </a>
        </li>
        <li class="divider"></li>
      </ul>
    </side-bar>

    <BlockUI message="Loading..." :html="html" v-if="isLoading || isBootstrapping"></BlockUI>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        html: '<i class="fa fa-spinner fa-3x fa-spin fa-fw"></i><span class="sr-only">Loading...</span>'
        // fa-cog
      }
    },
    beforeCreate () {
      this.$store.dispatch('sessionAuthenticate').then((res) => {
        if (res.loggedIn) {
          this.$notify('User Logged In')
        }
      }).catch(() => {
        this.$notify('Error in authenticating from session', 'ti-user', 'danger')
      })
    },
    computed: {
      ...mapGetters(['isLoading', 'isBootstrapping'])
    }
  }
</script>

<style lang="scss"></style>
