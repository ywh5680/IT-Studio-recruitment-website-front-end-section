<template>
  <div class="departments-view">
    <StarfieldBackground :is-dark="theme.isDark" />
    <div class="departments-container">
      <header class="departments-header">
        <h1 class="title">部门介绍</h1>
        <p class="subtitle">我们拥有多元化的技术部门，共同探索和创造前沿科技</p>
      </header>

      <main class="carousel-main">
        <div class="carousel-container">
          <div class="carousel" ref="carousel">
            <!-- Department Cards -->
            <div
              v-for="(dept, index) in departments" 
              :key="dept.name"
              class="department-card" 
              :data-index="index"
              @click="flipCard"
              ref="cards"
            >
              <div class="card-inner">
                <div class="card-front">
                  <div class="card-content">
                    <div class="department-icon">
                      <i :class="getDepartmentIcon(dept.name)"></i>
                    </div>
                    <h3>{{ dept.name }}</h3>
                  </div>
                </div>
                <div class="card-back">
                  <div class="card-content">
                    <h3>{{ dept.name }}</h3>
                    <p>{{ dept.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <footer class="departments-footer">
        <p class="instructions">点击卡片查看详细介绍<br>
          左右滑动查看其他部门</p>
      </footer>
    </div>
  </div>
</template>

<script>
import { departmentsData } from '../data.js';
import StarfieldBackground from '@/components/StarfieldBackground.vue';
import { theme } from '@/theme.js';

export default {
  name: 'DepartmentsView',
  components: {
    StarfieldBackground
  },
  setup() {
    return {
      theme
    };
  },
  data() {
    return {
      departments: departmentsData,
      currentIndex: 0,
      theta: 0,
      radius: 450,
      totalCards: departmentsData.length,
      isDragging: false,
      startX: 0,
    };
  },
  mounted() {
    this.init();
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('mouseup', this.dragEnd);
    document.removeEventListener('touchmove', this.drag);
    document.removeEventListener('touchend', this.dragEnd);
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.radius = window.innerWidth <= 768 ? 280 : 450;
        this.arrangeCards();
        this.addEventListeners();
      });
    },
    arrangeCards() {
      if (!this.$refs.cards) return;
      
      const cards = this.$refs.cards;
      const angle = 360 / this.totalCards;
      
      cards.forEach((card, index) => {
        const cardAngle = angle * index;
        card.style.transform = `rotateY(${cardAngle}deg) translateZ(${this.radius}px)`;
        card.dataset.index = index;
      });
    },
    addEventListeners() {
      const carousel = this.$refs.carousel;
      if (!carousel) return;
      
      // Touch/mouse events for dragging
      carousel.addEventListener('mousedown', this.dragStart);
      carousel.addEventListener('touchstart', this.dragStart, { passive: true });
      document.addEventListener('mousemove', this.drag);
      document.addEventListener('touchmove', this.drag, { passive: false });
      document.addEventListener('mouseup', this.dragEnd);
      document.addEventListener('touchend', this.dragEnd);
    },
    rotateCarousel() {
      const carousel = this.$refs.carousel;
      if (carousel) {
        carousel.style.transform = `rotateY(${this.theta}deg)`;
        this.currentIndex = Math.round(Math.abs(this.theta / (360 / this.totalCards)) % this.totalCards);
        if (this.currentIndex >= this.totalCards) this.currentIndex = 0;
      }
    },
    nextCard() {
      this.theta -= 360 / this.totalCards;
      this.rotateCarousel();
    },
    prevCard() {
      this.theta += 360 / this.totalCards;
      this.rotateCarousel();
    },
    flipCard(e) {
      const card = e.currentTarget;
      const cardIndex = parseInt(card.dataset.index);
      
      if (cardIndex === this.currentIndex) {
        card.classList.toggle('flipped');
      }
    },
    dragStart(e) {
      e.preventDefault();
      this.isDragging = true;
      this.startX = e.pageX || e.touches[0].pageX;
    },
    drag(e) {
      if (!this.isDragging) return;
      e.preventDefault();
      
      const currentX = e.pageX || (e.touches ? e.touches[0].pageX : this.startX);
      const diffX = currentX - this.startX;
      const sensitivity = 0.5;
      const newTheta = this.theta + diffX * sensitivity;
      
      const carousel = this.$refs.carousel;
      if (carousel) {
        carousel.style.transform = `rotateY(${newTheta}deg)`;
      }
    },
    dragEnd(e) {
      if (!this.isDragging) return;
      this.isDragging = false;
      
      const currentX = e.pageX || (e.changedTouches ? e.changedTouches[0].pageX : this.startX);
      const diffX = currentX - this.startX;
      
      if (Math.abs(diffX) > 20) {
        if (diffX > 0) {
          this.prevCard();
        } else {
          this.nextCard();
        }
      } else {
        const anglePerCard = 360 / this.totalCards;
        const snapAngle = Math.round(this.theta / anglePerCard) * anglePerCard;
        this.theta = snapAngle;
        this.rotateCarousel();
      }
    },
    handleKeyDown(e) {
      if (e.key === 'ArrowLeft') {
        this.nextCard();
      } else if (e.key === 'ArrowRight') {
        this.prevCard();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Prevent page scrolling
        const currentCard = this.$refs.cards[this.currentIndex];
        if (currentCard) {
          currentCard.classList.toggle('flipped');
        }
      }
    },
    handleResize() {
      this.radius = window.innerWidth <= 768 ? 280 : 450;
      this.arrangeCards();
      this.rotateCarousel();
    },
    // 嗨嗨嗨，熟悉的font awesome
    getDepartmentIcon(deptName) {
      const iconMap = {
        'APP部': 'fa fa-mobile fa-4x',
        'Web部': 'fa fa-globe fa-4x',
        'IOS部': 'fa fa-apple fa-4x',
        'UI部': 'fa fa-paint-brush fa-4x',
        '游戏部': 'fa fa-gamepad fa-4x',
        '程序部': 'fa fa-code fa-4x'
      };
      return iconMap[deptName] || 'fa fa-cogs fa-4x';
    },
  }
}
</script>

<style scoped>
.departments-view {
  height: 100vh;
  position: relative;
}

.departments-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

/* Typography */
.departments-header {
  text-align: center;
  padding-top: 100px;
  padding-bottom: 40px;
  position: relative;
  z-index: 10;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #9cd9f9, #667eea);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 15px rgba(156, 217, 249, 0.5);
  animation: pulse 3s infinite alternate;
  font-weight: 600;
}

.subtitle {
  font-size: 1.2rem;
  color: #a1a1a6;
  margin-bottom: 0;
}

/* Main Layout */
.carousel-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 700px;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 700px;
  perspective: 1500px;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;
  touch-action: none;
}

.carousel {
  position: relative;
  width: 600px;
  height: 600px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}


.department-card {
  position: absolute;
  width: 280px;
  height: 380px;
  left: 50%;
  top: 50%;
  margin-left: -140px;
  margin-top: -190px;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.department-card .card-inner {
  background-color: #fff;
  border: 1px solid #1d1d1f;
  backdrop-filter: none;
}

.department-card {
  background-color: transparent;
  border: none;
}

.card-inner {
  position: relative;
  border-radius: 15px;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.department-card:hover .card-inner {
  transform: translateZ(20px);
}

.department-card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-front {
  background: rgba(30, 30, 50, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.card-front,
.card-back {
  background: #ffffff;
  border: 1px solid #1d1d1f;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.card-back {
  background: rgba(40, 40, 60, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transform: rotateY(180deg);
  padding: 20px;
}

.card-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;
}

.card-back .card-content {
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
}

.title, .subtitle, .instructions {
  color: #f5f5f7;
}

.department-card h3 {
  font-size: 2rem;
  margin-top: 20px;
  color: #fff;
  font-weight: 600;
  text-shadow: 0 0 15px rgba(156, 217, 249, 0.6);
}

.card-front h3,
.card-back h3,
.card-back p {
  color: #1d1d1f;
}

.card-back h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.8rem;
  color: #9cd9f9;
}

.card-back p {
  font-size: 0.95rem;
  color: #a1a1a6;
  line-height: 1.7;
  flex-grow: 1;
}

.card-back p {
  color: #1d1d1f;
}

.department-icon {
  width: 100%;
  height: auto;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.department-icon i {
  color: #9cd9f9;
  text-shadow: 0 0 12px rgba(156, 217, 249, 0.5), 0 0 24px rgba(156, 217, 249, 0.3);
  transition: transform 0.3s ease;
}

.department-card:hover .department-icon i {
  transform: scale(1.1);
}


/* Footer */
.departments-footer {
  text-align: center;
  padding: 20px;
  position: relative;
  z-index: 10;
}

.instructions {
  font-size: 0.9rem;
  color: #a1a1a6;
  opacity: 0.8;
}

/* Animations */
@keyframes pulse {
  0%, 100% { 
    opacity: 0.8; 
    transform: scale(1);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.02); /* More subtle pulse */
  }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .departments-header {
  text-align: center;
  padding-top: 30px;
  padding-bottom: 20px;
  position: relative;
  z-index: 10;
  }

  .carousel {
    width: 320px;
    height: 320px;
  }

  .carousel-main {
  min-height: 100px;
  padding: 0px;
  }
  
  .department-card {
    width: 240px;
    height: 320px;
    margin-left: -120px;
    margin-top: -160px;
  }

  .title {
    font-size: 2rem;
  }

  .carousel-container {
    height: 400px;
  }

  .card-back {
    padding: 5px;
  }

  .card-content {
    padding: 20px;
  }

  .card-back h3 {
  margin-bottom: 10px;
  font-size: 1.5rem;
  }

  .card-back p {
  font-size: 0.87rem;
  color: #a1a1a6;
  line-height: 1.5;
  flex-grow: 1;
  }

  .department-card h3 {
    font-size: 1.5rem;
  }

  .department-icon {
    height: auto;
  }

  .department-icon i {
    font-size: 3rem !important;
  }
}

@media (max-width: 576px) {
  .carousel {
    width: 280px;
    height: 280px;
  }
  
  .department-card {
    width: 200px;
    height: 280px;
    margin-left: -100px;
    margin-top: -140px;
  }

  .title {
    font-size: 1.8rem;
  }

  .carousel-container {
    height: 350px;
  }

  .card-content {
    padding: 10px 15px;
  }
}
</style> 