<template>
  <div>
    <Bread nameone="订单管理" nametwo="订单列表"></Bread>
     <el-card class="box-card">
      <!-- 搜索订单 -->
      <el-input
        placeholder="请输入内容"
        class="input-with-select"
        v-model.lazy="params.query"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getOrder()"
        ></el-button>
      </el-input>
      <!-- 订单表格 -->
         <el-table border :data="goods" style="width: 100%">
            <el-table-column label="#" type="index"> </el-table-column>
            <el-table-column label="订单编号" prop="order_number" width="300px"> 
            </el-table-column>
            <el-table-column label="订单价格" prop="order_price">
            </el-table-column>
             <el-table-column label="是否付款" prop="pay_status">
                <template v-slot:="scope">
                    <el-tag type="danger" v-show="scope.row.pay_status==='0'">未付款</el-tag>
                    <el-tag type="success" v-show="scope.row.pay_status!=='0'">已付款</el-tag>
                </template>
            </el-table-column>
             <el-table-column label="是否发货" prop="is_send">
            </el-table-column>
             <el-table-column label="下单时间" prop="create_time">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot:="scope">
            
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  size="mini"
                  @click="getParammsg(scope.row)"
                ></el-button>
                <!-- 删除 -->
                <el-button
                  type="info"
                  icon="el-icon-setting"
                  circle
                  size="mini"
                  @click="checkWuliu()"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
    <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[5, 8, 10, 12]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <el-dialog title="物流查询" :visible.sync="DialogVisible" width="30%">
        <el-timeline :reverse="reverse">
            <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="DialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="DialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
     </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return {
            params:{
                query:'',
                pagenum:1,
                pagesize:5,
                user_id:'',
            },
            total:0,
            goods:[],
            DialogVisible:false,
            activities:[
    {
      "time": "2018-05-10 09:39:00",
      "ftime": "2018-05-10 09:39:00",
      "context": "已签收,感谢使用顺丰,期待再次为您服务",
      "location": ""
    },
    {
      "time": "2018-05-10 08:23:00",
      "ftime": "2018-05-10 08:23:00",
      "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
      "location": ""
    },
    {
      "time": "2018-05-10 07:32:00",
      "ftime": "2018-05-10 07:32:00",
      "context": "快件到达 [北京海淀育新小区营业点]",
      "location": ""
    },
    {
      "time": "2018-05-10 02:03:00",
      "ftime": "2018-05-10 02:03:00",
      "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
      "location": ""
    },
    {
      "time": "2018-05-09 23:05:00",
      "ftime": "2018-05-09 23:05:00",
      "context": "快件到达 [北京顺义集散中心]",
      "location": ""
    },
    {
      "time": "2018-05-09 21:21:00",
      "ftime": "2018-05-09 21:21:00",
      "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
      "location": ""
    },
    {
      "time": "2018-05-09 13:07:00",
      "ftime": "2018-05-09 13:07:00",
      "context": "顺丰速运 已收取快件",
      "location": ""
    },
    {
      "time": "2018-05-09 12:25:03",
      "ftime": "2018-05-09 12:25:03",
      "context": "卖家发货",
      "location": ""
    },
    {
      "time": "2018-05-09 12:22:24",
      "ftime": "2018-05-09 12:22:24",
      "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
      "location": ""
    },
    {
      "time": "2018-05-08 21:36:04",
      "ftime": "2018-05-08 21:36:04",
      "context": "商品已经下单",
      "location": ""
    }
  ],
        }
    },
    mounted(){
        this.getOrder()
    },
    methods:{
        async getOrder(){
            const {data}=await this.$http.get('orders',{params:this.params})
            if (!this.$errorDialog(data)) return;
            data.data.goods.forEach(item=>{
                item.create_time=this.$timeChange(item.create_time)
            })
            this.total=data.data.total
            this.goods=data.data.goods
        },
        handleSizeChange(pageSize){
            this.params.pagesize = pageSize
            this.getOrder()
        },
        handleCurrentChange(currentPage){
            this.params.pagenum = currentPage
            this.getOrder()
        },
        async checkWuliu(){
            this.DialogVisible=true
        }
    }
}
</script>

<style scoped>
.el-input-group {
  width: 30%;
  margin-bottom: 10px;
}
.el-input {
  margin-right: 10px;
}
.el-table {
  margin-bottom: 15px;
}
.el-card{
    height:660px;
}
</style>