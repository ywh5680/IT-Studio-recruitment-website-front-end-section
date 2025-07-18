<template>
  <div class="project-view-container">
    <StarfieldBackground :is-dark="theme.isDark" />
    <div class="main-content">
      <div class="year-filter">
        <button
          v-for="year in projectYears"
          :key="year"
          class="year-button"
          :class="{ active: year === currentProjectYear }"
          @click="jumpToYear(year)"
        >
          {{ year }}
        </button>
      </div>

      <div class="carousel-container" ref="container">
        <div class="carousel-track" ref="track">
          <div
            v-for="(project, index) in allProjects"
            :key="project.uniqueId"
            class="carousel-card"
            :ref="el => { if (el) cards[index] = el }"
          >
            <div class="card-image-container">
              <img :src="project.image" :alt="project.name" class="card-image">
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ project.name }}</h3>
              <p class="card-description">{{ project.description }}</p>
            </div>
          </div>
        </div>

        <button class="carousel-button prev" @click="prevSlide">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button class="carousel-button next" @click="nextSlide">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        <div class="carousel-indicators">
          <div
            v-for="(project, index) in allProjects"
            :key="project.uniqueId"
            class="indicator"
            :class="{ active: index === currentIndex }"
            @click="moveToSlide(index)"
          ></div>
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
      return Object.keys(this.projects).sort((a, b) => b - a);
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
	justify-content: center;
	align-items: center;
	overflow: hidden;
	position: relative;
  padding-top: 80px;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  z-index: 1;
}

.year-filter {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.year-button {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  background-color: rgba(255, 255, 255, 0.1);
  color: #f5f5f7;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.year-button.active,
.year-button:hover {
  background-color: #007aff;
  color: #fff;
  border-color: #007aff;
}


.carousel-container {
	width: 100%;
	max-width: 1200px;
	position: relative;
	perspective: 1500px; /* Reduced perspective for a subtler effect */
	padding: 1rem 0;
	margin: 0 auto;
}

.carousel-track {
	display: flex;
	transition: transform 0.5s ease-in-out;
	transform-style: preserve-3d;
}

.carousel-card {
	min-width: 320px;
	max-width: 320px;
	margin: 0 25px;
  /* Simplified background and border */
	background: rgba(255, 255, 255, 0.05);
	border-radius: 12px;
	overflow: hidden;
	backdrop-filter: blur(10px);
  /* Simplified shadow */
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
	transition: all 0.3s ease;
	transform-origin: center center;
	position: relative;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.carousel-card:not(.is-active) {
	transform: scale(0.8) rotateY(35deg) translateZ(-100px);
	opacity: 0.45;
}

.carousel-card.is-prev {
	transform-origin: right center;
	transform: scale(0.75) rotateY(45deg) translateX(-80px) translateZ(-150px);
}

.carousel-card.is-next {
	transform-origin: left center;
	transform: scale(0.75) rotateY(-45deg) translateX(80px) translateZ(-150px);
}

.carousel-card.is-active {
	transform: scale(1) rotateY(0) translateZ(0);
	opacity: 1;
	z-index: 20;
  /* Simplified active shadow */
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 15px rgba(56, 189, 248, 0.2);
}

.card-image-container {
	position: relative;
	height: 200px;
	overflow: hidden;
	border-bottom: 1px solid rgba(94, 234, 212, 0.2);
}

.card-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.8s ease;
}

.carousel-card.is-active .card-image {
	transform: scale(1.05);
}

.card-content {
	padding: 1rem;
	color: #f1f5f9;
}

.card-title {
  /* Apple system font stack */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
	margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 1.25rem;
	letter-spacing: 0.5px;
	position: relative;
	display: inline-block;
  color: #f5f5f7 !important;
}

.card-description {
	font-size: 0.9rem;
	line-height: 1.6;
	color: rgba(241, 245, 249, 0.7);
	font-weight: 400;
}

.carousel-button {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background-color: rgba(255, 255, 255, 0.1);
	color: #fff;
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 50%;
	width: 44px;
	height: 44px;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	z-index: 20;
	transition: all 0.3s ease;
	backdrop-filter: blur(5px);
}

.carousel-button:hover {
	background-color: rgba(255, 255, 255, 0.2);
	border-color: rgba(156, 217, 249, 0.5);
	transform: translateY(-50%) scale(1.05);
}

.carousel-button.prev {
	left: -22px;
}

.carousel-button.next {
	right: -22px;
}

.carousel-indicators {
	display: flex;
	justify-content: center;
	gap: 10px;
	margin-top: 2rem;
}

.indicator {
	width: 20px;
	height: 3px;
	background: rgba(156, 217, 249, 0.2);
	border-radius: 2px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.indicator.active {
	background: #9cd9f9;
	box-shadow: 0 0 8px rgba(156, 217, 249, 0.5);
}

@media (max-width: 768px) {
	.carousel-button {
		width: 38px;
		height: 38px;
	}

	.carousel-button.prev {
		left: 5px;
	}

	.carousel-button.next {
		right: 5px;
	}

	.carousel-card {
		min-width: 260px;
		max-width: 260px;
		margin: 0 15px;
	}

	.card-image-container {
		height: 160px;
	}
}
</style> 