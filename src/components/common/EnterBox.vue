<template>
  <div class="enter-box" :class="cname">
    <input class="enter-box-input" type="text" v-model.trim="keywords" placeholder="输入需要查询的中文、英文..." @keyup.enter="gotoSearch()">
    <div class="enter-box-btn" @click="gotoSearch()"><i class="glyphicon glyphicon-search"></i>查词</div>
  </div>
</template>

<script>
export default {
  name: "EnterBox",
  data() {
    return {
      keywords: ""
    };
  },
  props: {
    cname: {
      type: String,
      required: true
    }
  },
  methods: {
    // 动态控制是否跳转路由，使用编程式导航
    gotoSearch() {
      if (!this.keywords) {
        alert("请输入查询关键词！");
      } else if (!this.checkCode(this.keywords)) {
        alert("请不要输入特殊字符！");
      } else {
        this.$router.push({
          name: "Search",
          query: {
            wd: this.keywords
          }
        });
      }
    },
    checkCode(str) {
      // 过滤特殊字符，这些字符不能代入正则
      let specialKeys =
        "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&%*（）——|{}【】‘；：”“'。，、？]";
      let flag = 1;
      for (let i = 0; i < str.length; i++) {
        let code = str.substr(i, 1);
        if (specialKeys.indexOf(code) > 0) {
          flag = 0;
          break;
        }
      }
      return flag == 0 ? false : true;
    }
  }
};
</script>

<style lang="scss" scoped>
$color: #2e6eb0;

@mixin inputBox($type) {
  width: if($type==long, 36em, 18em);
  height: inherit;
  outline: none;
  border: 1px $color solid;
  padding: 0.5em;
  font-size: 0.7em;
}
@mixin btn {
  width: 5em;
  text-align: center;
  color: #fff;
  background: $color;
  height: inherit;
  cursor: pointer;
  box-shadow: 1px 1px 5px 0 #ccc;
  i {
    margin-right: 0.4em;
    position: relative;
    top: 0.12em;
  }
  &:hover {
    opacity: 0.9;
  }
}

.enter-box-homepage {
  font-size: 24px;
  .enter-box-input {
    @include inputBox(long);
  }
}
.enter-box-subpage {
  font-size: 16px;
  .enter-box-input {
    @include inputBox(short);
  }
}
.enter-box {
  width: min-content;
  display: flex;
  flex-wrap: nowrap;
  margin: 1.2em auto;
  height: 2em;
  line-height: 2em;
  .enter-box-btn {
    @include btn();
  }
}
</style>
