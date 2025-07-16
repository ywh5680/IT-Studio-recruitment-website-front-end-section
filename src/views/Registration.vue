<template>
  <div class="registration-container">
    <div class="registration-form-wrapper">
      <h1 class="form-title">IT-Studio 报名表</h1>
      <p class="slogan">加入我们，开启在海大的技术之旅吧！</p>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <input type="text" id="name" v-model="form.name" placeholder="姓名：" required>
        </div>
        <div class="form-group">
          <input type="text" id="gradeAndMajor" v-model="form.gradeAndMajor" placeholder="年级专业： (如：24级计算机类)" required>
        </div>
        
        <div class="form-group custom-select-wrapper">
          <div class="custom-select" @click="toggleDropdown">
            <div class="custom-select-trigger">
              <span>{{ form.department ? form.department : '意向部门：' }}</span>
              <div class="arrow"></div>
            </div>
            <div class="custom-options" v-if="isDropdownOpen">
              <div class="custom-option" @click="selectOption('程序部')">程序部</div>
              <div class="custom-option" @click="selectOption('web部')">web部</div>
              <div class="custom-option" @click="selectOption('游戏部')">游戏部</div>
              <div class="custom-option" @click="selectOption('UI部')">UI部</div>
              <div class="custom-option" @click="selectOption('APP部')">APP部</div>
              <div class="custom-option" @click="selectOption('IOS部')">IOS部</div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <input type="text" id="phone" v-model="form.phone" placeholder="电话号码：" required>
        </div>
        <div class="form-group">
          <input type="text" id="qq" v-model="form.qq" placeholder="QQ号：" required>
        </div>
        <div class="form-group">
          <input type="text" id="email" v-model="form.email" placeholder="邮箱：" required>
        </div>
        <div class="form-group">
          <input type="text" id="emailVerificationCode" v-model="form.emailVerificationCode" placeholder="邮箱验证码：" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn">提交</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { theme } from '../theme.js';

export default {
  name: 'Registration',
  data() {
    return {
      isDropdownOpen: false,
      form: {
        name: '',
        gradeAndMajor: '',
        department: '',
        phone: '',
        qq: '',
        email: '',
        emailVerificationCode: '',
      }
    };
  },
  setup() {
    return {
      theme
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    selectOption(option) {
      this.form.department = option;
      this.isDropdownOpen = false;
    },
    submitForm() {
      if (!this.form.department) {
        alert('请选择意向部门');
        return;
      }
      // 提交逻辑将在这里处理
      console.log(this.form);
    }
  }
};
</script>

<style scoped>
.registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
}

.registration-form-wrapper {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem 3rem;
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-color);
  transition: color 0.3s, background-color 0.3s;
}

.form-title {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #fff;
}

.slogan {
  text-align: center;
  font-size: 1rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group input[type="text"],
.custom-select-wrapper .custom-select {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50px;
  padding: 1rem 1.5rem;
  color: #333;
  font-size: 1rem;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  position: relative;
}

.custom-select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow {
  border: solid #333;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}

:global(body.dark-theme) .arrow {
  border-color: #eee;
}

.custom-options {
  position: absolute;
  top: 110%;
  left: 0;
  right: 0;
  border-radius: 20px;
  overflow: hidden;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:global(body.dark-theme) .custom-options {
    background-color: rgba(50, 50, 50, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-option {
  padding: 1rem 1.5rem;
  transition: background-color 0.2s;
  color: #333;
}
:global(body.dark-theme) .custom-option {
    color: #eee;
}


.custom-option:hover {
  background-color: rgba(0, 113, 227, 0.5);
  color: #fff;
}
:global(body.dark-theme) .custom-option:hover {
    color: #fff;
}


.form-group input[type="text"]::placeholder {
    color: #555;
}

.form-group input[type="text"]:focus,
.custom-select-wrapper .custom-select:focus-within {
  outline: none;
  box-shadow: 0 0 15px rgba(0, 113, 227, 0.5);
}

.form-group select option[disabled] {
    color: #555;
}

.form-group select option {
    color: #333;
}

.form-actions {
  margin-top: 2.5rem;
  text-align: center;
}

.submit-btn {
  background-color: #0071e3;
  color: white;
  border: none;
  padding: 0.8rem 2.5rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  text-transform: uppercase;
}

.submit-btn:hover {
  background-color: #0077f5;
  box-shadow: 0 0 15px #0071e3;
}


:global(body.light-theme) .registration-form-wrapper {
  background-color: rgba(240, 240, 240, 0.9);
  color: #333;
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.08); /* 按道理这里应该有阴影，但是没有，不知道为什么 */
}



:global(body.light-theme) .form-group input[type="text"],
:global(body.light-theme) .custom-select {
    background-color: #fff;
    color: #333;
    border: 1px solid #ddd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:global(body.light-theme) .custom-options {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); 
}

:global(body.dark-theme) .registration-form-wrapper {
    background-color: rgba(30, 30, 30, 0.7);
    color: #eee;
}

:global(body.dark-theme) .form-group input[type="text"],
:global(body.dark-theme) .custom-select {
    background-color: rgba(50, 50, 50, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #eee;
}
:global(body.dark-theme) .form-title {
    color: #eee;
}

:global(body.dark-theme) .slogan {
    color: rgba(238, 238, 238, 0.7);
}

:global(body.dark-theme) .form-group input[type="text"]::placeholder {
    color: #aaa;
}
:global(body.dark-theme) .custom-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23eee' class='bi bi-chevron-down' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
}
:global(body.dark-theme) .form-group select option[disabled] {
    color: #aaa;
}

:global(body.dark-theme) .form-group select option {
    background-color: #333;
    color: #eee;
}

:global(body.light-theme) .registration-form-wrapper .form-title {
  color: #333 !important;
}

:global(body.light-theme) .registration-form-wrapper .slogan {
  color: rgba(51, 51, 51, 0.7) !important;
}

</style> 