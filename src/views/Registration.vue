<template>
  <div class="registration-container">
    <div class="registration-form-wrapper">
      <h1 class="form-title">IT-Studio 报名表</h1>
      <p class="slogan">加入我们，开启在海大的技术之旅吧！</p>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <input type="text" id="name" v-model="form.name" placeholder="姓名：" required maxlength="20">
        </div>
        <div class="form-group">
          <input type="text" id="uid" v-model="form.uid" placeholder="学号： " required pattern="[0-9]+" title="请输入正确的学号">
        </div>
        <div class="form-group">
          <input type="text" id="gradeAndMajor" v-model="form.major" placeholder="年级专业： (如：24级计算机类)" required maxlength="20">
        </div>
        <div class="form-group">
          <input type="text" id="phone" v-model="form.phone" placeholder="电话号码：" required pattern="[0-9]+" title="请输入正确的电话号码">
        </div>
        <div class="form-group">
          <input type="text" id="email" v-model="form.email" placeholder="邮箱：" required maxlength="36" pattern="[^\s@]+@[^\s@]+\.[^\s@]+" title="请输入正确的邮箱地址">
        </div>
        <div class="form-group custom-select-wrapper">
          <div class="custom-select" @click="toggleDropdown">
            <div class="custom-select-trigger">
              <span>{{ getDepartmentLabel(form.department) || '意向部门：' }}</span>
              <div class="arrow"></div>
            </div>
            <div class="custom-options" v-if="isDropdownOpen">
              <div class="custom-option" v-for="(dept, index) in departments" :key="index" @click="selectOption(dept.value, $event)">
                {{ dept.label }}
              </div>
            </div>
          </div>
        </div>
        <div class="form-group">
          <input type="text" id="emailVerificationCode" v-model="form.code" placeholder="邮箱验证码：" class="Codebox" required pattern="[0-9]+" title="请输入正确的验证码">
          <button type="button" class="getCode" @click="getCode" :disabled="isCodeButtonDisabled">
            {{ codeButtonText }}
          </button>
        </div>
        <div class="form-group">
          <input type="text" id="content" v-model="form.content" placeholder="加入理由(选填)" maxlength="200">
        </div>
        <div class="form-group">
          <input type="text" id="qq" v-model="form.qq" placeholder="QQ号(选填)：" pattern="[0-9]*" title="请输入正确的QQ号">
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
import api from '../services/api.js';

export default {
  name: 'Registration',
  data() {
    return {
      isDropdownOpen: false,
      isCodeButtonDisabled: false,
      codeButtonText: '获取验证码',
      countdown: 60,
      departments: [
        { label: '程序开发', value: 0 },
        { label: 'Web开发', value: 1 },
        { label: '游戏开发', value: 2 },
        { label: 'APP开发', value: 3 },
        { label: 'UI设计', value: 4 },
        { label: 'ios', value: 5 }
      ],
      form: {
        name: '',
        uid: '',
        major: '',
        phone: '',
        email: '',
        department: '',
        code: '',
        content: '',
        qq: '',
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
    selectOption(value, e) {
      e.stopPropagation();
      this.form.department = value;
      this.isDropdownOpen = false;
    },
    getDepartmentLabel(value) {
      const dept = this.departments.find(d => d.value === value);
      return dept ? dept.label : '';
    },
    validateForm() {
      // 验证姓名
      if (!this.form.name || this.form.name.length > 20) {
        alert('姓名不能为空且长度不能超过20个字符');
        return false;
      }

      // 验证学号
      if (!this.form.uid || !/^\d+$/.test(this.form.uid)) {
        alert('请输入正确的学号（必须为正整数）');
        return false;
      }

      // 验证年级专业
      if (!this.form.major || this.form.major.length > 20) {
        alert('年级专业不能为空且长度不能超过20个字符');
        return false;
      }

      // 验证手机号
      if (!this.form.phone || !/^\d+$/.test(this.form.phone)) {
        alert('请输入正确的手机号码（必须为数字）');
        return false;
      }

      // 验证邮箱
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form.email || !emailRegex.test(this.form.email) || this.form.email.length > 36) {
        alert('请输入正确的邮箱地址（长度不超过36个字符）');
        return false;
      }

      // 验证意向部门
      if (this.form.department === '') {
        alert('请选择意向部门');
        return false;
      }

      // 验证验证码
      if (!this.form.code || !/^\d+$/.test(this.form.code)) {
        alert('请输入正确的验证码');
        return false;
      }

      // 验证加入理由（选填）
      if (this.form.content && this.form.content.length > 200) {
        alert('加入理由不能超过200个字符');
        return false;
      }

      // 验证QQ号（选填）
      if (this.form.qq && !/^\d+$/.test(this.form.qq)) {
        alert('请输入正确的QQ号（必须为数字）');
        return false;
      }

      return true;
    },
    startCodeCountdown() {
      this.isCodeButtonDisabled = true;
      this.countdown = 60;
      const timer = setInterval(() => {
        this.countdown--;
        this.codeButtonText = `${this.countdown}秒后重试`;
        if (this.countdown <= 0) {
          clearInterval(timer);
          this.isCodeButtonDisabled = false;
          this.codeButtonText = '获取验证码';
        }
      }, 1000);
    },
    async getCode() {
      // 检测邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.form.email)) {
        alert("请输入正确的邮箱！");
        return;
      }

      try {
      // 发送验证码请求
        await api.post('/send_code/', { email: this.form.email });
        this.startCodeCountdown();
      } catch (error) {
        console.error('验证码发送失败', error);
          alert('发送失败，请检查网络后重试！');
      }
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      try {
       
        const formData = {
          name: this.form.name.trim(),
          uid: parseInt(this.form.uid, 10),
          major: this.form.major.trim(),
          phone: parseInt(this.form.phone, 10),
          email: this.form.email.trim(),
          department: parseInt(this.form.department, 10),
          code: parseInt(this.form.code, 10),
          content: this.form.content ? this.form.content.trim() : undefined,
          qq: this.form.qq ? parseInt(this.form.qq, 10) : undefined
        };

        Object.keys(formData).forEach(key => {
          if (formData[key] === undefined) {
            delete formData[key];
          }
        });

        const response = await api.post('/enroll/', formData);
        console.log('表单提交成功', response);
        alert('报名成功！');
        // 清空表单
        this.form = {
          name: '',
          uid: '',
          major: '',
          phone: '',
          email: '',
          department: '',
          code: '',
          content: '',
          qq: '',
        };
      } catch (error) {
          console.error('表单提交失败: ', error);
        
        // 处理特定的错误响应
        if (error.response) {
          switch (error.response.status) {
            case 400:
              alert('验证码错误，请重新输入');
              break;
            case 404:
              alert('请先获取验证码');
              break;
            case 409:
              alert('已报名，请前往查询');
              break;
            case 410:
              alert('验证码已过期，请重新获取');
              break;
            case 422:
              alert('请检查填写的信息是否正确');
              break;
            default:
              alert('提交失败，请稍后重试');
          }
        } else {
          alert('网络错误，请检查网络连接');
        }
      }
    }
  }
};
</script>

<style scoped>
.registration-container {
  margin: 7vh auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
}

.registration-form-wrapper {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1rem 2rem;
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

.form-group #emailVerificationCode.Codebox  {
  width: 55%;
}

.form-actions {
  margin-top: 2.5rem;
  text-align: center;
}

.submit-btn,
.getCode {
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

.getCode {
  margin-left: 5%;
  width: 40%;
  font-size: 1rem;
}

.submit-btn:hover,
.getCode:hover{
  background-color: #0077f5;
  box-shadow: 0 0 15px #0071e3;
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
/* 纵使我这样写，但是还是无法改变颜色，奇怪，感觉可以考虑移除相关模式，有点麻烦 */
:global(body.light-theme) .registration-form-wrapper .form-title {
  color: #333 !important;
}

:global(body.light-theme) .registration-form-wrapper .slogan {
  color: rgba(51, 51, 51, 0.7) !important;
}

</style> 