<!--
 * @Author: your name
 * @Date: 2021-07-15 01:28:24
 * @LastEditTime: 2021-07-23 04:22:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\components\goods\Prarms.vue
-->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        show-icon
        title="注意:只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
      ></el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            class="cascader_2"
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChanged"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- Tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="showAddManyVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数Table  如果不默认全部展开 $refs会报错-->
          <el-table :data="manyTableData" border stripe default-expand-all>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditMany(scope.row)"
                    >编辑</el-button
                  >
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="confirmDelete(scope.row.attr_id)"
                    >删除</el-button
                  >
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisable"
            @click="showAddOnlyVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性Table -->
          <el-table :data="onlyTableData" border stripe default-expand-all>
            <el-table-column type="expand">
                <template v-slot="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(scope.row, index)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditOnly(scope.row)"
                    >编辑</el-button
                  >
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="confirmDelete(scope.row.attr_id)"
                    >删除</el-button
                  >
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 这是添加动态参数的对话框 -->
    <el-dialog
      title="添加动态参数"
      v-model="showAddManyVisible"
      width="50%"
      @close="addManyClosed"
    >
      <!-- 内容主体 -->
      <el-form
        ref="addManyFormRef"
        :model="addManyForm"
        label-width="80px"
        :rules="addManyFormRules"
      >
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="addManyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addManyVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMany">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 这是添加静态属性的对话框 -->
    <el-dialog
      title="添加静态属性"
      v-model="showAddOnlyVisible"
      width="50%"
      @close="addOnlyClosed"
    >
      <!-- 内容主体 -->
      <el-form
        ref="addOnlyFormRef"
        :model="addOnlyForm"
        label-width="80px"
        :rules="addOnlyFormRules"
      >
        <el-form-item label="静态属性" prop="attr_name">
          <el-input v-model="addOnlyForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addOnlyVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOnly">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 这是编辑动态参数的对话框 -->
    <el-dialog
      title="修改动态参数"
      v-model="editManyVisible"
      width="50%"
      @close="editManyClosed"
    >
      <!-- 内容主体 -->
      <el-form
        ref="editManyFormRef"
        :model="editManyForm"
        label-width="80px"
        :rules="addManyFormRules"
      >
        <el-form-item label="动态参数" prop="attr_name">
          <el-input v-model="editManyForm.attr_name">{{
            this.editManyForm.attr_name
          }}</el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editManyVisible = false">取 消</el-button>
          <el-button type="primary" @click="editMany">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 这是编辑静态属性的对话框 -->
    <el-dialog
      title="修改静态属性"
      v-model="editOnlyVisible"
      width="50%"
      @close="editOnlyClosed"
    >
      <!-- 内容主体 -->
      <el-form
        ref="editOnlyFormRef"
        :model="editOnlyForm"
        label-width="80px"
        :rules="addOnlyFormRules"
      >
        <el-form-item label="静态属性" prop="attr_name">
          <el-input v-model="editOnlyForm.attr_name">{{
            this.editOnlyForm.attr_name
          }}</el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editOnlyVisible = false">取 消</el-button>
          <el-button type="primary" @click="editOnly">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAddManyVisible: false,
      showAddOnlyVisible: false,
      editManyVisible: false,
      editOnlyVisible: false,
      activeName: 'many',
      // 商品分类列表
      catelist: [],
      //   级联选择框双向绑定数组
      selectedCateKeys: [],
      manyTableData: [],
      onlyTableData: [],
      //   级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      addManyForm: {
        attr_name: '',
        attr_sel: 'many'
      },
      addOnlyForm: {
        attr_name: '',
        attr_sel: 'only'
      },
      editManyForm: {},
      editOnlyForm: {},
      addManyFormRules: {
        attr_name: [
          { required: true, message: '请输入动态参数名称', trigger: 'blur' }
        ]
      },
      addOnlyFormRules: {
        attr_name: [
          { required: true, message: '请输入静态属性名称', trigger: 'blur' }
        ]
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
      //   console.log(res)
      //   console.log(this.catelist)
    },

    // 级联选择框选择项变化会触发这个函数
    handleChanged() {
      this.getParamsData()
    },

    // 在Tab里获取参数列表
    async getParamsData() {
    //   if (this.selectedCateKeys === null) {
    //     this.selectedCateKeys = []
    //     this.manyTableData = []
    //     this.onlyTableData = []
    //     return
    //   }
      if (this.selectedCateKeys === null || this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      //   选中的是三级分类
      //   console.log(this.selectedCateKeys)
      //   根据所选分类的ID，和根据当前的面板，获取对应的的参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      //   console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！')

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = ''
      })
      //   console.log(res.data)
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },

    // 这是Tab标签页点击事件
    handleTabClick() {
      //   if (this.selectedCateKeys.length !== 3) { return }
      this.getParamsData()
    },

    // 监听addMany对话框关闭
    addManyClosed() {
      this.$refs.addManyFormRef.resetFields()
    },
    // 监听addOnly对话框关闭
    addOnlyClosed() {
      this.$refs.addOnlyFormRef.resetFields()
    },
    editManyClosed() {
      this.$refs.editManyFormRef.resetFields()
    },
    editOnlyClosed() {
      this.$refs.editOnlyFormRef.resetFields()
    },

    // 点击按钮添加动态参数
    async addMany() {
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        this.addManyForm
      )
      //   console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error('添加动态参数失败！')
      }
      this.$message.success('添加动态参数成功！')
      this.getParamsData()
      this.showAddManyVisible = false
    },
    // 点击按钮添加静态属性
    async addOnly() {
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        this.addOnlyForm
      )
      console.log(res.data.attr_id)
      if (res.meta.status !== 201) {
        return this.$message.error('添加静态属性失败！')
      }
      this.$message.success('添加静态属性成功！')
      this.getParamsData()
      this.showAddOnlyVisible = false
    },
    async confirmDelete(id) {
      // 弹窗提示用户是否要删除
      const Result = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (Result !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除失败!')
      this.getParamsData()
      this.$message.success('删除成功！')
    },

    showEditMany(attr) {
      //   const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`)
      //   console.log(attr)
      this.editManyForm = attr
      this.editManyVisible = true
    },

    showEditOnly(attr) {
      //   const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`)
      //   console.log(attr)
      this.editOnlyForm = attr
      this.editOnlyVisible = true
    },

    editMany() {
      this.$refs.editManyFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editManyForm.attr_id}`,
          this.editManyForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改动态参数失败！')
        }
        this.$message.success('修改成功！')
        this.getParamsData()
        this.editManyVisible = false
      })
    },
    editOnly() {
      this.$refs.editOnlyFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editOnlyForm.attr_id}`,
          this.editOnlyForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改动态参数失败！')
        }
        this.$message.success('修改成功！')
        this.getParamsData()
        this.editOnlyVisible = false
      })
    },
    // 文本框失去焦点或者摁下Enter键都会触发
    async handleInputConfirm(row) {
      //   console.log('ok')
      row.inputValue = row.inputValue.trim()
      if (row.inputValue.length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //   如果没有return 说明后面输入的内容需要处理
      row.attr_vals.push(row.inputValue)
      row.inputValue = ''
      row.inputVisible = false
      //   发起请求，保存这次操作
      this.saveAttrVals(row)
    },
    // 点击按钮显示文本框
    showInput(row) {
      row.inputVisible = true
      //   让文本框自动获得焦点
      // $nextTick的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 删除动态标签
    handleClose(row, index) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    // 将对 attr_vals 的操作 保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      console.log(row)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('修改参数失败！')
      this.$message.success('修改参数成功！')
    }
  },
  computed: {
    //   如果选择器没有选择目标，则禁用按钮 返回true 否则返回false
    isBtnDisable() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else return false
    },

    // 这是当前选中的三级分类的ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        // console.log(this.selectedCateKeys[2])
        return this.selectedCateKeys[2]
      }
      return null
    }
  }
}
</script>

<style lang="less">
.cat_opt {
  margin: 15px 0;
}

.cascader_2 {
  width: 35% !important;
  margin-left: 20px;
}

.input-new-tag {
  width: 120px !important;
}
.el-tag {
  margin: 5px 8px;
}
</style>>
