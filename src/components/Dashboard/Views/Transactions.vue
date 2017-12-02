<template>
    <div class="row">
      <div class="col-md-12">

        <div class="card">
          <paper-table title="Transactions" sub-title="List of crypocurrency transactions" :data="transactions" :columns="columns" :columnNames="columnNames">
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
        columnNames: ['Type', 'Currency', 'Number Of Coins', 'Transaction Time'],
        columns: ['type', 'currency', 'numberOfCoins', 'transactionTime']
      }
    },
    computed: {
      ...mapGetters([
        'transactions'
      ])
    }
  }

</script>
