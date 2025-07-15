<template>
  <v-app dark style="background-color: transparent;">
    <header class="main-header">
      <nav class="main-nav">
        <ul class="nav-list">
          <li class="nav-item"><router-link to="/">首页</router-link></li>
          <li class="nav-item"><router-link to="/about-us">关于我们</router-link></li>
          <li class="nav-item"><router-link to="/departments">部门介绍</router-link></li>
          <li class="nav-item"><router-link to="/projects">项目成果</router-link></li>
          <li class="nav-item"><router-link to="/team">团队成员</router-link></li>
          <li class="nav-item"><router-link to="/message-board">留言板</router-link></li>
          <li class="nav-item"><router-link to="/application-status">查询报名进度</router-link></li>
        </ul>
      </nav>
    </header>

    <main>
      <router-view />
    </main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
}
</script>

