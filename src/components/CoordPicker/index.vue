<template>
  <div class="coord-picker">
    <div class="map-container">
      <amap
        cache-key="coord-picker-map"
        mmap-style="amap://styles/whitesmoke"
        async
        :center.sync="center"
        :zoom.sync="zoom"
        is-hotspot
        @click="onMapClick"
      >
        <amap-satellite-layer :visible="satellite" />

        <amap-marker v-if="position" :position.sync="position" draggable />

        <el-card class="result-panel">
          <template>
            <el-autocomplete
              class="inline-input"
              v-model="query"
              :fetch-suggestions="autoComplete"
              placeholder="输入关键词"
              :trigger-on-focus="false"
            ></el-autocomplete>
            <el-button @click="focus" :disabled="!query" type="primary">
              定位
            </el-button>
          </template>
        </el-card>

        <el-form class="info ant-card ant-card-bordered" layout="inline">
          <el-form-item label="坐标" v-if="position">
            <el-input read-only v-model="positionText" style="width: 200px" />
          </el-form-item>
          <el-form-item label="卫星图">
            <el-switch v-model="satellite" />
          </el-form-item>
        </el-form>
      </amap>
    </div>
    <div>
      <el-button type="primary" @click="confirmMap">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { loadAmap, loadPlugins } from "@amap/amap-vue";

export default {
  data() {
    return {
      center: null,
      zoom: 10,
      query: "",
      position: null,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      satellite: false,
    };
  },
  computed: {
    wrapper() {
      return this.$refs.wrapper;
    },
    positionText() {
      if (!this.position) return "";
      return `${this.position[0]}, ${this.position[1]}`;
    },
  },
  created() {
    this.$ready = new Promise(async (resolve) => {
      const AMap = await loadAmap();
      await loadPlugins(["AMap.PlaceSearch", "AMap.AutoComplete"]);

      this.ps = new AMap.PlaceSearch({
        pageSize: this.pageSize,
      });
      this.ac = new AMap.AutoComplete();

      resolve();
    });
  },
  methods: {
    onMapClick(e) {
      if (e.lnglat) {
        this.position = [e.lnglat.lng, e.lnglat.lat];
      } else {
        this.position = null;
      }
    },
    async autoComplete(kw, cb) {
      var results = [];
      if (!kw) {
        cb(results);
      } else {
        this.ac.search(kw, (status, result) => {
          console.log(result);
          if (kw !== this.query) return;
          if (status === "complete") {
            results = result.tips.map((tip) => {
              let _tip = tip;
              _tip.value = tip.name;
              return _tip;
            });
            cb(results);
          } else {
            cb(results);
          }
        });
      }
    },

    focus() {
      const pos = [poi.location.lng, poi.location.lat];
      this.position = [...pos];
      this.center = [...pos];
    },
    confirmMap() {
      const that = this;
      if (!this.position) {
        this.$message.error("请先定位");
        return;
      }
      this.$emit("confirm", that.position);
    },
    reset() {
      this.ps.setPageIndex(1);
      this.total = 0;
    },
  },
  watch: {
    pageIndex(value) {
      this.$ready.then(() => {
        this.ps.setPageIndex(value);
        this.search(false);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.map-container {
  width: 100%;
  height: 600px;
}

.result-panel {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 320px;
  display: flex;
  flex-direction: column;

  .search-bar {
    display: flex;
    align-items: center;
    .text {
      text-overflow: ellipsis;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .result-list.ant-list-loading {
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.info {
  position: absolute;
  right: 10px;
  top: 10px;
  padding-left: 24px;
}
</style>
