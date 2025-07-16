import { reactive } from 'vue';

export const theme = reactive({
  isDark: true,
  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  }
}); 