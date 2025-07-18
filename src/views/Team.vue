<template>
  <div>
    <StarfieldBackground :is-dark="theme.isDark" />
    <section id="team-members" class="team-members">
      <TeamSlider />
    </section>
  </div>
</template>

<script>
import TeamSlider from '../components/TeamSlider.vue';
import StarfieldBackground from '@/components/StarfieldBackground.vue';
import { theme } from '@/theme.js';

export default {
  name: 'TeamView',
  components: {
    TeamSlider,
    StarfieldBackground,
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
  z-index: 1;
}

@media (max-width: 768px) {
  .team-members {
    padding: 20px 0;
  }
}
</style> 