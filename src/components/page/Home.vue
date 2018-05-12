<template>
  <div class="container">
    <div class="main">
      <h1>化学专业术语在线词典</h1>
      <!-- 搜索框 -->
      <EnterBox cname="enter-box-homepage"></EnterBox>
      <p>热门搜索学科：
        <router-link to="/category" class="tag">有机化学</router-link>
        <router-link to="/category" class="tag">分析化学</router-link>
        <router-link to="/category" class="tag">无机化学</router-link>
        <router-link to="/category" class="tag">物理化学</router-link>
        <router-link to="/category" class="tag">更多</router-link>
      </p>
    </div>
    <div class="content">
      <p>词库总计收录超过 <span>10,000</span> 条化学专业术语，涉及超过 <span>40</span> 种不同研究方向。</p>
    </div>
  </div>
</template>

<script>
import EnterBox from "../common/EnterBox";
export default {
  name: "Home",
  components: {
    EnterBox
  },
  data() {
    return {};
  }
};
</script>

<style scoped lang="scss">
.main {
  > h1 {
    margin-top: 100px;
    margin-bottom: 60px;
    color: #2e6eb0;
  }
  text-align: center;
  &:after {
    content: "";
    clear: both;
  }
  .tag {
    display: inline-block;
    text-decoration: none;
    color: inherit;
    background: #d6eefd;
    line-height: 1.5em;
    margin: 0.4em;
    padding: 0.2em 1em;
    border-radius: 1em;
    &:last-child {
      background: #fbe0c0;
    }
  }
}
.content {
  margin-top: 80px;
  background: url("../../assets/logo.png") no-repeat center top;
  background-size: 80px;
  text-align: center;
  p {
    padding-top: 110px;
    font-size: 18px;
    > span {
      font-size: 24px;
      font-weight: bold;
      color: #ff9900;
    }
  }
}
</style>
