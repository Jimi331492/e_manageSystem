<!--
 * @Author: your name
 * @Date: 2021-07-25 04:59:26
 * @LastEditTime: 2021-07-27 03:50:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\components\goods\add.vue
-->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="250"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 这是tab标签页 -->
      <el-form
        ref="addGoodsFormRef"
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name"
              ><el-input v-model="addGoodsForm.goods_name"></el-input
            ></el-form-item>
            <el-form-item label="商品价格" prop="goods_price"
              ><el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input
            ></el-form-item>
            <el-form-item label="商品重量" prop="goods_weight"
              ><el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input
            ></el-form-item>
            <el-form-item label="商品数量" prop="goods_number"
              ><el-input
                v-model="addGoodsForm.goods_number"
                type="number"
              ></el-input
            ></el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                class="cascader_addGoods"
                v-model="addGoodsForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChanged"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <span class="introduce"><strong>商品介绍</strong></span>
            <el-input
              type="textarea"
              :rows="10"
              placeholder="请输入"
              v-model="addGoodsForm.goods_introduce"
            >
            </el-input>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览框 -->
    <el-dialog title="图片预览 " v-model="previewVisible">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      previewPath: '',
      previewVisible: false,
      catelist: [],
      manyTableData: [],
      onlyTableData: [],
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      addGoodsForm: {
        goods_name: '',
        goods_cat: [], // 商品所属的分类数组
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
        // goods_introduce: [{ required: true, message: '请输入商品介绍', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类信息失败！')
      }
      this.catelist = res.data
    },

    // 级联选择器选中项变化会触发这个函数
    handleChanged() {
      // console.log(this.addGoodsForm.goods_cat)
      if (
        this.addGoodsForm.goods_cat === null ||
        this.addGoodsForm.goods_cat.length !== 3
      ) {
        this.addGoodsForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('你从' + oldActiveName + '来')
      // console.log('你到达了' + activeName)
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked() {
      // console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }

        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          // 控制文本框的显示与隐藏
          // item.inputVisible = ''
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性列表失败！')
        }

        // res.data.forEach((item) => {
        //   item.attr_vals =
        //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        //   // 控制文本框的显示与隐藏
        //   // item.inputVisible = ''
        // })
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 1.获取到将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到这个图片的索引值
      const i = this.addGoodsForm.pics.findIndex((x) => x.pic === filePath)
      // 3..调用数组的splice方法，将图片信息对象从pics数组中移除
      this.addGoodsForm.pics.splice(i, 1)
      console.log(this.addGoodsForm)
    },
    // 这是监听图片上传成功的事件
    handleSuccess(response) {
      // console.log(response)
      // 1.拼接一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path
      }
      // 2.将图片信息对象，push到pics数组中
      this.addGoodsForm.pics.push(picInfo)
      // console.log(this.addGoodsForm)
    },
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join(',')
        // 处理动态属性
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        // console.log(this.addGoodsForm)
        // 完成添加操作
        const { data: res } = await this.$http.post('goods', this.addGoodsForm)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败！')
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
// .el-form-item {
//   margin-bottom: 20px;
// }
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.introduce {
  display: block;
  font: 16px;
}
.el-textarea {
  margin: 20px 0;
}
</style>>
