<template>
  <div class="Hello Vue and Echarts">
    <el-container>
      <el-header height="100px">
        <el-card>
          <!-- 搜索区域 -->
          <el-row :gutter="20" align="middle">
            <el-col :span="5" :offset="1">
              <span>道岔名：</span>
              <el-select class="dcname-input" v-model="dcname" placeholder="请输入道岔名称">
                <el-option v-for="name in dcnamelist" :key="name" :label="name" :value="name"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <el-button @click="search" icon="el-icon-search">搜索</el-button>
              <!-- <el-button @click="save">占位</el-button> -->
            </el-col>
            <el-col :span="7" :offset="2">
              <el-switch
                v-model="database"
                active-text="10版数据"
                inactive-text="18版数据"
                inactive-color="#13ce66"
              ></el-switch>
              <span class="bank1"></span>
              <el-button type="primary" @click="queryDCname">连库查道岔名</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-header>
      <el-container>
        <el-aside width="50%">
          <el-table
            ref="DcTable"
            :data="DcEntity.list"
            height="660px"
            border
            style="width: 100%;"
            :header-cell-style="{'text-align':'center'}"
          >
            <el-table-column prop="dcname" label="道岔名" width="100" align="center"></el-table-column>
            <el-table-column prop="startTime" label="动作时间" width="250" align="center">
              <span slot-scope="scope">{{dateFormat('YYYY-mm-dd HH:MM:SS',scope.row.startTime)}}</span>
            </el-table-column>
            <el-table-column prop="direction" label="动作方向" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleWatch(scope.$index, scope.row)"
                  icon="el-icon-search"
                >查看</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >待定</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-div">
            <!--  size-change:页码< >大小; current-change -->
            <el-pagination
              :size-change="10"
              @current-change="Handle"
              @current-page="search"
              :page-size="DcEntity.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="DcEntity.total"
            ></el-pagination>
          </div>
        </el-aside>

        <el-main width="50%">
          <el-row>
            <div ref="myChart1" style="width:80%;height:450px;margin:0 auto"></div>
          </el-row>
          <!-- <div ref="myChart2" style="width:100%;height:450px;"></div> -->
          <!-- <div style="width:50%;height:450px;display:inline-block">dddd</div> -->
          <el-row :gutter="20">
            <el-col :span="5" :offset="11">
              <div :v-model="dcdiv"></div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
// 按需引入echart
import echarts from 'echarts'
export default {
  data() {
    return {
      page: 1,
      msg: 'one test',
      valuesA: null,
      valuesB: null,
      valuesC: null,
      values: null,
      datum: null,
      myChart1: null,
      myChart2: null,
      stations: '',
      loading: false,
      database: true,
      dcnamelist: [], // 所有道岔名字
      dcname: '', // 当前所选道岔名
      DcEntity: [], // 该道岔的所有数据(表格数据)
      watch: { dcname: '', startTime: '', direction: '' },
      Csubtitle: '道岔名字'
    }
  },
  mounted() {
    this.display1()
    // this.display2()
  },
  methods: {
    display1(subtitle) {
      var myChart1 = echarts.init(this.$refs.myChart1)
      this.myChart1 = myChart1
      myChart1.setOption({
        title: {
          text: '动作电流曲线',
          subtext: subtitle,
          left: 'left',
          textStyle: {
            fontSize: 18,
            color: '#409eff'
          },
          subtextStyle: {
            fontSize: 16
          }
        },
        // 勾选  和series里的name配合
        legend: {
          data: ['功率曲线', '参考曲线', 'A曲线', 'B曲线', 'C曲线'],
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            // if (params.length === 1) {
            //   return (
            //     'X: ' +
            //     params[0].data[0].toFixed(2) +
            //     '<br>Y: ' +
            //     params[0].data[1].toFixed(2)
            //   )
            // } else if (params.length === 2) {
            //   return (
            //     'X: ' +
            //     params[0].data[0].toFixed(2) +
            //     '<br>Y: ' +
            //     params[0].data[1].toFixed(2) +
            //     '<br>参考曲线X：' +
            //     params[1].data[0].toFixed(2) +
            //     '<br>参考曲线Y：' +
            //     params[1].data[1].toFixed(2)
            //   )
            // }
            var info = ''
            for (var i = 0; i < params.length; i++) {
              console.log(params[i].seriesId)
              switch (params[i].seriesId) {
                case 'A':
                  info =
                    'A相 time: ' +
                    params[i].data[0].toFixed(2) +
                    's' +
                    ' value: ' +
                    params[i].data[1].toFixed(2)
                  break
                case 'B':
                  info +=
                    '<br>B相 time: ' +
                    params[i].data[0].toFixed(2) +
                    's' +
                    ' value: ' +
                    params[i].data[1].toFixed(2)

                  break
                case 'C':
                  info +=
                    '<br>C相 time: ' +
                    params[i].data[0].toFixed(2) +
                    's' +
                    ' value: ' +
                    params[i].data[1].toFixed(2)

                  break
                case 'W':
                  info +=
                    '<br>功率 time: ' +
                    params[i].data[0].toFixed(2) +
                    's' +
                    ' value: ' +
                    params[i].data[1].toFixed(2)

                  break
                case 'M':
                  info +=
                    '<br>参考 time: ' +
                    params[i].data[0].toFixed(2) +
                    's' +
                    ' value: ' +
                    params[i].data[1].toFixed(2)
                  break
              }
            }
            return info
          }
        },
        // 工具窗体   下载图片
        toolbox: {
          left: 'right',
          feature: {
            saveAsImage: {
              type: 'png',
              name: subtitle
            }
          }
        },
        grid: { right: '2%' },
        xAxis: {
          min: 0,
          //   max: 8.5,
          type: 'value',
          axisLine: { onZero: false }, // 对坐标轴的设定   不从零开始
          interval: 1
        },
        yAxis: {
          min: 0,
          max: 8,
          type: 'value',
          axisLine: { onZero: false },
          interval: 1
        },
        grid: {
          top: '12%'
        },
        series: [
          // 功率曲线  预留
          {
            name: '功率曲线',
            id: 'W',
            type: 'line',
            smooth: true,
            symbolSize: 0.5, // 点的标记大小
            data: this.values

            // 每个点上显示具体数值
            // label: {
            //   show: true,
            //   color: 'black',
            //   // 文本块样式
            //   fontSize: 10,
            //   fontFamily: 'Arial',
            //   formatter: function(param) {
            //     // console.log(param)
            //     return param.data[1].toFixed(2)
            //   }
            // }
          },
          // 参考曲线
          {
            name: '参考曲线',
            id: 'M',
            type: 'line',
            smooth: true,
            symbolSize: 0.5, // 点的标记大小
            data: this.datum
            // 每个点上显示具体数值
            // label: {
            //   show: true,
            //   // 文本块样式
            //   fontSize: 10,
            //   fontFamily: 'Arial',
            //   formatter: function(param) {
            //     // console.log('adddddddd', param)
            //     return param.data[1].toFixed(2)
            //   }
            // }
          },
          // A相电流曲线
          {
            name: 'A曲线',
            id: 'A',
            type: 'line',
            smooth: true,
            symbolSize: 0.5, // 点的标记大小
            data: this.valuesA,
            markLine: {
              data: [{ type: 'average', name: '平均值' }]
            }
            // 每个点上显示具体数值
            // label: {
            //   show: true,
            //   color: 'black',
            //   // 文本块样式
            //   fontSize: 10,
            //   fontFamily: 'Arial',
            //   formatter: function(param) {
            //     // console.log(param)
            //     return param.data[1].toFixed(2)
            //   }
            // }
          },
          // B相电流曲线
          {
            name: 'B曲线',
            id: 'B',
            type: 'line',
            smooth: true,
            symbolSize: 0.5, // 点的标记大小
            data: this.valuesB
            // 每个点上显示具体数值
            // label: {
            //   show: true,
            //   color: 'black',
            //   // 文本块样式
            //   fontSize: 10,
            //   fontFamily: 'Arial',
            //   formatter: function(param) {
            //     // console.log(param)
            //     return param.data[1].toFixed(2)
            //   }
            // }
          },
          // C相电流曲线
          {
            name: 'C曲线',
            id: 'C',
            type: 'line',
            smooth: true,
            symbolSize: 0.5, // 点的标记大小
            data: this.valuesC
            // 每个点上显示具体数值
            // label: {
            //   show: true,
            //   color: 'black',
            //   // 文本块样式
            //   fontSize: 10,
            //   fontFamily: 'Arial',
            //   formatter: function(param) {
            //     // console.log(param)
            //     return param.data[1].toFixed(2)
            //   }
            // }
          }
        ],
        dataZoom: [
          { type: 'inside', xAxisIndex: 0, filterMode: 'empty' },
          { type: 'inside', yAxisIndex: 0, filterMode: 'empty' }
        ]
      })
      myChart1.setOption({
        // 增加拖拽功能   将两条曲线数组组合
        graphic: echarts.util.map(
          this.valuesA
            .concat(this.valuesB)
            .concat(this.valuesC)
            .concat(this.values)
            .concat(this.datum),
          //   this.values.concat(this.datum),
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
              position: myChart1.convertToPixel('grid', dataItem),
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
                if (dataIndex <= that.valuesA.length) {
                  // A电流曲线
                  that.valuesA[dataIndex] = myChart1.convertFromPixel(
                    'grid',
                    this.position
                  )
                  // 用更新后的 data，重绘折线图。
                  myChart1.setOption({
                    series: [
                      {
                        id: 'A',
                        data: that.valuesA
                      }
                    ]
                  })
                }
                if (that.valuesA.length < dataIndex <= that.valuesB.length) {
                  // B电流曲线
                  that.valuesB[dataIndex] = myChart1.convertFromPixel(
                    'grid',
                    this.position
                  )
                  // 用更新后的 data，重绘折线图。
                  myChart1.setOption({
                    series: [
                      {
                        id: 'B',
                        data: that.valuesB
                      }
                    ]
                  })
                }
                if (
                  that.valuesA.length +
                    that.valuesB.length +
                    that.valuesC.length +
                    that.values.length <
                  dataIndex
                ) {
                  // 参考曲线
                  that.datum[
                    dataIndex - that.values.length
                  ] = myChart1.convertFromPixel('grid', this.position)
                  // 更新
                  myChart1.setOption({
                    series: [
                      {
                        id: 'M',
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
      this.myChart1.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: dataIndex
      })
      // this.myChart2.dispatchAction({
      //   type: 'showTip',
      //   seriesIndex: 0,
      //   dataIndex: dataIndex
      // })
    },
    hideTooltip(dataIndex) {
      this.myChart1.dispatchAction({
        type: 'hideTip'
      })
      // this.myChart2.dispatchAction({
      //   type: 'hideTip'
      // })
    },
    created() {
      addEventListener('resize', function() {
        this.myChart1.setOption({
          graphic: echarts.util.map(data, function(item, dataIndex) {
            return {
              position: myChart1.convertToPixel('grid', item)
            }
          })
        })
        //   this.myChart2.setOption({
        //     graphic: echarts.util.map(data, function(item, dataIndex) {
        //       return {
        //         position: myChart2.convertToPixel('grid', item)
        //       }
        //     })
        //   })
      })
    },
    // 查数据库中的道岔按钮    this.database：true 10版   false 18版
    async queryDCname() {
      const { data: Dname } = await this.$http.get(
        '/display?database=' + this.database
      )
      console.log('获取的道岔名字：')
      console.log(Dname)
      if (Dname.code != 200) {
        if (Dname.data == '18版表结构待开发') {
          this.$message({ message: '18版表结构待开发', type: 'warning' })
        } else {
          return this.$message.error('数据返回发生错误')
        }
      }
      this.$message({ message: '连接成功！', type: 'success' })
      // 循环取 Dname.extend.data中的dcname
      this.dcnamelist = Dname.extend.dcname
    },
    // 搜索按钮  根据选择的道岔名dcname 搜索数据
    async search() {
      console.log(this.dcname)

      const { data: DcData } = await this.$http.get(
        '/searchData?dcname=' +
          this.dcname.replace(/#/g, '%23') +
          '&pn=' +
          this.page
      )
      console.log('该道岔的数据列表：')
      console.log(DcData)
      if (DcData.code != 200) {
        return this.$message.error('查询该道岔数据出错')
      }
      //条件查询结果
      this.DcEntity = DcData.extend.data
      console.log(this.DcEntity)
    },
    // 页码处理函数     地址栏无法传递#
    async Handle(pn) {
      this.page = pn
      console.log(`当前页：${this.page}`)
      const { data: DcData } = await this.$http.get(
        '/searchData?dcname=' +
          this.dcname.replace(/#/g, '%23') +
          '&pn=' +
          this.page
      ) // 传参？pn
      if (DcData.code != 200) {
        return this.$message.error('获取数据失败！')
      }
      this.DcEntity = DcData.extend.data
    },

    // 新存修改后的曲线数据
    save() {},

    // 查看按钮
    handleWatch(index, row) {
      this.watch = Object.assign({}, row)
      // 调用数据接口
      this.watchDc(this.watch)
    },
    // 获取道岔数据接口
    async watchDc(condition) {
      console.log('查询曲线数据')
      const { data: dcdata } = await this.$http.get(
        '/watch?dcname=' +
          condition.dcname.replace(/#/g, '%23') +
          '&startTime=' +
          condition.startTime +
          '&direction=' +
          condition.direction
      )
      //   console.log(dcdata.extend.data.A)
      //   console.log(dcdata.extend.data.B)
      //   console.log(dcdata.extend.data.C)
      this.valuesA = dcdata.extend.data.A
      this.valuesB = dcdata.extend.data.B
      this.valuesC = dcdata.extend.data.C
      console.log(this.valuesA)
      console.log(this.valuesB)
      console.log(this.valuesB)
      this.Csubtitle =
        condition.dcname +
        ' ' +
        this.dateFormat('YYYY-mm-dd HH:MM:SS', condition.startTime) +
        ' ' +
        condition.direction
      this.display1(this.Csubtitle)
    },
    dateFormat(fmt, date) {
      let ret = ''
      date = new Date(date)
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
          )
        }
      }
      return fmt
    }
  }
}
</script>
<style lang="less" scoped>
.bank1 {
  padding-left: 100px;
}
.page-div {
  text-align: right;
}
</style>