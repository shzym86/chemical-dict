<template>
  <ul class="pagination">
    <li :class="{disabled: isInFirstPage}">
      <a href="javascript:;" @click.prevent="!isInFirstPage && onClickFirstPage()">首页</a>
    </li>
    <li :class="{disabled: isInFirstPage}">
      <a href="javascript:;" @click.prevent="!isInFirstPage && onClickPreviousPage()">上一页</a>
    </li>
    <li v-for="page in pages" :key="page.num" :class="{active: isPageActive(page.num)}">
      <a href="javascript:;" @click.prevent="!page.isDisabled && onClickPage(page.num)"> {{ page.num }}</a>
    </li>
    <li :class="{disabled: isInLastPage}">
      <a href="javascript:;" @click.prevent="!isInLastPage && onClickNextPage()">下一页</a>
    </li>
    <li :class="{disabled: isInLastPage}">
      <a href="javascript:;" @click.prevent="!isInLastPage && onClickLastPage()">尾页</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 10
    },
    totalPages: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    isInFirstPage: function () {
      return this.currentPage === 1
    },
    isInLastPage: function () {
      return this.currentPage === this.totalPages
    },
    // 起始页码
    startPage: function () {
      // 切换前几页位置不变，直到激活页码到中间位置才往后切换
      if (this.currentPage <= Math.floor(this.maxVisibleButtons / 2)) {
        return 1
      }
      // 切换到最后几页时，始终保持页码的个数不变
      if (this.currentPage >= this.totalPages - this.maxVisibleButtons + 1) {
        let sp = this.totalPages - this.maxVisibleButtons + 1
        // 如果总页数不足，则直接设为第一页
        return sp <= 0 ? 1 : sp
      }
      // 其它情况下，控制当前激活页始终在中间位置
      return this.currentPage - Math.floor(this.maxVisibleButtons / 2)
    },
    // 结束页码
    endPage: function () {
      return Math.min(
        this.startPage + this.maxVisibleButtons - 1,
        this.totalPages
      )
    },
    // 动态变化的页码集合
    pages: function () {
      const pageRange = []
      for (let i = this.startPage; i <= this.endPage; i++) {
        pageRange.push({
          num: i,
          isDisabled: i === this.currentPage
        })
      }
      return pageRange
    }
  },
  methods: {
    onClickFirstPage: function () {
      this.$emit('pagechanged', 1)
    },
    onClickPreviousPage: function () {
      this.$emit('pagechanged', this.currentPage - 1)
    },
    onClickPage: function (page) {
      this.$emit('pagechanged', page)
    },
    onClickNextPage: function () {
      this.$emit('pagechanged', this.currentPage + 1)
    },
    onClickLastPage: function () {
      this.$emit('pagechanged', this.totalPages)
    },
    isPageActive: function (page) {
      return this.currentPage === page
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
