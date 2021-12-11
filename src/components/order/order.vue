<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8"
          ><el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
      </el-row>

      <!-- 订单表格区域 -->

      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="40"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="290">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="150">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="150">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'"
              >未付款</el-tag
            >
            <el-tag type="primary" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="150">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 修改 -->
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editAddress"
          ></el-button>
          <!-- 定位 -->
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-location"
            @click="showProgress"
          ></el-button>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 定位对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(item, index) in progressInfo"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
import logistics from './logistics'

export default {
  data() {
    return {
      //表格参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      //参数列表
      orderList: [],
      //总页数
      total: 0,
      //控制对话框的删除与关闭
      addressVisible: false,

      //编辑参数
      addressForm: {
        address1: [],
        address2: '',
      },

      //编辑规则
      addressFormRules: {
        address1: [
          { required: true, trigger: 'blur', message: '请输入省市区/县' },
        ],
        address2: [
          { required: true, trigger: 'blur', message: '请输入详细地址' },
        ],
      },
      //城市信息
      cityData,

      //物流信息
      logistics,
      progressVisible: false,

      //物流信息
      progressInfo: [],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    //获取表格数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.queryInfo)
    },

    // 监听页面变化
    handleSizeChange(newVal) {
      this.queryInfo.pagesize = newVal
      this.getOrderList()
    },

    // 监听页面当前页面
    handleCurrentChange(newVal) {
      this.queryInfo.pagenum = newVal
      this.getOrderList()
    },

    //修改地址
    editAddress() {
      this.addressVisible = true
    },

    //监听关闭对话框
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },

    //监听定位按钮
    showProgress() {
      this.progressInfo = this.logistics
      this.progressVisible = true
      console.log(this.progressInfo)
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
