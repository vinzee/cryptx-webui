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
      transactions () {
        // return this.$store.getters.transactions
        return this.$store.state.transactions
      }
    },
    methods: {
      buy () {

      },
      sell () {

      }

    }
  }

</script>

<style>
</style>
