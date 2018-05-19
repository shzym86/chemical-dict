<template>
  <div id="navbar" class="container">
    <h3 class="title">
      <slot></slot>
    </h3>
    <!-- 搜索框 -->
    <EnterBox class="box" cname="enter-box-subpage"></EnterBox>
  </div>
</template>

<script>
import EnterBox from '../common/EnterBox'
export default {
  name: 'Navbar',
  components: {
    EnterBox
  },
  data () {
    return {}
  }
}
</script>

<style scoped lang="scss">
#navbar {
  margin: 15px auto;
  .title {
    float: left;
  }
  .box {
    float: right;
  }
}
</style>
