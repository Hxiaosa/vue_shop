<template>
  <div>
    <!-- 面包屑结构 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片列表 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格主体区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5" align="center">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      :class="[i3 === 0 ? '' : 'bdtop']"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑角色按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editRolesDialogInfo(scope.row.id)"
              @close="editDialogClosed"
              >编辑</el-button
            >
            <!-- 删除角色按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配角色按钮 -->
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户时打开的窗口 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="addRolesDialogClosed"
    >
      <!-- 添加用户时需要输入的信息 -->
      <el-form
        :model="addRolesForm"
        :rules="addRolesRules"
        ref="addRolesFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- //编辑用户时打开的按钮 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%">
      <el-form
        ref="editRolesForm"
        :model="editRolesForm"
        label-width="80px"
        :rules="editRolesFormRules"
      >
        <!-- 这里注意校验时需要传入prop参数 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除角色对话框 -->
    <!-- <el-dialog
      title="删除角色"
      :visible.sync="deleteRolesDialogVisible"
      width="50%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRolesDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog> -->

    <!-- 分配权限时打开的窗口 -->
    <!-- 监听对话框的关闭事件,关闭时候数组要清空 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形结构 -->
      <!-- props是指定属性绑定对象，
      一个是指定按什么嵌套，一个是指定显示的label -->
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        :props="treeProps"
        ref="treeRef"
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色列表数据
      rolesList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //所有权限的数据 方便生成树形结构
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的节点ID值
      defKeys: [],
      //当前即将分配角色权限的Id
      roleId: '',

      //控制添加用户对话框的显示与隐藏
      addRolesDialogVisible: false,
      //添加用户时的信息
      addRolesForm: {
        roleName: '',
        roleDesc: '',
      },
      //添加用户时的规则
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
        ],
      },

      //控制编辑用户对话框的显示与隐藏
      editDialogVisible: false,

      //编辑用户时的信息:
      editRolesForm: {},

      //编辑用户时的校验规则
      editRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },

      //控制角色删除的显示与隐藏
      deleteRolesDialogVisible: false,
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.children = res.data.children
    },
    //弹框提示用户是否删除
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult != 'confirm') {
        return this.$message.info('取消了删除')
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      // 避免渲染数据重复刷新
      role.children = res.data
      // this.getRolesList()
    },

    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      // 一打开对话框便将角色的id赋给点击确定时需要的值
      this.roleId = role.id
      //获取所有权限列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      //获取到的权限数据保存到data中
      this.rightsList = res.data
      this.setRightDialogVisible = true

      //递归获取三级节点Id
      this.getLeafKeys(role, this.defKeys)
    },
    //通过递归，获取角色下所有三级权限的id并保存在defKey数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果不是，就需要递归
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限关闭窗口
    setRightDialogClosed() {
      this.defKeys = []
    },
    //点击为角色分配权限
    async allotRights() {
      // 获取选中的索引id
      const keys = [
        // 什么时候需要引用？需要元素的自身属性或者方法的时候？
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      console.log(keys)
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      //刷新列表
      this.getRolesList()

      //刷新列表之后需要隐藏对话框
      this.setRightDialogVisible = false
    },
    // 控制页面关闭时清除历史输入 注意用引用
    addRolesDialogClosed() {
      this.$refs.addRolesFormRef.resetFields()
    },
    //添加角色 控制表单信息的输入，在点击确定按钮时将数据传给后台
    addRoles() {
      console.log('添加角色成功')
      this.$refs.addRolesFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('添加角色错误')
        }
        const { data: res } = await this.$http.post('/roles', this.addRolesForm)
        if (res.meta.status != 201) {
          return this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')

        //隐藏添加角色成功对话框
        this.addRolesDialogVisible = false

        //重新获取用户列表数据
        this.getRolesList()
      })
    },

    //编辑角色对话框
    async editRolesDialogInfo(id) {
      this.editDialogVisible = true

      const { data: res } = await this.$http.get(`roles/` + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败')
      }
      this.editRolesForm = res.data
    },

    //编辑角色确定时的对话框
    editRolesInfo() {
      this.$refs.editRolesForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `roles/` + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          }
        )
        // console.log(this.editRolesForm)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('角色描述修改失败')
        }
        //关闭对话框
        this.editDialogVisible = false
        //刷新数据列表
        this.getRolesList()
        //提示修改成功
        this.$message.success('更新角色描述成功')
      })
    },

    // 监视编辑角色关闭对话框
    editDialogClosed() {
      this.$refs.editRolesForm.resetFields()
    },

    //删除角色函数
    async deleteRoles(id) {
      const confirmResult = await this.$confirm('是否删除该角色', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/` + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')

      this.getRolesList()
    },
  },
}
</script>

<style>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}

.el-table {
  margin-top: 15px;
}
</style>
