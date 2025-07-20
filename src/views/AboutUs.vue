<template>
  <div>
    <StarfieldBackground :is-dark="theme.isDark"/>
    <section id="about-us" class="about-us scroll">
      <div class="about-container">
        <div class="about-text">
          <h3>关于我们</h3>
          <p>
            爱特工作室成立于2002年，是一个在中国海洋大学信息科学与工程学部领导主持下，
            以计算机技术人才培养，网络开发为特色的技术性团体。
          </p>
          <p>
            爱特一直以凝聚和培养计算机人才为己任，发掘技术潜力，感受合作乐趣，让代码高效执行，
            让大家更进一步。
          </p>
          <p>
            用创意打磨精巧设计，用智慧实现炫酷交互；用热情呈现高效代码，以交流触碰灵感火花；
            以创造激发全新想象，用双手创造改变未来。
          </p>
          <p>
            汇聚技术力量，解剖程序内核，研究代码本质，巧解应用难题。以逻辑洞察数据，以细节战胜漏洞。
          </p>
          <p>
            OUC Hackday，是中国海洋大学爱特工作室（ITStudio）举办的Hackday活动。
            不同于国内各大互联网公司举办的面向全社会的Hackday，OUC Hackday主要面向群体是全国各大高校在读生，
            为大学生极客们提供了一个展示自己、相互交流、开阔视野的平台。
          </p>
        </div>
        <v-carousel height="500" class="carousel-container" cycle>
          <v-carousel-item v-for="(image, index) in carouselImages" :key="index">
            <v-img :src="image" alt="About Us Image" height="500" cover></v-img>
          </v-carousel-item>
        </v-carousel>
      </div>
    </section>
  </div>
</template>

<script>
import StarfieldBackground from '@/components/StarfieldBackground.vue';
import { theme } from '@/theme.js';

export default {
  name: 'AboutUsView',
  components: {
    StarfieldBackground,
  },
  setup() {
    return {
      theme
    };
  },
  data() {
    return {
      carouselImages: [
        'https://picsum.photos/id/1015/800/600',
        'https://picsum.photos/id/1016/800/600',
        'https://picsum.photos/id/1018/800/600'
      ],
    };
  },
  mounted() {
    // Original observer logic
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll').forEach(section => {
      observer.observe(section);
    });
  },
}
</script>

<style scoped>
.about-us {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1;
}

.about-container {
  display: flex;
  max-width: 1200px;
  margin: 15vh auto 5vh;
  align-items: center;
  gap: 50px;
  position: relative;
  z-index: 2;
}

.about-text {
  flex: 1;
  text-align: left;
}

.about-text h3 {
  font-size: 3rem;
  margin-bottom: 25px;
  font-weight: 600;
  color: #f5f5f7;
}

.about-text p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #a1a1a6;
  margin-bottom: 20px;
}

.carousel-container {
  flex: 1;
  max-width: 600px;
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* 适配手机端 */
@media (max-width: 767px) {
  .about-container {
  margin: 0 auto 25px;
  gap:20px;
}
}
</style> 