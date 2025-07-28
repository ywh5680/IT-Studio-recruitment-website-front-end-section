<template>
  <div>
    <StarfieldBackground :is-dark="theme.isDark" />
    <section id="team-members" class="team-members">
      <TeamSlider />
    </section>
    <WebsiteFooter></WebsiteFooter>
  </div>
</template>

<script>
import TeamSlider from '../components/TeamSlider.vue';
import StarfieldBackground from '@/components/StarfieldBackground.vue';
import { theme } from '@/theme.js';
import WebsiteFooter from '@/components/WebsiteFooter.vue';

export default {
  name: 'TeamView',
  components: {
    TeamSlider,
    StarfieldBackground,
    WebsiteFooter
  },
  setup() {
    return {
      theme
    };
  }
}
</script>

<style scoped>
.team-members {
  padding: 40px 0;
  position: relative;
  min-height: calc(100vh - 30px);
  z-index: 1;
}

@media (max-width: 768px) {
  .team-members {
    padding: 20px 0;
  }
}
</style> 