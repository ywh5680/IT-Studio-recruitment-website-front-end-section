<template>
  <div>
    <StarfieldBackground />
    <section id="team-members" class="team-members">
      <TeamSlider />
    </section>
  </div>
</template>

<script>
import TeamSlider from '../components/TeamSlider.vue';
import StarfieldBackground from '@/components/StarfieldBackground.vue';

export default {
  name: 'TeamView',
  components: {
    TeamSlider,
    StarfieldBackground,
  },
}
</script>

<style scoped>
.team-members {
  padding: 80px 0;
  position: relative;
  z-index: 1;
}
</style> 