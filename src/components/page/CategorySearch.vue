<template>
  <div id="category-search">
    <Heador></Heador>
    <Navbar>搜索结果：</Navbar>
    <!-- 查询到结果的页面 -->
    <div class="container" v-if="totalRecord > 0"> 
      <!-- Result -->
      <div class="toolbar">
        <p>已搜索到{{ totalRecord }}条 <span class="red">{{ subject }}</span> 研究方向的专业术语！</p>
        <router-link to="/category" class="btn btn-success btn-sm">查看全部研究方向</router-link>
      </div>
      <!-- List -->
      <table class="table table-striped">
        <tbody>
          <tr>
            <th>中文名</th>
            <th>英文名</th>
            <th>学科类别</th>
            <th>研究方向</th>
          </tr>
          <tr v-for="item in list" :key="item.id">
            <td v-html="item.cn"></td>
            <td v-html="item.en"></td>
            <td>{{ item.sub1 }}</td>
            <td>{{ item.sub2 }}</td>
          </tr>
        </tbody>
      </table>
      <pagination :total-pages="allPages" :current-page="currentPage" @pagechanged="onPageChange"></pagination>
    </div>
    <!-- Loading -->
    <Loading v-if="searching"></Loading>
  </div>
</template>

<script>
import axios from "axios";
import Heador from "../layout/Header";
import Navbar from "../layout/Navbar";
import Pagination from "../common/Pagination";
import Loading from "../common/Loading";
export default {
  name: "CategorySearch",
  components: {
    Heador,
    Navbar,
    Pagination,
    Loading
  },
  data() {
    return {
      subject: "",
      list: [],
      searching: false,
      currentPage: 1,
      totalRecord: -1,
      pageSize: 10
    };
  },
  computed: {
    allPages() {
      return Math.ceil(this.totalRecord / this.pageSize);
    }
  },
  methods: {
    onPageChange: function(page) {
      // this.currentPage = page;
      // console.log(this.currentPage);
      this.search(page);
    },
    search(page = 1) {
      // URL中没有query就不查询立即回到主页
      if (this.subject == "") {
        this.$router.push({ path: "/" });
        return false;
      }
      // 后台请求数据
      this.searching = true;
      axios
        .get("/api/list2", {
          params: {
            page,
            sub: this.subject
          }
        })
        .then(res => {
          // 如果在URL中乱写查询不到的话就跳转到主页
          if (res.data.total == 0) {
            this.$router.push({ path: "/" });
          } else {
            this.searching = false;
            this.currentPage = page;
            this.totalRecord = res.data.total;
            this.list = res.data.data;
          }
        });
    }
  },
  mounted() {
    // 接收路由传过来的值并立即查询
    this.subject = this.$route.query.sub || "";
    this.search();
  },
  watch: {
    // 监测路由变化，否则在当前页面搜索后，尽管跳转了当前路由，但由于组件复用，页面不会刷新
    $route(to, from) {
      // 强制刷新路由
      this.$router.go(0);
    }
  }
};
</script>

<style scoped lang="scss">
#category-search {
  .red {
    font-size: inherit;
    color: red;
  }

  table tr:first-child {
    background: rgb(18, 110, 181);
    color: #fff;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}
</style>