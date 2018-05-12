<template>
  <div id="category">
    <Heador></Heador>
    <Navbar>按学科类别搜索：</Navbar>
    <div class="container">
      <div class="category" v-for="category in categoryList" :key="category._id">
        <h4>{{ category._id }}</h4>
        <div class="subject" v-for="subject in category.subject" :key="subject._id">
          <router-link :to="{name: 'CategorySearch', query: {sub: subject}}">{{ subject }}</router-link>
        </div>
      </div>
    </div>
    <!-- Loading -->
    <Loading v-if="searching"></Loading>
  </div>
</template>

<script>
import axios from "axios";
import Heador from "../layout/Header";
import Navbar from "../layout/Navbar";
import Loading from "../common/Loading";
export default {
  name: "Category",
  components: {
    Heador,
    Navbar,
    Loading
  },
  data() {
    return {
      categoryList: [],
      searching: false
    };
  },
  methods: {
    fetchCategories() {
      this.searching = true;
      axios.get("/fetchIndex").then(res => {
        let preList = res.data.filter(item => {
          return item._id != null;
        });
        let order = [
          "有机化学",
          "分析化学",
          "无机化学",
          "物理化学",
          "高分子化学",
          "放射化学"
        ];
        // 按自定义规则排序数组
        this.categoryList = this.sortArray(preList, order);
        this.searching = false;
      });
    },
    sortArray(arr, order) {
      let list = [];
      for (let i = 0; i < arr.length; i++) {
        list = list.concat(arr.filter(item => item._id === order[i]));
      }
      return list;
    }
  },
  mounted() {
    this.fetchCategories();
  }
};
</script>

<style lang="scss" scoped>
.category {
  margin-bottom: 35px;
  h4 {
    color: #cc0000;
    padding-bottom: 0.8em;
    margin-bottom: 0.8em;
    border-bottom: 1px solid #222;
  }
  .subject {
    display: block;
    width: 25%;
    float: left;
    font-size: 16px;
    line-height: 2em;
    box-sizing: border-box;
    padding-right: 1.5em;
    a:hover {
      text-decoration: none;
    }
  }
  &:after {
    content: "";
    display: block;
    clear: both;
    height: 0;
    visibility: hidden;
  }
}
</style>

