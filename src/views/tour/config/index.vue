<template>
  <div>
    <el-row style="margin-top: 50px">
      <el-col :span="12">
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="110px"
        >
          <el-form-item label="景区名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入景区名称"
              :maxlength="11"
              show-word-limit
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
          <el-form-item label="景区简介" prop="introduce">
            <el-input
              v-model="formData.introduce"
              type="textarea"
              placeholder="请输入景区简介"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
          <el-row type="flex" justify="space-between">
            <el-col :span="10">
              <el-form-item label="经度" prop="longitude">
                <el-input
                  v-model="formData.longitude"
                  placeholder="请输入经度"
                  clearable
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10"
              ><el-form-item label="纬度" prop="latitude">
                <el-input
                  v-model="formData.latitude"
                  placeholder="请输入纬度"
                  clearable
                >
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="4" style="text-align: right">
              <el-button type="primary" @click="showMap">拾取坐标</el-button>
            </el-col>
          </el-row>

          <el-form-item label="地址" prop="address">
            <el-input
              v-model="formData.address"
              placeholder="请输入地址"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="营业时间" prop="openTime">
            <el-input
              v-model="formData.openTime"
              placeholder="请输入营业时间"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="最晚入园时间" prop="dayLastTime">
            <el-input
              v-model="formData.dayLastTime"
              placeholder="请输入当天最晚入园时间"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="景区政策" prop="rule">
            <editor :height="300" v-model="formData.rule"></editor>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog
      title="坐标拾取"
      :visible.sync="mapVisible"
      width="80%"
      append-to-body
    >
      <CoordPicker
        v-on:confirm="selectPosition"
      ></CoordPicker>
      
    </el-dialog>
  </div>
</template>
<script>
import { getConfig, updateConfig } from "@/api/tour/config";
import Editor from "@/components/Editor";
import CoordPicker from "@/components/CoordPicker";
export default {
  components: {
    Editor,
    CoordPicker,
  },
  data() {
    return {
      mapVisible: false,
      formData: {
        name: undefined,
        introduce: undefined,
        latitude: undefined,
        longitude: undefined,
        address: undefined,
        openTime: undefined,
        dayLastTime: undefined,
        rule: undefined,
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入景区名称",
            trigger: "blur",
          },
        ],
        introduce: [
          {
            required: true,
            message: "请输入景区简介",
            trigger: "blur",
          },
        ],
        latitude: [
          {
            required: true,
            message: "请输入经度",
            trigger: "blur",
          },
        ],
        longitude: [
          {
            required: true,
            message: "请输入维度",
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "请输入地址",
            trigger: "blur",
          },
        ],
        openTime: [
          {
            required: true,
            message: "请输入营业时间",
            trigger: "blur",
          },
        ],
        dayLastTime: [
          {
            required: true,
            message: "请选择最晚入园时间",
            trigger: "change",
          },
        ],
        rule: [
          {
            required: true,
            message: "请输入景区政策",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getConfig();
  },
  mounted() {},
  methods: {
    getConfig() {
      const that = this;
      getConfig().then((res) => {
        that.formData = res.data;
      });
    },
    submitForm() {
      const that = this;
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
        updateConfig(that.formData).then((res) => {
          this.$message.success("保存成功");
        });
      });
    },
    showMap() {
      this.mapVisible = true;
    },
    selectPosition(e) {
      console.log(e);
      this.formData.longitude = e[0];
      this.formData.latitude = e[1];
      this.mapVisible = false;
    },
  },
};
</script>
<style></style>
