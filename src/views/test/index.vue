<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="景区名称" prop="SceneryName">
        <el-input v-model="queryParams.SceneryName" placeholder="请输入景区名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="景区电话" prop="SceneryPhone">
        <el-input v-model="queryParams.SceneryPhone" placeholder="请输入景区电话" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['Api:scenery:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['Api:scenery:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['Api:scenery:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['Api:scenery:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading=" loading " :data="sceneryList " @selection-change=" handleSelectionChange ">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="景区id" align="center" prop="SceneryId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi=" ['Api:scenery:edit'] ">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi=" ['Api:scenery:remove'] ">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show=" total > 0 " :total=" total " :page.sync=" queryParams.pageNum "
      :limit.sync=" queryParams.pageSize " @pagination=" getList " />

    <!-- 添加或修改景区表对话框 -->
    <el-dialog :title=" title " :visible.sync=" open " width="500px" append-to-body>
      <el-form ref="form" :model=" form " :rules=" rules " label-width="80px">
        <el-form-item label="景区名称" prop="SceneryName">
          <el-input v-model=" form.SceneryName " placeholder="请输入景区名称" />
        </el-form-item>
        <el-form-item label="景区电话" prop="SceneryPhone">
          <el-input v-model=" form.SceneryPhone " placeholder="请输入景区电话" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" submitForm ">确 定</el-button>
        <el-button @click=" cancel ">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listScenery, getScenery, delScenery, addScenery, updateScenery } from "@/api/Api/scenery";
export default {
  name: "Scenery",
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
      // 景区表表格数据
      sceneryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1, 
        pageSize: 10,
        SceneryName: null
        , SceneryPhone: null
        , SceneryIntro: null
        ,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询景区表列表 */
    getList() {
      this.loading = true;
      listScenery(this.queryParams).then(response => {
        this.sceneryList = response.rows;
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

        SceneryId: null,
        SceneryName: null,
        SceneryPhone: null,
        SceneryIntro: null,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.SceneryId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加景区表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const SceneryId = row.SceneryId || this.ids
      getScenery(SceneryId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改景区表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.SceneryId != null) {
            updateScenery(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addScenery(this.form).then(response => {
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
      const SceneryIds = row.SceneryId || this.ids;
      this.$modal.confirm('是否确认删除景区表编号为"' + SceneryIds + '"的数据项？').then(function () {
        return delScenery(SceneryIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('Api/scenery/export', {
        ...this.queryParams
      }, `scenery_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
