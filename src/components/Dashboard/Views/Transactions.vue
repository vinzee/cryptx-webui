<template>
    <div class="row">
      <div class="col-md-12">

        <div class="card">
          <paper-table title="Transactions" sub-title="List of crypocurrency transactions" :data="transactions" :columns="columns">
          </paper-table>
        </div>

      </div>
    </div>
</template>
<script>
  import PaperTable from 'components/UIComponents/PaperTable.vue'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      PaperTable
    },
    data () {
      return {
        columns: ['Type', 'Currency', 'Amount', 'Date']
      }
    },
    computed: {
      ...mapGetters([
        'transactions'
      ])
    }
  }

</script>

<style>
</style>
