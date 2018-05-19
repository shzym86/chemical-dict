<template>
  <div id="search">
    <Heador></Heador>
    <Navbar>搜索结果：</Navbar>
    <!-- 查询到结果的页面 -->
    <div class="container" v-if="totalRecord > 0">
      <!-- Result -->
      <div class="toolbar">
        <p>已搜索到{{ totalRecord }}条与 <span class="red">{{ keywords }}</span> 相关的专业术语！</p>
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
    <!-- 没有查询到结果的页面布局 -->
    <div class="container" v-if="totalRecord == 0">
      <!-- Loading -->
      <div class="loading" v-if="searching">
        <Loading></Loading>
      </div>
      <!-- Result -->
      <div class="toolbar">
        <p>没有搜索到 <span class="red">{{ keywords }}</span> 的相关记录！</p>
        <router-link to="/category" class="btn btn-success btn-sm">查看全部研究方向</router-link>
      </div>
      <!-- List -->
      <div class="tips">
        <div class="icon">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120px" height="120px" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
          <g><path d="M500,10C227,10,10,227,10,500s217,490,490,490s490-217,490-490S773,10,500,10z M801,801c-84,84-189,126-301,126c-112,0-224-42-301-126S73,612,73,500c0-112,42-224,126-301c84-77,189-126,301-126c112,0,224,42,301,126s126,189,126,301C927,612,885,724,801,801z"/><path d="M290,402c0,34.8,28.2,63,63,63c34.8,0,63-28.2,63-63c0-34.8-28.2-63-63-63C318.2,339,290,367.2,290,402L290,402z"/><path d="M605,402c0,34.8,28.2,63,63,63c34.8,0,63-28.2,63-63c0-34.8-28.2-63-63-63C633.2,339,605,367.2,605,402L605,402z"/><path d="M507,633c-98,0-182,42-231,112c0,0-7,21,7,35c14,14,42,14,42,14c7-14,21-28,35-42c42-35,91-49,147-49s112,21,147,49c14,14,21,21,35,35c0,0,21,0,35-7c14-14,14-28,14-28C689,675,605,633,507,633z"/></g>
          </svg>
        </div>
        <div class="text">
          <h1>很遗憾，没有找到相关词汇！</h1>
          <p>您可以：</p>
          <p>（1）检查输入的词汇是否有误，并重新搜索。</p>
          <p>（2）如确认输入无误，可以联系我们补充收录。</p>
        </div>
      </div>
    </div>
    <!-- Loading -->
    <Loading v-if="searching"></Loading>
  </div>
</template>

<script>
import axios from 'axios'
import Heador from '../layout/Header'
import Navbar from '../layout/Navbar'
import Pagination from '../common/Pagination'
import Loading from '../common/Loading'
export default {
  name: 'Search',
  components: {
    Heador,
    Navbar,
    Pagination,
    Loading
  },
  data () {
    return {
      keywords: '',
      list: [],
      searching: false,
      currentPage: 1,
      totalRecord: -1,
      pageSize: 10
    }
  },
  computed: {
    lang () {
      let re = /[^\u4e00-\u9fa5]/
      // 不全为中文则返回"en"，按英文处理
      if (re.test(this.keywords)) return 'en'
      // 全为中文返回"cn"
      return 'cn'
    },
    allPages () {
      return Math.ceil(this.totalRecord / this.pageSize)
    }
  },
  methods: {
    onPageChange: function (page) {
      // this.currentPage = page;
      // console.log(this.currentPage);
      this.search(page)
    },
    search (page = 1) {
      // 搜索词为空或含有特殊字符，就不查询立即回到主页
      if (this.keywords === '' || !this.checkCode(this.keywords)) {
        this.$router.push({ path: '/' })
        return false
      }
      // 后台请求数据
      this.searching = true
      axios
        .get('/api/list', {
          params: {
            page,
            search: this.keywords,
            lang: this.lang
          }
        })
        .then(res => {
          let keywords = this.keywords
          let lang = this.lang
          let preList = res.data.data
          // 数据飘红
          preList.forEach(item => {
            item[lang] = item[lang].replace(
              keywords,
              `<span style="color:red;">${keywords}</span>`
            )
          })
          // 修改变量
          this.searching = false
          this.currentPage = page
          this.totalRecord = res.data.total
          this.list = preList
        })
    },
    // 这个页面还要验证一次特殊字符，否则在URL里输入特殊字符码也会报错
    checkCode (str) {
      // 过滤特殊字符，这些字符不能代入正则
      let specialKeys =
        "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&%*（）——|{}【】‘；：”“'。，、？]"
      let flag = 1
      for (let i = 0; i < str.length; i++) {
        let code = str.substr(i, 1)
        if (specialKeys.indexOf(code) > 0) {
          flag = 0
          break
        }
      }
      return flag !== 0
    }
  },
  mounted () {
    // 接收搜索框传过来的值并立即查询
    this.keywords = this.$route.query.wd || ''
    this.search()
  },
  watch: {
    // 监测路由变化，否则在当前页面搜索后，尽管跳转了当前路由，但由于组件复用，页面不会刷新
    $route (to, from) {
      // 强制刷新路由
      this.$router.go(0)
    }
  }
}
</script>

<style scoped lang="scss">
#search {
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

  .tips {
    width: 100%;
    height: 280px;
    background: #f3fbfd;
    padding: 30px;
    display: flex;
    justify-content: center;
    .icon {
      width: 120px;
      margin: 45px 60px;
    }
    .text {
      min-width: 500px;
      h1 {
        padding-bottom: 30px;
      }
    }
  }
}
</style>
