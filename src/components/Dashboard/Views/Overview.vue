<template>
  <div>
    <!--Stats cards-->
    <div class="row">
      <div class="col-lg-3 col-sm-6">
        <stats-card>
          <div class="icon-big text-center icon-success" slot="header">
            <i class="ti-wallet"></i>
          </div>
          <div class="numbers" slot="content">
            <p style="font-size: 15px">Virtual Wallet</p>
            ${{formattedVirtualWalletAmount}}
          </div>
          <div slot="footer" class="stats"><i class="ti-reload"></i> Updated now
          </div>,
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
          <div slot="footer" class="stats"><i class="ti-reload"></i> Updated {{lastUpdatedCurrency()}}
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
    <div class="row">

      <div class="col-md-12 col-xs-12">
        <div class="card">
          <div class="header">
            <slot name="title"></slot>
            <p class="category">
              <slot name="subTitle"></slot>
            </p>
          </div>
          <div class="content">
            <div id="pricingChart"></div>
            <div class="footer">
              <div class="chart-legend">
                <slot name="legend"></slot>
              </div>
              <hr>
              <div class="stats">
                <i class="ti-reload"></i> Updated {{lastUpdatedPortfolioHistoric()}}
              </div>
              <div class="pull-right">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-12 col-xs-12" >
        <div class="card">
          <div class="header">
            <slot name="title">Portfolio performance</slot>
            <p class="category">
              <slot name="subTitle">Performance of your portfolio from the beginning of time</slot>
            </p>
          </div>
          <div class="content">
            <div id="portfolioHistoricChart" v-if="portfolioHistoricChartData.length > 0"></div>
            <p class="text-danger text-center" v-else="portfolioHistoricChartData.length === 0">No data to be shown</p>
            <div class="footer">
              <div class="chart-legend">
                <slot name="legend"></slot>
              </div>
              <hr>
              <div class="stats">
                <i class="ti-reload"></i> Updated {{lastUpdatedCurrencyHistoric()}}
              </div>
              <div class="pull-right">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 col-xs-12">
        <div id="portfolioChart">
        </div>
      </div>

      <div class="col-md-6 col-xs-12">
        <div class="card">
          <paper-table title="User Portfolio" sub-title="" :data="portfolioTableData" :columns="portfolioTableColumns" :columnNames="portfolioTableColumnNames"></paper-table>

          <div class="row">
            <div class="col-xs-4 col-xs-offset-4 text-center">
              <button type="button" class="btn btn-block btn-info btn-fill" data-toggle="modal" data-target="#buySellCurrencyModal">Buy / Sell</button>
              <br>
            </div>
          </div>

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
                      <option v-for="portfolio in portfolio" :value="portfolio.currency">{{portfolio.currency}}</option>
                    </select>
                    <span v-show="errors.has('currency')" class="text-danger">{{ errors.first('currency') }}</span>
                  </div>

                  <div class="form-group">
                    <label class="text-info">${{selectedCurrencyPrice}} per coin</label>
                    <label>You currently own {{selectedCurrencyAmount}} coins</label>
                  </div>

                  <div class="form-group">
                    <label>Number of Coins</label>
                    <input v-validate="'required'" class="form-control border-input" type="number" name="amount" label="Amount" placeholder="Amount" v-model="buySellCurrency.amount" min="0.001" step="0.001">
                    <span v-show="errors.has('amount')" class="text-danger">{{ errors.first('amount') }}</span>
                  </div>

                </div>

                <div class="col-md-4">

                  <div class="form-group">
                    <label>Total ($)</label>
                    <input class="form-control border-input" type="number" label="Amount" placeholder="Amount" v-model="buySellCurrency.value" min="0.001" step="0.001" disabled="disabled">
                  </div>

                  <div class="form-group">
                    <label class="text-success">Virtual Wallet Balance: ${{virtualWalletAmount}}</label>
                  </div>

                  <div class="btn-group" data-toggle="buttons">
                    <label for="buyCurrency" class="btn btn-info active" @click="changeTransactionType('buy')">
                      <input type="radio" id="buyCurrency" value="buy" v-model="buySellCurrency.type" autocomplete="off" checked>
                      Buy
                    </label> &nbsp;

                    <label for="sellCurrency" class="btn btn-info" @click="changeTransactionType('sell')">
                      <input type="radio" id="sellCurrency" value="sell" v-model="buySellCurrency.type" autocomplete="off">
                      Sell
                    </label>
                  </div>

                </div>
              </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>

          </form>
        </div>
      </div>
    </div>
    <!-- end sell currency modal -->

  </div>
</template>

<script>
  import Highcharts from 'highcharts'
  import _ from 'lodash'
  import $ from 'jquery'
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
  import PaperTable from 'components/UIComponents/PaperTable.vue'
  // import numeral from 'numeral'

  export default {
    components: {
      StatsCard,
      PaperTable
    },
    data () {
      return {
        buySellCurrency: {
          amount: 0,
          currency: 'Bitcoin',
          type: 'buy'
        },
        portfolioTableColumns: ['currency', 'amount', 'price', 'value'],
        portfolioTableColumnNames: ['Currency', 'Amount', 'Price', 'Value']
      }
    },
    mounted () {
      this.buySellCurrency.amount = 0.1
      this.loadPortfolioChart()
      this.loadPricingChart()
      this.loadPortfolioHistoricChart()

      setInterval(function () {
        this.$store.dispatch('getCurrencyData')
      }.bind(this), window.appConfig.updateIntervals.currency)

      setInterval(function () {
        this.$store.dispatch('getPortfolioHistoricData')
      }.bind(this), window.appConfig.updateIntervals.portfolioHistoric)

      setInterval(function () {
        this.$store.dispatch('getCurrencyHistoricData')
      }.bind(this), window.appConfig.updateIntervals.currencyHistoric)
    },
    watch: {
      'buySellCurrency.amount': function () {
        this.buySellCurrency.value = _.round(this.portfolioMap[this.buySellCurrency.currency].price * this.buySellCurrency.amount, 3)
      },
      'buySellCurrency.currency': function () {
        this.buySellCurrency.value = _.round(this.portfolioMap[this.buySellCurrency.currency].price * this.buySellCurrency.amount, 3)
      },
      'portfolioChartData': function () {
        this.loadPortfolioChart()
      },
      'pricingChartData': function () {
        this.loadPricingChart()
      },
      'portfolioHistoricData': function () {
        this.loadPortfolioHistoricChart()
      }
    },
    computed: {
      formattedVirtualWalletAmount () {
        return this.virtualWalletAmount
        // return numeral(this.virtualWalletAmount).format('000.00 a')
      },
      selectedCurrencyAmount () {
        if (this.buySellCurrency.currency === null || this.buySellCurrency.currency === '') {
          return 0
        } else {
          return this.portfolioMap[this.buySellCurrency.currency].amount
        }
      },
      selectedCurrencyPrice () {
        if (this.buySellCurrency.currency === null || this.buySellCurrency.currency === '') {
          return 0
        } else {
          return this.portfolioMap[this.buySellCurrency.currency].price
        }
      },
      portfolioChartData () {
        let chartData = {
          name: 'User portfolio',
          colorByPoint: true,
          data: []
        }

        _.each(this.portfolio, function (portfolio) {
          if (portfolio.value === undefined) {
            console.error('ERROR in Overview: portfolio value not calculated: ', portfolio)
            return chartData
          }

          chartData.data.push({name: portfolio.currency, y: portfolio.value})
        })

        chartData.data.push({
          name: 'Virtual Wallet',
          y: this.virtualWalletAmount,
          sliced: true,
          selected: true
        })

        return [chartData]
      },
      portfolioTableData () {
        let data = []

        _.each(this.portfolio, function (portfolio) {
          data.push({
            currency: portfolio.currency,
            amount: portfolio.amount,
            price: '$' + portfolio.price,
            value: '$' + portfolio.value
          })
        })

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
      currentPricesChartData () {
        return _.map(this.currencyHistoricData, (currency) => {
          return {
            type: 'area',
            name: currency.name,
            data: currency.pricing
          }
        })
      },
      portfolioHistoricChartData () {
        return _.map(this.portfolioHistoricData, (currency) => {
          return {
            type: 'spline',
            // type: currency.name === 'Overall' ? 'area' : 'spline',
            name: currency.name,
            data: currency.pricing
          }
        })
      },
      ...mapGetters([
        'virtualWalletAmount',
        'portfolioNetWorth',
        'portfolio',
        'currencyData',
        'currencyDataMap',
        'portfolioMap',
        'topCurrency',
        'worstCurrency',
        'portfolioHistoricData',
        'currencyHistoricData',
        'lastUpdated'
      ])
    },
    methods: {
      lastUpdatedCurrency () {
        let temp = _.round(moment.duration(moment().diff(this.lastUpdated.currency)).asHours())
        return temp === 0 ? 'now' : temp + 'min ago'
      },
      lastUpdatedPortfolioHistoric () {
        let temp = _.round(moment.duration(moment().diff(this.lastUpdated.portfolioHistoric)).asHours())
        return temp === 0 ? 'now' : temp + 'min ago'
      },
      lastUpdatedCurrencyHistoric () {
        let temp = _.round(moment.duration(moment().diff(this.lastUpdated.currencyHistoric)).asHours())
        return temp === 0 ? 'now' : temp + 'min ago'
      },
      buySellCurrencySubmit () {
        let self = this

        if (this.buySellCurrency.type === 'buy' && this.buySellCurrency.value > this.virtualWalletAmount) {
          self.$notify('Insufficient balance in Virtual Wallet', 'ti-money', 'danger')
          return
        } else if (this.buySellCurrency.type === 'sell' && this.buySellCurrency.amount > this.selectedCurrencyAmount) {
          self.$notify('Insufficient coins', 'ti-money', 'danger')
          return
        }

        this.$store.dispatch('buySellCurrency', this.buySellCurrency).then((res) => {
          self.$notify('Currency ' + self.buySellCurrency.type + ' successfull', 'ti-money')
          $('#buySellCurrencyModal').modal('hide')
        }).catch(() => {
          self.$notify('Error in currency ' + self.buySellCurrency.type, 'ti-money', 'danger')
        })
      },
      changeTransactionType (type) {
        this.buySellCurrency.type = type
      },

      loadPortfolioChart () {
        Highcharts.chart('portfolioChart', {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'User portfolio'
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '{point.name}: {point.y:.1f}'
              },
              showInLegend: true
            }
          },
          series: this.portfolioChartData
        })
      },
      loadPricingChart () {
        Highcharts.chart('pricingChart', {
          tooltip: {
            shared: true,
            crosshairs: true
          },
          chart: {
            zoomType: 'x'
          },
          title: {
            text: 'Crypocurrency price trends'
          },
          subtitle: {
            text: document.ontouchstart === undefined ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
          },
          xAxis: {
            labels: {
              formatter: function () {
                return moment(this.value).format('MMM/DD')
              }
            },
            type: 'datetime'
          },
          yAxis: {
            min: 0,
            height: '100%',
            floor: 0,
            title: {
              text: 'Exchange rate'
            }
          },
          legend: {
            enabled: true
          },
          plotOptions: {
            area: {
              animation: {
                duration: 1000
              },
              marker: {
                radius: 2
              },
              lineWidth: 1,
              states: {
                hover: {
                  lineWidth: 1
                }
              },
              threshold: null
            }
          },
          series: this.currentPricesChartData
        })
      },
      loadPortfolioHistoricChart () {
        if (this.portfolioHistoricChartData.length > 0) {
          Highcharts.chart('portfolioHistoricChart', {
            tooltip: {
              shared: true,
              crosshairs: true
            },
            chart: {
              zoomType: 'x'
            },
            title: {
              text: 'Portfolio'
            },
            subtitle: {
              text: document.ontouchstart === undefined ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
              labels: {
                formatter: function () {
                  return moment(this.value).format('HH:mm MM/DD')
                }
              },
              type: 'datetime'
            },
            yAxis: {
              min: 0,
              height: '100%',
              floor: 0,
              title: {
                text: 'Exchange rate'
              }
            },
            legend: {
              enabled: true
            },
            plotOptions: {
              area: {
                animation: {
                  duration: 1000
                },
                marker: {
                  radius: 2
                },
                lineWidth: 1,
                states: {
                  hover: {
                    lineWidth: 1
                  }
                },
                threshold: null
              }
            },
            series: this.portfolioHistoricChartData
          })
        }
      }

    }
  }

</script>
