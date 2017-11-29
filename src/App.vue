<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <router-view></router-view>

    <!--This sidebar appears only for screens smaller than 992px-->
    <side-bar type="navbar" :sidebar-links="$sidebar.sidebarLinks">
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

    <BlockUI message="Loading..." :html="html" v-if="isLoading"></BlockUI>

  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        html: '<i class="fa fa-spinner fa-3x fa-spin fa-fw"></i><span class="sr-only">Loading...</span>'
        // html: '<i class="fa fa-cog fa-spin fa-3x fa-fw"></i>'
      }
    },
    computed: {
      ...mapGetters(['isLoading'])
    }
  }
</script>

<style lang="scss"></style>
