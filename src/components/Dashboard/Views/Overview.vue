<template>
  <div>
    <div class="loading" v-if="loading">
      Loading...
    </div>

    <!--Stats cards-->
    <div class="row" v-if="!loading">
      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div class="icon-big text-center icon-success" slot="header">
            <i class="ti-wallet"></i>
          </div>
          <div class="numbers" slot="content">
            <p style="font-size: 15px">Virtual Wallet</p>
            ${{virtualWalletBalance}}
          </div>
          <div slot="footer" class="stats"><i class="ti-reload"></i> Updated now
          </div>
        </stats-card>
      </div>

      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div slot="header" class="icon-big text-center icon-warning">
            <i class="ti-briefcase"></i>
          </div>
          <div slot="content" class="numbers">
            <p style="font-size: 15px;">Net Worth</p>
            ${{portfolioNetWorth}}
          </div>
          <div slot="footer" class="stats"><i class="ti-reload"></i> Updated now
          </div>
        </stats-card>
      </div>
      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div slot="header" class="icon-big text-center icon-info"><i class="ti-stats-up"></i></div>
          <div slot="content" class="numbers">
            <p style="font-size: 15px;">Top Currency</p>
            {{topCurrency.name}}
          </div>
          <div slot="footer" class="stats"><i class="ti-money"></i> {{topCurrency.price_usd}}
          </div>
        </stats-card>
      </div>
      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div slot="header" class="icon-big text-center icon-danger"><i class="ti-stats-down"></i></div>
          <div slot="content" class="numbers">
            <p style="font-size: 15px;">Worst Currency</p>
            {{worstCurrency.name}}
          </div>
          <div slot="footer" class="stats"><i class="ti-money"></i> {{worstCurrency.price_usd}}
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row" v-if="!loading">

      <div class="col-xs-12">
        <chart-card :chart-data="usersChart.data" :chart-options="usersChart.options">
          <h4 class="title" slot="title">Portfolio</h4>
          <span slot="subTitle">Performance from beggining of time</span>
          <span slot="footer">
            <i class="ti-reload"></i> Updated 3 minutes ago</span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Open
            <i class="fa fa-circle text-danger"></i> Click
            <i class="fa fa-circle text-warning"></i> Click Second Time
          </div>
        </chart-card>
      </div>

      <div class="col-md-12 col-xs-12">
        <chart-card :chart-data="activityChart.data" :chart-options="activityChart.options">
          <h4 class="title" slot="title">Current Prices</h4>
          <span slot="subTitle">USD</span>
          <span slot="footer">
            <i class="ti-check"></i> Data from <a target="_blank" href="http://www.cryptocompare.com">cryptocompare.com</a></span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Bitcoin
            <i class="fa fa-circle text-warning"></i> Litecoin
          </div>
        </chart-card>
      </div>

    </div>

    <div class="row" v-if="!loading">
      <div class="col-md-6 col-xs-12">
        <chart-card :chart-data="investmentsChartData" :chart-options="investmentsChartOptions" chart-type="Pie">
          <h4 class="title" slot="title">Investments</h4>
          <span slot="subTitle">Investments till now</span>
          <span slot="footer"><i class="ti-timer"></i> Last investment 2 days ago</span>
        </chart-card>
      </div>

      <div class="col-md-6 col-xs-12">
        <div class="card">
          <paper-table title="Investments" sub-title="" :data="investmentsTableData" :columns="investmentsTableColumns"></paper-table>

          <div class="row">
            <div class="col-xs-4 col-xs-offset-4 text-center">
              <button type="button" class="btn btn-lg btn-block btn-success btn-fill" data-toggle="modal" data-target="#buySellCurrencyModal">Buy / Sell</button>
              <br>
            </div>
          </div>

          <!-- <paper-table title="Current Prices" sub-title="" :data="currentPricesTableData" :columns="currentPricesTableColumns"></paper-table> -->

        </div> <!-- card -->
      </div>

    </div> <!-- row -->

    <!-- sell currency modal -->
    <div class="modal" id="buySellCurrencyModal" tabindex="-1" role="dialog" aria-labelledby="buySellCurrencyModal" aria-hidden="true" data-backdrop="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.stop.prevent="buySellCurrencySubmit">

          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title" id="buySellCurrencyModalLabel">Buy / Sell Currency</h4>
          </div>

          <div class="modal-body">

              <div class="row">
                <div class="col-md-4 col-md-offset-2">

                  <div class="form-group">
                    <label>Currency</label>
                    <select v-validate="'required'" class="form-control" v-model="buySellCurrency.currency" name="currency">
                      <option v-for="investment in investments" :value="investment.currency">{{investment.currency}}</option>
                    </select>
                    <span v-show="errors.has('currency')" class="text-danger">{{ errors.first('currency') }}</span>
                  </div>

                  <div class="form-group">
                    <label>Current Price: ${{selectedCurrencyPrice}} per unit</label>
                    <label>Current Investment: {{selectedCurrencyAmount}} units</label>
                    <label>Virtual Wallet Balance: ${{virtualWalletBalance}}</label>
                  </div>

                </div>

                <div class="col-md-4">

                  <div class="form-group">
                    <label>Amount (units)</label>
                    <input v-validate="'required'" class="form-control border-input" type="number" name="amount" label="Amount" placeholder="Amount" v-model="buySellCurrency.amount" min="0.001" step="0.001">
                    <span v-show="errors.has('amount')" class="text-danger">{{ errors.first('amount') }}</span>
                  </div>

                  <div class="form-group">
                    <label>Total Cost ($)</label>
                    <input class="form-control border-input" type="number" label="Amount" placeholder="Amount" v-model="buySellCurrency.value" min="0.001" step="0.001" disabled="disabled">

                  </div>

                  <div class="form-group">
                    <input type="radio" id="buyCurrency" value="buy" v-model="buySellCurrency.type">
                    <label for="buyCurrency">Buy</label>
                    <br>
                    <input type="radio" id="sellCurrency" value="sell" v-model="buySellCurrency.type">
                    <label for="sellCurrency">Sell</label>
                    <br>
                  </div>

                </div>
              </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Buy / Sell</button>
          </div>

          </form>
        </div>
      </div>
    </div>
    <!-- end sell currency modal -->

  </div>
</template>
<script>
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
  import PaperTable from 'components/UIComponents/PaperTable.vue'
  import _ from 'lodash'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      StatsCard,
      ChartCard,
      PaperTable
    },
    /**
     * Chart data used to render stats, charts. Should be replaced with server data
     */
    data () {
      return {
        loading: true,
        buySellCurrency: {
          amount: 0.05,
          currency: 'Bitcoin',
          type: 'buy',
          value: 0
        },
        usersChart: {
          data: {
            labels: ['9:00AM', '12:00AM', '3:00PM', '6:00PM', '9:00PM', '12:00PM', '3:00AM', '6:00AM'],
            series: [
              [287, 385, 490, 562, 594, 626, 698, 895, 952],
              [67, 152, 193, 240, 387, 435, 535, 642, 744],
              [23, 113, 67, 108, 190, 239, 307, 410, 410]
            ]
          },
          options: {
            low: 0,
            high: 1000,
            showArea: true,
            height: '245px',
            axisX: {
              showGrid: false
            },
            lineSmooth: this.$Chartist.Interpolation.simple({
              divisor: 3
            }),
            showLine: true,
            showPoint: false
          }
        },
        activityChart: {
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [
              [542, 543, 520, 680, 653, 753, 326, 434, 568, 610, 756, 895],
              [230, 293, 380, 480, 503, 553, 600, 664, 698, 710, 736, 795]
            ]
          },
          options: {
            seriesBarDistance: 10,
            axisX: {
              showGrid: false
            },
            height: '245px'
          }
        },
        investmentsChartOptions: {
          // labelInterpolationFnc (value) {
          //   return value
          // }
          // ,showLabel: false,
          // plugins: [
          //   this.$Chartist.plugins.legend()
          // ]
        },
        investmentsTableColumns: ['Currency', 'Amount', 'Price', 'Value'],
        currentPricesTableColumns: ['Currency', 'Price']
      }
    },
    watch: {
      '$route': 'fetchData',
      'buySellCurrency.amount': function () {
        if (this.loading) {
          this.buySellCurrency.value = 0
        } else {
          this.buySellCurrency.value = _.round(this.investmentsMap[this.buySellCurrency.currency].price * this.buySellCurrency.amount, 3)
        }
      }
    },
    computed: {
      selectedCurrencyAmount () {
        if (this.loading || this.buySellCurrency.currency === null || this.buySellCurrency.currency === '') {
          return 0
        } else {
          return this.investmentsMap[this.buySellCurrency.currency].amount
        }
      },
      selectedCurrencyPrice () {
        if (this.loading || this.buySellCurrency.currency === null || this.buySellCurrency.currency === '') {
          return 0
        } else {
          return this.investmentsMap[this.buySellCurrency.currency].price
        }
      },
      investmentsChartData () {
        let data = {
          labels: [],
          series: []
        }

        _.each(this.investments, function (investment) {
          if (investment.amount > 0) {
            data.labels.push(investment.currency)
            data.series.push(investment.amount)
          }
        })

        return data
      },
      investmentsTableData () {
        let data = []

        if (!this.loading) {
          _.each(this.investments, function (investment) {
            data.push({
              currency: investment.currency,
              amount: investment.amount,
              price: '$' + investment.price,
              value: '$' + investment.value
            })
          })
        }

        return data
      },
      currentPricesTableData () {
        let temp = _.map(this.currencyData, function (currency) {
          return {
            currency: currency.name,
            price: currency.price_usd
          }
        })

        return temp
      },
      ...mapGetters([
        'virtualWalletBalance',
        'portfolioNetWorth',
        'investments',
        'currencyData',
        'currencyDataMap',
        'investmentsMap',
        'topCurrency',
        'worstCurrency'
      ])
    },
    created () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        let self = this

        this.$store.dispatch('getCurrencyData').then(() => {
          self.loading = false
        })
      },
      buySellCurrencySubmit () {
        console.log('buySellCurrencySubmit: ', this.buySellCurrency)
        this.$store.dispatch('commitTransaction', this.buySellCurrency)
      }
    }
  }

</script>
<style>

</style>
