<!--
 * @Author: your name
 * @Date: 2021-07-15 01:25:01
 * @LastEditTime: 2021-07-26 07:05:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\components\goods\Goods.vue
-->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <template #append>
              <el-button icon="el-icon-search" @click="getGoodsList"></el-button>
            </template> </el-input
        ></el-col>
        <el-col :span="18"
          ><el-button type="primary" class="addGoodsBtn" @click="goAddGoodsPage"
            >添加商品</el-button
          ></el-col
        >
      </el-row>

      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价值(元)"
          prop="goods_price"
          width="105px"
        ></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template v-slot="scope">
            {{fmdate(scope.row.add_time)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑商品"
            placement="top"
            :enterable="false"
          >
            <el-button type="primary" icon="el-icon-edit" @click="editGoodsVisible(scope.row.goods_id)"></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除商品"
            placement="top"
            :enterable="false"
          >
            <el-button type="danger" icon="el-icon-delete"></el-button>
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
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      addGoodsVisible: false,
      total: 0,
      goodslist: [],
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: ''
      }

    }
  },
  created() {
    if (this.queryInfo.pagesize !== 10) {
      this.queryInfo.pagesize = parseInt(
        window.sessionStorage.getItem('currentGoodsPathSize')
      )
      this.getGoodsList()
    }
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.console.error('获取商品列表失败！')
      }
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      window.sessionStorage.setItem('currentGoodsPathSize', newSize)
      this.queryInfo.pagesize = parseInt(
        window.sessionStorage.getItem('currentGoodsPathSize')
      )
      this.getGoodsList()
    },

    // 监听 CurrentChange 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },

    // 监听添加商品对话框的关闭 reset对话框
    addGoodsClosed() {
      this.$refs.addGoodsFormRef.resetFields()
    },
    fmdate(v) {
      v = moment(v * 1000).format('YYYY-MM-DD HH:mm:ss')

      // console.log(v)
      return v
    },
    goAddGoodsPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.addGoodsBtn {
  margin-left: 20px;
}
</style>>
