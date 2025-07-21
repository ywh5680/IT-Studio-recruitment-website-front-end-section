<template>
  <div class="project-view-container">
    <StarfieldBackground :is-dark="theme.isDark" />
    <div class="head">项目成果</div>
    <div class="main-content">
      <div class="container" v-for="year in projectYears" :key="year">
        <div class="year">{{ year }}</div>
        <div class="pro-container">
          <div v-for="(item, index) in projects[year]" :key="index" class="projects">
            <img v-if="item.image" :src="item.image" :alt="item.name" class="project-image" />
            <div class="text-content">
              <div class="title">{{ item.name }}</div>
              <div class="description">{{ item.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { projectsData } from '../data.js';
import StarfieldBackground from '@/components/StarfieldBackground.vue';
import { theme } from '@/theme.js';

export default {
  name: 'ProjectsView',
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
      projects: projectsData,
      currentIndex: 0,
      cardWidth: 0,
      cardMargin: 0,
      cards: [],
    };
  },
  computed: {
    projectYears() {
      return Object.keys(this.projects)
        .map(Number)
        .sort((a, b) => b - a)
        .map(String);
    },
    allProjects() {
      // Flatten projects and add year + unique ID
      return this.projectYears.flatMap(year => 
        this.projects[year].map((p, index) => ({
          ...p,
          year,
          uniqueId: `${year}-${index}`
        }))
      );
    },
    currentProjectYear() {
      if (this.allProjects.length > 0) {
        return this.allProjects[this.currentIndex].year;
      }
      return null;
    }
  },
  watch: {
    allProjects() {
      this.cards = [];
      this.$nextTick(() => {
        this.initializeCarousel();
      });
    }
  },
  mounted() {
    console.log('原始数据:', this.projects);
    console.log('排序后年份:', this.projectYears);
    this.$nextTick(() => {
        this.initializeCarousel();
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('keydown', this.handleKeydown);
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('keydown', this.handleKeydown);
  },
  methods: {
    initializeCarousel() {
      const cards = this.cards;
      if (!cards || cards.length === 0) return;
      
      this.cardWidth = cards[0].offsetWidth;
      this.cardMargin = parseInt(window.getComputedStyle(cards[0]).marginRight) * 2;
      
      this.moveToSlide(this.currentIndex);
    },
    updateCarousel() {
        const cards = this.cards;
        if (!cards) return;

        cards.forEach((card, index) => {
            if (!card) return;
            card.classList.remove('is-active', 'is-prev', 'is-next');
            if (index === this.currentIndex) {
                card.classList.add('is-active');
            } else if (index === this.currentIndex - 1) {
                card.classList.add('is-prev');
            } else if (index === this.currentIndex + 1) {
                card.classList.add('is-next');
            }
        });
    },
    moveToSlide(targetIndex) {
      if (targetIndex < 0 || targetIndex >= this.allProjects.length) {
        return;
      }

      const track = this.$refs.track;
      const container = this.$refs.container;
      if (!track || !container) return;

      const amountToMove = targetIndex * (this.cardWidth + this.cardMargin);
      const containerCenter = container.offsetWidth / 2;
      const cardCenter = this.cardWidth / 2;
      const targetTranslateX = containerCenter - cardCenter - amountToMove;

      track.style.transform = `translateX(${targetTranslateX}px)`;
      this.currentIndex = targetIndex;
      this.updateCarousel();
    },
    jumpToYear(year) {
      const targetIndex = this.allProjects.findIndex(p => p.year === year);
      if (targetIndex !== -1) {
        this.moveToSlide(targetIndex);
      }
    },
    nextSlide() {
      this.moveToSlide(this.currentIndex + 1);
    },
    prevSlide() {
        this.moveToSlide(this.currentIndex - 1);
    },
    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.initializeCarousel();
        }, 250);
    },
    handleKeydown(e) {
        if (e.key === 'ArrowRight') {
            this.nextSlide();
        } else if (e.key === 'ArrowLeft') {
            this.prevSlide();
        }
    }
  }
}
</script>

<style scoped>
.project-view-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column; 
  align-items: center;
  padding: 100px 20px 20px;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr; 
  justify-items: center; 
  width: 100%;
  z-index: 1;
  gap: 2rem; 
  max-width: 1000px;
}

.head {
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  width: 100%;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #a78bfa, #22d3ee);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  z-index: 2;
}

.container {
  display: grid;
  grid-template-rows: auto 1fr;
  width: 80%; 
  padding: 50px 0;
  max-width: 1000px;
}

.year {
  font-size: 3rem;
  font-weight: 600;
  background: linear-gradient(45deg, #6547ea 0%, #155ceb 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 1rem;
  width: 100%; 
  text-align: left; 
  align-self: start; 
}

.year::before{
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 1.5rem;
  background: linear-gradient(to bottom, #22d3ee, #818cf8); 
  border-radius: 2px;
}

.pro-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
  gap: 1.5rem; 
  width: 100%; 
}

.projects {
  position: relative;
  background: rgba(17, 24, 39, 0.7);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 0.75rem;
  padding: 1.5rem;
  height: 200px; /* 固定高度 */
  overflow: hidden; /* 隐藏超出部分 */
  transition: all 0.3s ease;
}

.projects::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(124, 58, 237, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.projects:hover {
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.projects:hover::before {
  opacity: 1;
}

.project-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.text-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; 
  transition: transform 0.3s ease;
}

.title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #e5e7eb;
  margin-bottom: 0.75rem;
  background: linear-gradient(to right, #a78bfa, #22d3ee);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: none !important; 
  -webkit-text-fill-color: transparent; 
}

.description {
  max-height: 0;
  opacity: 0;
  color: rgb(224, 224, 224);
  overflow: hidden;
  transition: all 0.3s ease;
}

.projects:hover .project-image {
  opacity: 0.3; 
}

.projects:hover .text-content {
  transform: translateY(-20%); 
}

.projects:hover .description {
  max-height: 100px; 
  opacity: 1;
  margin-top: 0.5rem;
}

@media (max-width: 767px) {
  .main-content,
  .container {
    width: 87%; 
  }
  
  .pro-container {
    grid-template-columns: 1fr; /* 单列布局 */
  }

  .project-view-container {
    padding-top: 0;
  }
}
</style> 