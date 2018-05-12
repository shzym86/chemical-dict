<template>
  <header class="container-fluid">
    <div class="container">
      <router-link to="/">化学专业术语在线翻译</router-link>
    </div>    
  </header>
</template>

<script>
export default {
  name: "Header",
  components: {},
  data() {
    return {};
  }
};
</script>

<style scoped lang="scss">
header {
  background: #eee;
  line-height: 50px;
  font-size: 2rem;
  a {
    text-decoration: none;
  }
}
</style>
