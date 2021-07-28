<!--
 * @Author: your name
 * @Date: 2021-07-15 01:22:13
 * @LastEditTime: 2021-07-28 03:00:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\components\report\Reports.vue
-->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容 -->
    <el-card>
      <!-- 2.为Echarts准备一个具备大小的Dom -->
      <div id="main" style="wdith: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
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
  created() {},
  // 此时页面上的元素已经渲染完毕
  async mounted() {
    // 3.基于准备好的dom,初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) { return this.$message.error('获取图标数据失败！') }
    // 4.准备数据项和配置项
    const result = _.merge(res.data, this.options)

    // 5.展示数据
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped>
</style>>
