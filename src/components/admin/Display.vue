<template>
  <el-container>
    <div class="Hello Vue and Echarts">
      <el-card>
        <!-- 搜索区域 -->
        <el-row :gutter="10" type="flex" align="middle">
          <el-col :span="3">
            <span>车站：</span>
          </el-col>
          <el-col :span="5">
            <el-select
              class="station-input"
              v-model="station"
              :remote-method="querySearch"
              placeholder="请输入站名"
              :loading="loading"
              style="padding:0px"
            >
              <el-option
                v-for="item in stations"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="3">
            <span>道岔名：</span>
          </el-col>
          <el-col :span="5">
            <el-select
              class="dcname-input"
              v-model="dcname"
              :remote="querySearch"
              :loading="loading"
              placeholder="请输入道岔名称"
            >
              <el-option></el-option>
            </el-select>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="3">
            <el-button @click="search">搜索</el-button>
          </el-col>
        </el-row>
      </el-card>
      <div ref="myChart" style="width:600px;height:400px;"></div>
    </div>
  </el-container>
</template>
<script>
// 按需引入echart
import echarts from 'echarts'
export default {
  data() {
    return {
      msg: 'one test',
      values: [
        [0.2, 4],
        [2, 10],
        [3, 13],
        [15, 15],
        [17, 19],
        [18, 0],
        [19, 0],
        [20, 0]
      ],
      datum: [
        [2, 4],
        [4, 4],
        [6, 4],
        [15, 4],
        [17, 4],
        [18, 4],
        [19, 4],
        [20, 4]
      ],
      myChart: null,
      stations: '',
      loading: false
    }
  },
  mounted() {
    this.display()
  },
  methods: {
    display() {
      var myChart = echarts.init(this.$refs.myChart)
      this.myChart = myChart
      myChart.setOption({
        title: {
          text: '动作电流曲线',
          left: 'center',
          textStyle: {
            color: '#0f0'
          }
        },
        // 勾选  和series里的name配合
        legend: {
          data: ['电流曲线', '参考曲线'],
          left: 'right'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            // console.log(params);
            return (
              'X: ' +
              params[0].data[0].toFixed(2) +
              '<br>Y: ' +
              params[0].data[1].toFixed(2)
            )
          }
        },
        xAxis: {
          min: 0,
          max: 20,
          type: 'value',
          axisLine: { onZero: false } // 对坐标轴的设定   不从零开始
        },
        yAxis: {
          min: 0,
          max: 20,
          type: 'value',
          axisLine: { onZero: false }
        },
        series: [
          // 电流曲线
          {
            name: '电流曲线',
            id: 'a',
            type: 'line',
            smooth: true,
            symbolSize: 8, // 点的标记大小
            data: this.values,
            // 每个点上显示具体数值
            label: {
              show: true,
              color: 'black',
              // 文本块样式
              fontSize: 10,
              fontFamily: 'Arial',
              formatter: function(param) {
                console.log(param)
                return param.data[1].toFixed(2)
              }
            }
          },
          // 参考曲线
          {
            name: '参考曲线',
            id: 'b',
            type: 'line',
            smooth: true,
            symbolSize: 8, // 点的标记大小
            data: this.datum,
            // 每个点上显示具体数值
            label: {
              show: true,
              // 文本块样式
              fontSize: 10,
              fontFamily: 'Arial',
              formatter: ['{a|参考曲线a}']
            }
          }
        ],
        dataZoom: [
          { type: 'inside', xAxisIndex: 0, filterMode: 'empty' },
          { type: 'inside', yAxisIndex: 0, filterMode: 'empty' }
        ]
      })
      myChart.setOption({
        // 增加拖拽功能   将两条曲线数组组合
        graphic: echarts.util.map(
          this.values.concat(this.datum),
          (dataItem, dataIndex) => {
            //   console.log(this.values);
            const that = this
            return {
              // graphic element的类型是圆点
              type: 'circle',
              shape: {
                //圆点的半径
                r: 5
              },
              // 显示数据变化 鼠标移动显示
              onmousemove: echarts.util.curry(this.showTooltip, dataIndex),
              onmouseout: echarts.util.curry(this.hideTooltip, dataIndex),
              // 得到每个点的原始位置(像素坐标)
              position: myChart.convertToPixel('grid', dataItem),

              // 让圆点看不见,但是不影响它响应鼠标事件
              invisible: true,
              // 让圆点可拖拽
              draggable: true,
              // 把z值设得大，表示这个圆点在最上方，能覆盖住已有的曲线圆点
              z: 100,
              // 拖拽事件
              ondrag: echarts.util.curry(function(dataIndex) {
                // 这里的 data 就是本文最初的代码块中声明的 data，在这里会被更新。
                // 此处需要将数组里的两条曲线数据进行分离
                // 由像素坐标 =》 数据坐标
                if (dataIndex <= that.values.length) {
                  // 电流曲线
                  that.values[dataIndex] = myChart.convertFromPixel(
                    'grid',
                    this.position
                  )
                  // 用更新后的 data，重绘折线图。
                  myChart.setOption({
                    series: [
                      {
                        id: 'a',
                        data: that.values
                      }
                    ]
                  })
                } else {
                  // 参考曲线
                  that.datum[
                    dataIndex - that.values.length
                  ] = myChart.convertFromPixel('grid', this.position)
                  // 更新
                  myChart.setOption({
                    series: [
                      {
                        id: 'b',
                        data: that.datum
                      }
                    ]
                  })
                }
              }, dataIndex)
            }
          }
        )
      })
    },
    showTooltip(dataIndex) {
      //   console.log(this.myChart);
      this.myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: dataIndex
      })
    },
    hideTooltip(dataIndex) {
      this.myChart.dispatchAction({
        type: 'hideTip'
      })
    },
    created() {
      addEventListener('resize', function() {
        this.myChart.setOption({
          graphic: echarts.util.map(data, function(item, dataIndex) {
            return {
              position: myChart.convertToPixel('grid', item)
            }
          })
        })
      })
      // 加载信息
      getBaseInfo()
    },
    async getBaseInfo() {
      const { data: info } = await this.$http.get()
    },
    // 搜索按钮
    search() {},
    // 站名远程搜索服务器
    querySearch(query) {
      if (query !== '') {
        this.loading = true
        // 指定时间后，执行函数
        setTimeout(() => {
          this.loading = false
          this.stations = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.stations = []
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>