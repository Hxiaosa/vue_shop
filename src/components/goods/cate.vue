<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        index-text="#"
        :show-index="true"
        :expand-type="false"
        :selection-type="false"
        :data="catelist"
        :columns="columns"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-erroe" v-else style="color: red"></i>
        </template>

        <!-- 排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @closed="addCateDialogClosed"
    >
      <!-- addCateForm -->
      <el-form
        :model="addCateForm"
        :rules="addCateFromRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options指定数据源 -->
          <el-cascader
            clearable
            size="small"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //查询条件
      query: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类数据列表，默认为空
      catelist: [],

      //总数据条数
      total: 0,

      //为table指定列的对象
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          //表示将当前列定义为模板
          type: 'template',
          //表示这一列使用模板名称 插槽在表格内部定义
          template: 'isok',
        },
        {
          label: '排序',
          //表示将当前列定义为模板
          type: 'template',
          //表示这一列使用模板名称 插槽在表格内部定义
          template: 'order',
        },
        {
          label: '操作',
          //表示将当前列定义为模板
          type: 'template',
          //表示这一列使用模板名称 插槽在表格内部定义
          template: 'opt',
        },
      ],

      //控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,

      //添加商品函数
      addCateForm: {
        //将要添加的分类名称
        cat_name: '',

        //父级分类的ID
        cat_id: 0,

        //分类的等级
        cat_level: 0,
      },
      //添加分类表单的验证规则对象
      addCateFromRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 父级分类列表
      parentCateList: [],

      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
      },
      //选中的父级分类id数组
      selectedKeys: [],
    }
  },

  created() {
    //获取商品分类
    this.getCateList()
  },

  methods: {
    //   获取表格数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      //把数据列表赋值给catelist
      this.catelist = res.data

      //为总数据条数赋值
      this.total = res.data.length
    },

    //点击按钮展示添加分类对话框
    showAddCateDialog() {
      // 在打开对话框之前先获取数据
      this.getParentCateList()
      this.addCateDialogVisible = true
    },

    //获取父级分类的数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      this.parentCateList = res.data
    },
    //选择项发生变化触发，更新选择值
    parentCateChanged() {
      console.log(this.selectedKeys)
      //如果selectKeys数组中的length大于0，则证明选中父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类id
        this.addCateForm.cat_id =
          this.selectedKeys[this.selectedKeys.length - 1]

        //   父级分类级别 如果有两个数 就是二级
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_id = 0
        this.addCateForm.cat_level = 0
      }
    },

    //监听添加用户对话框关闭
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      //将登记选项也重置
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_id = 0
    },

    //监听确认按钮
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        // 添加分类成功可是没有更新？
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
  },
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
