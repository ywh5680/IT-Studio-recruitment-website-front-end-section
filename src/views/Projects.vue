<template>
  <div class="project-view-container">
    <StarfieldBackground :is-dark="theme.isDark" />
    <div class="head">项目成果</div>
    <div class="main-content">
      <div class="container" v-for="year in projectYears" :key="year">
        <div class="year">{{ year }}</div>
        <div class="pro-container">
          <div 
            v-for="(item, index) in projects[year]" 
            :key="index" 
            class="projects"
            @click="openModal(item)"
          >
            <img v-if="item.image" :src="item.image" :alt="item.name" class="project-image" />
            <div class="text-content">
              <div class="title">{{ item.name }}</div>
              <div class="description">{{ item.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目详情模态框 -->
    <transition name="modal">
    <div 
      v-if="selectedProject" 
      class="project-modal" 
      @click.self="closeModal"
    >
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">&times;</button>
        <div class="modal-body">
          <div class="modal-image-container">
            <img 
              :src="selectedProject.image" 
              :alt="selectedProject.name" 
              class="modal-image" 
              @error="handleImageError"
            />
          </div>
          <div class="modal-text">
            <h2>{{ selectedProject.name }}</h2>
            <div class="modal-description">{{ selectedProject.description }}</div>
            <div v-if="selectedProject.details" class="modal-details">
              <h3>项目详情</h3>
              <p>{{ selectedProject.details }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
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
      selectedProject: null,
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
  methods: {
    openModal(project) {
      this.selectedProject = project;
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    },
    closeModal() {
      this.selectedProject = null;
      document.body.style.overflow = ''; // 恢复背景滚动
    },
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
        } else if (e.key === 'Escape' && this.selectedProject) {
          this.closeModal();
        }
    },
    handleImageError(e) {
    e.target.style.opacity = '0.3';
    e.target.src = ''; // 移除错误的src
  },
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
    document.body.style.overflow = ''; // 确保组件卸载时恢复滚动
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
  position: relative;
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
  height: 200px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.projects:nth-child(1) { animation-delay: 0.1s; }
.projects:nth-child(2) { animation-delay: 0.2s; }
.projects:nth-child(3) { animation-delay: 0.3s; }
.projects:nth-child(4) { animation-delay: 0.4s; }
.projects:nth-child(5) { animation-delay: 0.5s; }

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
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 20px -5px rgba(0, 0, 0, 0.2);
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
  transition: all 0.5s ease;
  z-index: 1;
}

.text-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; 
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.projects:hover .project-image {
  transform: scale(1.05);
  transition: all 0.5s cubic-bezier(0.25, 0.45, 0.45, 0.95);
}

.projects:hover .text-content {
  transform: translateY(-20%); 
}

.projects:hover .description {
  max-height: 100px; 
  opacity: 1;
  margin-top: 0.5rem;
}

.project-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  backdrop-filter: blur(5px);
}

.modal-content {
  overflow: hidden;
  background: rgba(17, 24, 39, 0.95);
  border-radius: 0.75rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #a78bfa;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.2s ease;
  width: 40px; /* 固定宽度 */
  height: 40px; /* 固定高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(17, 24, 39, 0.7); /* 添加背景避免透明 */
}

.close-btn:hover {
  transform: rotate(90deg) scale(1.2);
  color: #22d3ee;
  background: rgba(99, 102, 241, 0.2); /* 悬停背景色 */
}

.modal-body {
  display: flex;
  flex-direction: row;
  padding: 2rem;
}

.modal-image-container {
  flex: 1;
  min-width: 300px;
  padding-right: 2rem;
}

.modal-image {
  width: 100%;
  height: auto;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 0.5rem;
}

.modal-text {
  flex: 1;
  color: #e5e7eb;
  overflow-y: auto;
}

.modal-text h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #a78bfa, #22d3ee);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.modal-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.modal-details {
  margin-top: 2rem;
}

.modal-details h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #a78bfa;
}

.modal-details p {
  font-size: 1rem;
  line-height: 1.6;
}

/* 动画 */
.modal-enter-active {
  animation: fadeIn 0.3s ease;
}

.modal-leave-active {
  animation: fadeIn 0.3s ease reverse;
}

.modal-enter-active .modal-content {
  animation: zoomIn 0.3s ease;
}

.modal-leave-active .modal-content {
  animation: zoomOut 0.3s ease;
}

/* 动画关键帧 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* 响应式设计 */
@media (min-width: 768px) {
  .project-view-container {
    min-height: calc(100vh - 100px); 
  }
  
  .main-content {
    min-height: 600px; 
  }
}

@media (max-width: 767px) {
  .main-content,
  .container {
    width: 87%; 
  }
  
  .pro-container {
    grid-template-columns: 1fr;
  }

  .project-view-container {
    padding-top: 0;
  }

  /* 移动端模态框样式 */
  .modal-body {
    flex-direction: column;
    padding: 1.5rem;
  }

  .modal-image-container {
    padding-right: 0;
    padding-bottom: 1.5rem;
    min-width: auto;
  }

  .modal-text h2 {
    font-size: 1.5rem;
  }

  .modal-description {
    font-size: 1rem;
  }

  .close-btn {
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .modal-content {
    max-height: 95vh;
  }

  .modal-body {
    padding: 1rem;
  }

  .modal-text h2 {
    font-size: 1.3rem;
  }
}
</style>