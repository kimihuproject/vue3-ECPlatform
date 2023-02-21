export default {
  //１ 與外部連接：data,methods
  props: ["pages", "getPerProduct"],
  //２ 版型
  template: `
  <nav aria-label="Page navigation example" class="my-5">
  <ul class="pagination justify-content-center">
  <!-- ４前後頁樣式動態設定 -->
  <!-- ６換頁事件-emit：從內傳外-->
    <li class="page-item" :class="{ disabled:!pages.has_pre}">
      <a href="#" class="page-link" @click.prevent="$emit('change-page',pages.current_page - 1 )">Previous</a>
    </li>

  <!-- ３頁碼跑回圈 -->
  <!-- ５換頁事件-props：由外傳內 -->
    <li class="page-item"
    v-for="page in pages.total_pages" :key="page + 'pageNum'" :class="{active : page === pages.current_page}">
    <!-- 5-1頁碼分流：在當頁不可再次點擊 -->
    <span v-if="page=== pages.current_page" class="page-link" 
  >{{page}}</span>
    <a v-else class="page-link" href="#"   @click.prevent="getPerProduct(page)">{{page}}</a>
    
    </li>
  
    <!-- ４前後頁樣式動態設定 -->
    <!-- ６換頁事件-emit：從內傳外 -->
    <li href="#" class="page-item" :class="{ disabled:!pages.has_next}">
      <a class="page-link" @click.prevent="$emit('change-page',pages.current_page + 1 )">Next</a>
    </li>
  </ul>
</nav>`,
};
