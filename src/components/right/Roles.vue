<!--
 * @Author: your name
 * @Date: 2021-07-15 01:18:59
 * @LastEditTime: 2021-07-20 02:06:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \e_managesystem\src\components\right\Rules.vue
-->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <el-button type="primary" @click="addRoleVisible = true"
        >添加角色</el-button
      >
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'rightTags']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop', 'rightTags']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="4">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>

        <el-table-column label="操作" width="400px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditRole(scope.row.id)"
                >编辑</el-button
              >
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="confirmDeleteRole(scope.row.id)"
                >删除</el-button
              >
            </el-tooltip>

            <!-- 分配权限按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="showSetRight(scope.row)"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 这是添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      v-model="addRoleVisible"
      width="50%"
      @close="addRoleClosed"
    >
      <!-- 内容主体 -->
      <el-form
        ref="addRoleFormRef"
        :model="addRoleForm"
        label-width="80px"
        :rules="addRoleFormRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 这是修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      v-model="editRoleVisible"
      width="50%"
      @close="editRoleClosed"
    >
      <!-- 内容主体 -->
      <el-form
        ref="editRoleFormRef"
        :model="editRoleForm"
        label-width="80px"
        :rules="editRoleFormRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editRoleVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 这是分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      v-model="showSetRightVisible"
      width="50%"
      @close="resetSetRights"
    >
      <!-- 内容主体 -->
      <el-tree
        :data="rightlist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSetRightVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      rightlist: [],
      defKeys: [],
      addRoleVisible: false,
      editRoleVisible: false,
      showSetRightVisible: false,
      // 即将分配权限的角色id
      roleId: '',
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleForm: {},
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.rolelist = res.data
    },

    addRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功')
        this.addRoleVisible = false
        this.getRoleList()
      })
    },
    // 监听添加角色对话框的关闭事件
    addRoleClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 监听修改用户对话框的关闭事件
    editRoleClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },

    async showEditRole(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      //   console.log(res)
      if (res.meta.status !== 200) return this.$message.error('查询角色失败')
      this.editRoleForm = res.data
      this.editRoleVisible = true
    },

    // 提交编辑角色表单
    editRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return
        // console.log(valid)
        const { data: res } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleId: this.editRoleForm.roleId,
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失败!')
        }
        this.getRoleList()
        this.editRoleVisible = false

        this.$message.success('修改用户成功！')
      })
    },
    async confirmDeleteRole(id) {
      const Result = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (Result !== 'confirm') return this.$message.info('已经取消删除')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败!')
      this.getRoleList()
      this.$message.success('删除成功')
    },

    // 根据Id删除对应权限
    async removeRightById(role, rightId) {
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
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error('取消权限失败!')
      // this.getRoleList()
      // vue 3.x不行了 也会刷新了
      role.children = res.data
    },

    // 点击按钮展示分配权限对话框
    async showSetRight(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) { return this.$message.error('获取权限列表失败') }
      // 把获取到的权限数据保存到rightlist数组中
      this.rightlist = res.data
      this.getDefKeys(role, this.defKeys)
      this.showSetRightVisible = true
    },

    // 通过递归，获取角色下所有的三级权限的id，并保存到defKeys数组中
    getDefKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getDefKeys(item, arr))
    },

    // 监听分配权限对话框的关闭事件
    resetSetRights() {
      this.defKeys = []
    },

    // 点击按钮分配权限
    async addRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.getRoleList()
      this.showSetRightVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-top: 1px solid #eee;
}
</style>>
