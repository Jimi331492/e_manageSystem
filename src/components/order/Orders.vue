<!--
 * @Author: your name
 * @Date: 2021-07-15 01:14:03
 * @LastEditTime: 2021-07-27 06:08:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\components\order\Order.vue
-->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <template #append>
              <el-button
                icon="el-icon-search"
                @click="getOrderList"
              ></el-button>
            </template> </el-input
        ></el-col>
      </el-row>

      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="商品价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template v-slot="scope">
            <el-tag v-if="scope.row.order_pay === '0'" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope">
            {{ fmdate(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改订单地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="editOrderVisible(scope.row.order_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="物流进度"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="success"
                icon="el-icon-location"
                @click="showProgressBox(scope.row.order_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="修改订单地址"
      v-model="showEditOrderVisible"
      width="50%"
      @close="editOrderClosed"
    >
      <!-- 内容主体 -->
      <el-form
        ref="editOrderFormRef"
        :model="editOrderForm"
        label-width="80px"
        :rules="editOrderFormRules"
      >
        <el-form-item label="省市区/县" prop="address">
          <el-cascader
            v-model="editOrderForm.address"
            :options="regionData"
            @change="handleChanged"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="editOrderForm.detailAddress"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEditOrderVisible = false">取 消</el-button>
          <el-button type="primary" @click="showEditOrderVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      title="物流进度"
      v-model="progressVisible"
      width="50%"
    >
<el-timeline>
    <el-timeline-item>1</el-timeline-item>
    <el-timeline-item>2</el-timeline-item>
    <el-timeline-item>3</el-timeline-item>
    <el-timeline-item>4</el-timeline-item>
    <el-timeline-item>5</el-timeline-item>
  </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      total: 0,
      showEditOrderVisible: false,
      progressVisible: false,
      orderlist: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: ''
      },
      editOrderForm: {
        address: [],
        detailAddress: ''
      },
      editOrderFormRef: {
        address: [{ require: true, message: '请选择省市区 / 县', trigger: 'blur' }],
        detailAddress: [{ require: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      regionData: this.$regionData
    }
  },
  created() {
    if (this.queryInfo.pagesize !== 10) {
      this.queryInfo.pagesize = parseInt(
        window.sessionStorage.getItem('currentOrderPathSize')
      )
    }
    this.getOrderList()
    // console.log(this.regionData)
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) { return this.$message.error('获取订单列表失败！') }
      this.orderlist = res.data.goods
      this.total = res.data.total
      // console.log(this.orderlist)
    },
    fmdate(v) {
      v = moment(v * 1000).format('YYYY-MM-DD HH:mm:ss')

      // console.log(v)
      return v
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      window.sessionStorage.setItem('currentOrderPathSize', newSize)
      this.queryInfo.pagesize = parseInt(
        window.sessionStorage.getItem('currentOrderPathSize')
      )
      this.getOrderList()
    },

    // 监听 CurrentChange 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    editOrderVisible(id) {
      this.showEditOrderVisible = true
    },
    editOrderClosed() {
      this.$refs.editOrderFormRef.resetFields()
    },
    handleChanged(value) {
      console.log(value)
    },
    async showProgressBox(id) {
      this.progressVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
</style>>
