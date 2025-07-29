<template>
  <div class="starfield-container" ref="starfieldContainer">
    <canvas ref="starfieldCanvas" class="starfield-canvas"></canvas>
  </div>
</template>

<script>
import { gsap } from 'gsap';

function Circle(pos, rad, color, ctx) {
  this.pos = pos || null;
  this.radius = rad || null;
  this.color = color || null;
  this.ctx = ctx;

  this.draw = function() {
    if (!this.active) return;
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  };
}

export default {
  name: 'StarfieldBackground',
  props: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      width: 0,
      height: 0,
      container: null,
      canvas: null,
      ctx: null,
      points: [],
      target: null,
      animateHeader: true,
      animationFrameId: null,
      scrollIntensity: 1, // 添加滚动强度属性
    };
  },
  methods: {
    initHeader() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      // 初始化目标位置为屏幕中心
      this.target = { x: this.width / 2, y: this.height / 2 };
      
      this.container = this.$refs.starfieldContainer;
      this.canvas = this.$refs.starfieldCanvas;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.ctx = this.canvas.getContext('2d');

      this.points = [];
      for (let x = 0; x < this.width; x = x + this.width / 20) {
        for (let y = 0; y < this.height; y = y + this.height / 20) {
          const px = x + (Math.random() * this.width) / 20;
          const py = y + (Math.random() * this.height) / 20;
          const p = { x: px, originX: px, y: py, originY: py };
          this.points.push(p);
        }
      }

      for (let i = 0; i < this.points.length; i++) {
        const closest = [];
        const p1 = this.points[i];
        for (let j = 0; j < this.points.length; j++) {
          const p2 = this.points[j];
          if (!(p1 === p2)) {
            let placed = false;
            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (closest[k] === undefined) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }

            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (this.getDistance(p1, p2) < this.getDistance(p1, closest[k])) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }
          }
        }
        p1.closest = closest;
      }

      for (const i in this.points) {
        const color = this.isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
        const c = new Circle(this.points[i], 2 + Math.random() * 2, color, this.ctx);
        this.points[i].circle = c;
      }
    },
    addListeners() {
      if (!('ontouchstart' in window)) {
        window.addEventListener('mousemove', this.mouseMove);
      } else {
        // 移动设备触摸事件
        window.addEventListener('touchmove', this.touchMove);
      }
      window.addEventListener('scroll', this.scrollCheck);
      window.addEventListener('resize', this.resize);
      // 添加页面可见性变化监听
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      // 添加窗口焦点变化监听
      window.addEventListener('blur', this.handleWindowBlur);
      window.addEventListener('focus', this.handleWindowFocus);
    },
    mouseMove(e) {
      // 使用 clientX/clientY 相对于视口的位置，避免滚动影响
      this.target.x = e.clientX;
      this.target.y = e.clientY;
    },
    touchMove(e) {
      // 处理触摸事件，使用第一个触摸点
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        this.target.x = touch.clientX;
        this.target.y = touch.clientY;
      }
    },
    scrollCheck() {
      // 获取当前滚动位置
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      
      // 始终启用动画，但可以根据滚动位置调整效果
      this.animateHeader = true;
      
      // 可选：根据滚动位置调整动画强度
      const scrollRatio = Math.min(scrollTop / this.height, 1);
      this.scrollIntensity = 1 - scrollRatio * 0.3; // 滚动时稍微减弱动画强度
    },
    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      // 重新计算目标位置
      this.target.x = this.width / 2;
      this.target.y = this.height / 2;
    },
    handleVisibilityChange() {
      if (document.hidden) {
        this.animateHeader = false;
      } else {
        this.animateHeader = true;
      }
    },
    handleWindowBlur() {
      // 窗口失去焦点时暂停动画
      this.animateHeader = false;
    },
    handleWindowFocus() {
      // 窗口获得焦点时恢复动画
      this.animateHeader = true;
    },
    initAnimation() {
      this.animate();
      for (const i in this.points) {
        this.shiftPoint(this.points[i]);
      }
    },
    animate() {
      if (this.animateHeader) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (const i in this.points) {
          const distance = Math.abs(this.getDistance(this.target, this.points[i]));
          let active, circleActive;
          
          if (distance < 4000) {
            active = 0.3 * this.scrollIntensity;
            circleActive = 0.6 * this.scrollIntensity;
          } else if (distance < 20000) {
            active = 0.1 * this.scrollIntensity;
            circleActive = 0.3 * this.scrollIntensity;
          } else if (distance < 40000) {
            active = 0.02 * this.scrollIntensity;
            circleActive = 0.1 * this.scrollIntensity;
          } else {
            active = 0;
            circleActive = 0;
          }
          
          this.points[i].active = active;
          this.points[i].circle.active = circleActive;
          
          this.drawLines(this.points[i]);
          this.points[i].circle.draw();
        }
      }
      this.animationFrameId = requestAnimationFrame(this.animate);
    },
    shiftPoint(p) {
      gsap.to(p, {
        x: p.originX - 50 + Math.random() * 100,
        y: p.originY - 50 + Math.random() * 100,
        ease: 'circ.inOut',
        duration: 1 + Math.random(),
        onComplete: () => {
          this.shiftPoint(p);
        },
      });
    },
    drawLines(p) {
      if (!p.active) return;
      for (const i in p.closest) {
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.closest[i].x, p.closest[i].y);
        const color = this.isDark ? `rgba(156,217,249,${p.active})` : `rgba(0,0,0,${p.active})`;
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
      }
    },
    getDistance(p1, p2) {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initHeader();
      this.initAnimation();
      this.addListeners();
    });
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.scrollCheck);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('touchmove', this.touchMove);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('focus', this.handleWindowFocus);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    gsap.killTweensOf(this.points);
  },
}
</script>

<style scoped>
.starfield-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: #1d1d1f;
}

.light-theme .starfield-container {
  background-color: #f5f5f7;
}

.starfield-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style> 