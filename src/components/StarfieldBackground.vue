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
    };
  },
  methods: {
    initHeader() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
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
      }
      window.addEventListener('scroll', this.scrollCheck);
      window.addEventListener('resize', this.resize);
    },
    mouseMove(e) {
      let posx = 0,
        posy = 0;
      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      this.target.x = posx;
      this.target.y = posy;
    },
    scrollCheck() {
      if (document.body.scrollTop > this.height) {
        this.animateHeader = false;
      } else {
        this.animateHeader = true;
      }
    },
    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
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
          if (Math.abs(this.getDistance(this.target, this.points[i])) < 4000) {
            this.points[i].active = 0.3;
            this.points[i].circle.active = 0.6;
          } else if (Math.abs(this.getDistance(this.target, this.points[i])) < 20000) {
            this.points[i].active = 0.1;
            this.points[i].circle.active = 0.3;
          } else if (Math.abs(this.getDistance(this.target, this.points[i])) < 40000) {
            this.points[i].active = 0.02;
            this.points[i].circle.active = 0.1;
          } else {
            this.points[i].active = 0;
            this.points[i].circle.active = 0;
          }
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