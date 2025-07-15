<template>
  <div>
    <StarfieldBackground />
    <section id="application-status" class="application-status scroll">
      <h3>查询报名进度</h3>
      <div class="status-checker">
        <input type="text" placeholder="请输入你的信息进行查询" disabled>
        <button disabled>查询</button>
      </div>
    </section>
  </div>
</template>
<!--我还是没写具体功能的js-->
<script>
import StarfieldBackground from '@/components/StarfieldBackground.vue';

export default {
  name: 'StatusView',
  components: {
    StarfieldBackground,
  },
  mounted() {
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
  }
}
</script>

<style scoped>
.application-status {
  padding: 150px 20px 80px;
  text-align: center;
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.application-status h3 {
  font-size: 2.5rem;
  margin-bottom: 40px;
  font-weight: 600;
  color: #f5f5f7;
}

.status-checker {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  gap: 10px;
}

.status-checker input {
  padding: 15px 20px;
  border: 2px solid #333;
  border-radius: 8px;
  margin-right: 15px;
  font-size: 1rem;
  width: 300px;
  background: rgba(255, 255, 255, 0.1);
  color: #f5f5f7;
  border-color: rgba(156, 217, 249, 0.3);
}

.status-checker input::placeholder {
  color: #a1a1a6;
}

.status-checker button {
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.status-checker button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.status-checker button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 