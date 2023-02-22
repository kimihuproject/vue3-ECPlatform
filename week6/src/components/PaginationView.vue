<template>
  <nav aria-label="Page navigation example" class="my-5">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !pages.has_pre }">
        <a
          href="#"
          class="page-link"
          @click.prevent="$emit('change-page', pages.current_page - 1)"
          >Previous</a
        >
      </li>
      <li
        class="page-item"
        v-for="page in pages.total_pages"
        :key="page + 'pageNum'"
        :class="{ active: page === pages.current_page }"
      >
        <!-- 5-1頁碼分流：在當頁不可再次點擊 -->
        <span v-if="page === pages.current_page" class="page-link">{{
          page
        }}</span>
        <a
          v-else
          class="page-link"
          href="#"
          @click.prevent="getPerProduct(page)"
          >{{ page }}</a
        >
      </li>
      <li href="#" class="page-item" :class="{ disabled: !pages.has_next }">
        <a
          class="page-link"
          @click.prevent="$emit('change-page', pages.current_page + 1)"
          >Next</a
        >
      </li>
    </ul>
  </nav>
</template>

<script>
export default { props: ['pages', 'getPerProduct'] }
</script>
