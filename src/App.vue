<template>
  <v-app :dark="true" style="background-color: transparent;">
    <StarfieldBackground />
    <header class="main-header">
      <nav class="main-nav">
        <!-- 桌面端导航 -->
        <ul class="nav-list desktop-nav">
          <li class="nav-item"><router-link to="/">首页</router-link></li>
          <li class="nav-item"><router-link to="/about-us">关于我们</router-link></li>
          <li class="nav-item"><router-link to="/departments">部门介绍</router-link></li>
          <li class="nav-item"><router-link to="/projects">项目成果</router-link></li>
          <li class="nav-item"><router-link to="/team">团队成员</router-link></li>
          <li class="nav-item"><router-link to="/message-board">留言板</router-link></li>
          <li class="nav-item"><router-link to="/application-status">查询报名进度</router-link></li>
        </ul>
        
        <!-- 移动端导航菜单 -->
        <div class="mobile-nav" :class="{ 'open': isMobileMenuOpen }">
          <ul class="mobile-nav-list">
            <li class="mobile-nav-item"><router-link to="/" @click="closeMobileMenu">首页</router-link></li>
            <li class="mobile-nav-item"><router-link to="/about-us" @click="closeMobileMenu">关于我们</router-link></li>
            <li class="mobile-nav-item"><router-link to="/departments" @click="closeMobileMenu">部门介绍</router-link></li>
            <li class="mobile-nav-item"><router-link to="/projects" @click="closeMobileMenu">项目成果</router-link></li>
            <li class="mobile-nav-item"><router-link to="/team" @click="closeMobileMenu">团队成员</router-link></li>
            <li class="mobile-nav-item"><router-link to="/message-board" @click="closeMobileMenu">留言板</router-link></li>
            <li class="mobile-nav-item"><router-link to="/application-status" @click="closeMobileMenu">查询报名进度</router-link></li>
          </ul>
        </div>
        
        <!-- 移动端汉堡菜单按钮 -->
        <button @click="toggleMobileMenu" class="mobile-menu-toggle" :class="{ 'active': isMobileMenuOpen }">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </nav>
    </header>

    <main>
      <router-view />
    </main>
  </v-app>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import StarfieldBackground from './components/StarfieldBackground.vue';

export default {
  name: 'App',
  components: {
    StarfieldBackground
  },
  setup() {
    const isMobileMenuOpen = ref(false);
    
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };
    
    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false;
    };

    // 新增：监听窗口大小变化，桌面端自动关闭移动端菜单
    onMounted(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          isMobileMenuOpen.value = false;
        }
      };
      window.addEventListener('resize', handleResize);
      handleResize(); // 初始化时也执行一次
      onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize);
      });
    });

    return {
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu
    };
  }
}
</script>

