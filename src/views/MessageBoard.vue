<template>
  <div>
    <StarfieldBackground />
    <section id="message-board" class="message-board scroll">
      <h3>留言板</h3>
      <div class="message-container">
        <div class="message-list">
          <div class="message-item">
            <p class="message-content">Ciallo</p>
            <div class="message-meta">
              <span class="author">- 啊</span>
              <span class="timestamp">2023-10-27 10:00</span>
            </div>
          </div>
          <div class="message-item">
            <p class="message-content">CialloCiallo</p>
            <div class="message-meta">
              <span class="author">- 柚子厨</span>
              <span class="timestamp">2023-10-27 11:30</span>
            </div>
          </div>
        </div>
        <form class="message-form">
          <h4>留下你的足迹</h4>
          <input type="text" placeholder="你的昵称" disabled>
          <textarea placeholder="说点什么吧..." disabled></textarea>
          <button type="submit" disabled>发布留言</button>
        </form>
      </div>
    </section>
  </div>
</template>
<!--我没写具体功能的js-->
<script>
import StarfieldBackground from '@/components/StarfieldBackground.vue';

export default {
  name: 'MessageBoardView',
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
.message-board {
  padding: 150px 20px 80px;
  position: relative;
  z-index: 1;
}

.message-board h3 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 40px;
  font-weight: 600;
  color: #f5f5f7;
}

.message-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-item {
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(156, 217, 249, 0.2);
  transition: all 0.3s ease;
}

.message-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(156, 217, 249, 0.2);
}

.message-content {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 10px;
  color: #f5f5f7;
}

.message-meta {
  text-align: right;
  font-size: 0.9rem;
  color: #999;
}

.message-meta .author {
  font-weight: 600;
  color: #9cd9f9;
}

.message-meta .timestamp {
  color: #a1a1a6;
}

.message-form {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(156, 217, 249, 0.2);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-form h4 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #f5f5f7;
  font-weight: 600;
}

.message-form input,
.message-form textarea {
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  border: 2px solid rgba(156, 217, 249, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #f5f5f7;
  transition: border-color 0.3s ease;
}

.message-form input::placeholder,
.message-form textarea::placeholder {
  color: #a1a1a6;
}

.message-form input:focus,
.message-form textarea:focus {
  outline: none;
  border-color: #9cd9f9;
}

.message-form textarea {
  height: 120px;
  resize: vertical;
}

.message-form button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.message-form button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.message-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 