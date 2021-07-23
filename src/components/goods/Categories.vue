<!--
 * @Author: your name
 * @Date: 2021-07-15 01:25:36
 * @LastEditTime: 2021-07-22 01:52:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\components\goods\Categories.vue
-->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <el-button type="primary" @click="showAddCateVisible()"
        >添加分类</el-button
      >
      <!-- 分类列表区域 -->
      <el-table
        :data="catelist"
        style="width: 100%"
        row-key="cat_id"
        border
        indent:18
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="180">
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="180">
          <template v-slot="scope">
            <i
              class="el-icon-success"
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen"
            ></i>
            <i class="el-icon-error" v-else style="red"></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
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
                @click="showEditCate(scope.row)"
                >编辑</el-button
              >
            </el-tooltip>

            <!-- 删除按钮 -->
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
                @click="confirmDeleteCate(scope.row.cat_id)"
                >删除</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes,prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 这是添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      v-model="addCateVisible"
      width="50%"
      @close="addCateClosed"
    >
      <!-- 内容主体 -->
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="80px"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addCateVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 这是修改分类的对话框 -->
    <el-dialog
      title="修改分类"
      v-model="editCateVisible"
      width="50%"
      @close="editCateClosed"
    >
      <!-- 内容主体 -->
      <el-form
        ref="editCateFormRef"
        :model="editCateForm"
        label-width="80px"
        :rules="editCateFormRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name">{{this.cateInfo.cat_name}}</el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editCateVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addCateVisible: false,
      editCateVisible: false,
      // 总数据条数
      total: 0,
      // 分类数据列表
      catelist: [],
      // 父级分类数据表
      parentCateList: [],
      // 为table指定列的含义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }
      ],
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: ''
      },
      addCateForm: {
        // 添加分类的名称
        cat_name: '',
        // 父类分类的Id,
        cat_pid: 0,
        // 分类等级默认是一级分类
        cat_level: 0
      },
      editCateForm: {},
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        cat_level: [
          { required: false, message: '请输入父级分类', trigger: 'blur' }
        ]
      },
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.queryInfo.pagesize !== 5) {
      this.queryInfo.pagesize = parseInt(
        window.sessionStorage.getItem('currentCatePathSize')
      )
      this.getCateList()
    }
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类信息失败！')
      }
      // console.log(res)
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 获取父级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data
    },

    // 监听pagesize 改变
    handleSizeChange(newSize) {
      window.sessionStorage.setItem('currentCatePathSize', newSize)
      this.queryInfo.pagesize = parseInt(window.sessionStorage.getItem('currentCatePathSize'))
      this.getCateList()
    },

    // 监听pagenum 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },

    // 点击按钮显示添加分类的对话框
    showAddCateVisible() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示出对话框
      this.addCateVisible = true
    },

    // 选择项发生变化触发这个函数
    parentCateChanged() {
      // 如果 SelectKeys 数组中的 length 大于0，证明选中的是父级节点
      // 反之则没有选中任何父类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },

    // 监听添加分类对话框的关闭 重置对话框内容
    addCateClosed() {
      this.$refs.addCateFormRef.resetFields()
    },

    // 点击按钮添加分类 提交到后端
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        // console.log(res)
        if (res.meta.status !== 201) { return this.$message.error('添加分类失败！') }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateVisible = false
      })
    },
    // 点击按钮打开编辑分类的对话框
    showEditCate(cate) {
      this.editCateForm = cate
      this.editCateVisible = true
    },

    // 监听修改分类对话框的关闭 重置对话框内容
    editCateClosed() {
      this.editCateForm = {}
      this.$refs.editCateFormRef.resetFields()
    },

    // 点击按钮修改分类
    editCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.editCateForm.cat_id}`,
          { cat_name: this.editCateForm.cat_name }
        )
        // console.log(this.cateInfo)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('更新分类失败')
        this.$message.success('更新分类成功！')
        this.getCateList()
        this.editCateVisible = false
      })
    },

    // 点击按钮删除分类
    async confirmDeleteCate(id) {
      // console.log(id)
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
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除分类失败!')
      this.getCateList()
      this.$message.success('删除成功！')
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 0.8em;
}
</style>>
