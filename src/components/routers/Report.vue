<template>
  <div>
    <Bread nameone="数据管理" nametwo="数据统计"></Bread>
    <el-card class="box-card">
        <div id="main" style="width: 1000px;height:600px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    data(){
        return {
            options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
        }
    },
    async mounted(){
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById('main'))
        const{data}=await this.$http.get('reports/type/1')
        const obj = {...this.options,...data.data}
        // 绘制图表
        myChart.setOption(obj)
    }
}
</script>

<style>

</style>