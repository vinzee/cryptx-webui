<template>
    <div class="row">
      <div class="col-md-12">

        <div class="card">
          <paper-table title="Transactions" sub-title="List of crypocurrency transactions" :data="transactions" :columns="columns">
          </paper-table>
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-success btn-fill btn-wd" @click.prevent="buy">
            Buy
          </button>
          <button type="submit" class="btn btn-info btn-fill btn-wd" @click.prevent="sell">
            Sell
          </button>
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
        columns: ['Buy/Sell', 'Currency', 'Amount', 'Date']
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
