<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="门票名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入门票名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="门票类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择门票类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_notice_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="门票状态" prop="name">
        <el-select
          v-model="queryParams.name"
          placeholder="请选择门票状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_notice_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="daterangeBeginDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="daterangeEndDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="实名类型" prop="contractFillType">
        <el-select
          v-model="queryParams.contractFillType"
          placeholder="请选择实名类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_notice_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['tour:ticket:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['tour:ticket:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['tour:ticket:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['tour:ticket:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="ticketList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="门票名称" align="center" prop="name" />
      <el-table-column label="门票类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_notice_status"
            :value="scope.row.type"
          />
        </template>
      </el-table-column>
      <el-table-column label="门票价格" align="center" prop="price" />
      <el-table-column
        label="门票优惠价格"
        align="center"
        prop="discountPrice"
      />
      <el-table-column label="库存" align="center" prop="inventory" />
      <el-table-column label="门票状态" align="center" prop="name">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_notice_status"
            :value="scope.row.name"
          />
        </template>
      </el-table-column>
      <el-table-column label="封面" align="center" prop="cover" />
      <el-table-column label="门票须知" align="center" prop="ticketRule" />
      <el-table-column
        label="开始日期"
        align="center"
        prop="beginDate"
        width="180"
      >
        <template slot-scope="scope">
          <span> {{ parseTime(scope.row.beginDate, "{y}-{m}-{d}") }} </span>
        </template>
      </el-table-column>
      <el-table-column
        label="结束日期"
        align="center"
        prop="endDate"
        width="180"
      >
        <template slot-scope="scope">
          <span> {{ parseTime(scope.row.endDate, "{y}-{m}-{d}") }} </span>
        </template>
      </el-table-column>
      <el-table-column label="实名类型" align="center" prop="contractFillType">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_notice_status"
            :value="scope.row.contractFillType"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="true"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tour:ticket:remove']"
            >上架</el-button
          >
          <el-button
            v-else
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tour:ticket:remove']"
            >下架</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['tour:ticket:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tour:ticket:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改门票信息对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="门票名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入门票名称" />
        </el-form-item>
        <el-form-item label="门票类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择门票类型">
            <el-option
              v-for="dict in dict.type.sys_notice_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门票价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入门票价格" />
        </el-form-item>
        <el-form-item label="门票优惠价格" prop="discountPrice">
          <el-input
            v-model="form.discountPrice"
            placeholder="请输入门票优惠价格"
          />
        </el-form-item>
        <el-form-item label="库存" prop="inventory">
          <el-input v-model="form.inventory" placeholder="请输入库存" />
        </el-form-item>
        <el-form-item label="门票状态" prop="name">
          <el-select v-model="form.name" placeholder="请选择门票状态">
            <el-option
              v-for="dict in dict.type.sys_notice_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-input v-model="form.cover" placeholder="请输入封面" />
        </el-form-item>
        <el-form-item label="门票须知" prop="ticketRule">
          <el-input v-model="form.ticketRule" placeholder="请输入门票须知" />
        </el-form-item>
        <el-form-item label="日期类型" prop="effectiveType">
          <el-select v-model="form.effectiveType" placeholder="请选择日期类型">
            <el-option
              v-for="dict in dict.type.sys_notice_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="beginDate">
          <el-date-picker
            clearable
            v-model="form.beginDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            clearable
            v-model="form.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实名类型" prop="contractFillType">
          <el-select
            v-model="form.contractFillType"
            placeholder="请选择实名类型"
          >
            <el-option
              v-for="dict in dict.type.sys_notice_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTicket,
  getTicket,
  delTicket,
  addTicket,
  updateTicket,
} from "@/api/tour/ticket";

export default {
  name: "ticket",
  dicts: [
    "sys_notice_status",
    "sys_notice_status",
    "sys_notice_status",
    "sys_notice_status",
  ],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 门票信息表格数据
      ticketList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      daterangeBeginDate: [],
      daterangeEndDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        type: null,
        name: null,
        beginDate: null,
        endDate: null,
        contractFillType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "门票名称不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "门票类型不能为空", trigger: "change" },
        ],
        price: [
          { required: true, message: "门票价格不能为空", trigger: "blur" },
        ],
        inventory: [
          { required: true, message: "库存不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "门票状态不能为空", trigger: "change" },
        ],
        effectiveType: [
          { required: true, message: "日期类型不能为空", trigger: "change" },
        ],
        beginDate: [
          { required: true, message: "开始日期不能为空", trigger: "blur" },
        ],
        endDate: [
          { required: true, message: "结束日期不能为空", trigger: "blur" },
        ],
        contractFillType: [
          { required: true, message: "实名类型不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询门票信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      this.queryParams.params = {};

      if (null != this.daterangeBeginDate && "" != this.daterangeBeginDate) {
        this.queryParams.params["beginBeginDate"] = this.daterangeBeginDate[0];
        this.queryParams.params["endBeginDate"] = this.daterangeBeginDate[1];
      }
      if (null != this.daterangeEndDate && "" != this.daterangeEndDate) {
        this.queryParams.params["beginEndDate"] = this.daterangeEndDate[0];
        this.queryParams.params["endEndDate"] = this.daterangeEndDate[1];
      }

      listTicket(this.queryParams).then((response) => {
        this.ticketList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        name: null,
        type: null,
        price: null,
        discountPrice: null,
        inventory: null,
        name: null,
        cover: null,
        ticketRule: null,
        effectiveType: null,
        beginDate: null,
        endDate: null,
        contractFillType: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        remark: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeBeginDate = [];
      this.daterangeEndDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加门票信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTicket(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改门票信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateTicket(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTicket(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除门票信息编号为"' + ids + '"的数据项？')
        .then(function () {
          return delTicket(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/ticket/export",
        {
          ...this.queryParams,
        },
        `ticket_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
