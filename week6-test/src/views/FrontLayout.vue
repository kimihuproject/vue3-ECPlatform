<template>
  <header>
    <nav
      class="navbar navbar-expand-lg bg-body-tertiary bg-warning bg-opacity-50"
    >
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand"
          >Globetrotting Table</router-link
        >
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link">首頁</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/productsList" class="nav-link"
                >產品列表</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/cart" class="nav-link">菜籃車</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin" class="nav-link">前往後台</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/articlesList" class="nav-link link-secondary"
                >主題文章</router-link
              >
            </li>
            <li class="nav-item">
              <router-link to="/about" class="nav-link link-secondary"
                >關於本站</router-link
              >
            </li>
          </ul>
          <!-- <form class="d-flex" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button class="btn btn-outline-success" type="submit">
              Search
            </button>
          </form> -->
        </div>
      </div>
    </nav>
  </header>
  <div class="main">
    <div class="container my-3">
      <RouterView></RouterView>
    </div>
  </div>
  <footer class="mt-3 p-3 bg-opacity-25 bg-secondary">
    <p class="m-0 text-body-tertiary fw-light text-center p-2">
      &copy; Globetrotting Table since 2023
    </p>
  </footer>
</template>

<script>
import { RouterView, RouterLink } from 'vue-router'
export default {
  components: {
    RouterView,
    RouterLink
  }
}
</script>
