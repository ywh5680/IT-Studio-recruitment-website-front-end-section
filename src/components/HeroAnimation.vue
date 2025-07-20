<template>
  <div class="hero-container">
    <div id="container" ref="container"></div>
    <div id="coverBlack"></div>
    <div class="hero-content">
      <!-- 只保留动画和其他内容 -->
    </div>
    <div class="actions-fixed">
      <div class="actions">
        <router-link to="/registration" class="button button-more">进入报名处</router-link>
        <a href="#" class="button button-join">加入招新群</a>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import gsap from 'gsap';

export default {
  name: 'HeroAnimation',
  data() {
    return {
      world: null,
    };
  },
  mounted() {
    this.initAnimation();
  },
  beforeUnmount() {
    if (this.world) {
      window.removeEventListener('resize', this.world.handleResize, false);
      // Potentially more cleanup needed, like stopping the animation loop
      if (this.world.renderer) {
        this.world.renderer.dispose();
      }
      if (this.world.scene) {
        // Dispose geometries, materials, textures
      }
    }
  },
  methods: {
    initAnimation() {
      const containerElement = this.$refs.container;

      // 动态适配canvas尺寸和字体
      let CANVAS_W = 200;
      let CANVAS_H = 50;
      let FONT_SIZE = 30;
      if (window.innerWidth <= 480) {
        CANVAS_W = 120;
        CANVAS_H = 30;
        FONT_SIZE = 18;
      } else if (window.innerWidth <= 768) {
        CANVAS_W = 150;
        CANVAS_H = 40;
        FONT_SIZE = 22;
      }

      class BasicView {
        constructor() {
          this.containerElement = containerElement;
          this.scene = new THREE.Scene();

          this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 200000);
          this.camera.position.z = 5000;

          this.renderer = new THREE.WebGLRenderer({
            antialias: window.devicePixelRatio === 1.0,
            alpha: true,
          });
          this.renderer.setClearColor(0x000000, 0); // Transparent background
          this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          this.containerElement.appendChild(this.renderer.domElement);

          this.handleResize = this.handleResize.bind(this);
          window.addEventListener('resize', this.handleResize, false);
        }

        handleResize() {
          this.camera.aspect = window.innerWidth / window.innerHeight;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

        startRendering() {
          this.update();
        }

        update() {
          this.animationFrameId = requestAnimationFrame(() => this.update());
          this.onTick();
          this.render();
        }

        render() {
          this.renderer.render(this.scene, this.camera);
        }

        onTick() {}
      }

      const FONT_NAME = "Source Code Pro";
      const FONT_AWESOME_ICONS = ["\uf001", "\uf002", "\uf003", "\uf004", "\uf005", "\uf006", "\uf007", "\uf008", "\uf009", "\uf00a", "\uf00b", "\uf00c", "\uf00d", "\uf00e", "\uf00f", "\uf010"];

      class ParticleTextWorld extends BasicView {
        constructor() {
          super();
          this.CANVAS_W = CANVAS_W;
          this.CANVAS_H = CANVAS_H;
          this.FONT_SIZE = FONT_SIZE;
          this.WORD_LIST = ["IT-Studio"];
          this.matrixLength = 4;
          this.particleList = [];
          this.hue = 0.6; // Blue hue
          this.HELPER_ZERO = new THREE.Vector3(0, 0, 0);

          this.setup();
          this.createLogo();
          this.startRendering();
        }

        setup() {
          this.camera.far = 100000;
          this.camera.near = 1;
          this.camera.position.z = 5000;
          this.camera.lookAt(this.HELPER_ZERO);

          const plane = new THREE.PlaneGeometry(50000, 50000);
          const canvas = document.createElement("canvas");
          canvas.width = 512;
          canvas.height = 512;
          const ctx = canvas.getContext("2d");
          const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
          gradient.addColorStop(0, "#1a1a2e");
          gradient.addColorStop(0.5, "#16213e");
          gradient.addColorStop(1, "#0f0f23");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 512, 512);
          const bgTexture = new THREE.CanvasTexture(canvas);
          const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
          this.bg = new THREE.Mesh(plane, bgMaterial);
          this.bg.position.z = -10000;
          this.scene.add(this.bg);

          const light = new THREE.DirectionalLight(0xffffff, 1);
          light.position.set(0, 1, 1).normalize();
          this.scene.add(light);

          this.wrap = new THREE.Object3D();
          this.scene.add(this.wrap);

          const SIZE = 256;
          const atlasCanvas = document.createElement("canvas");
          const atlasSize = SIZE * this.matrixLength;
          atlasCanvas.width = atlasSize;
          atlasCanvas.height = atlasSize;
          const atlasCtx = atlasCanvas.getContext("2d");
          atlasCtx.font = "200px FontAwesome";
          atlasCtx.fillStyle = "#FFFFFF";
          atlasCtx.textAlign = "center";
          atlasCtx.textBaseline = "middle";

          for (let i = 0; i < this.matrixLength * this.matrixLength; i++) {
            const iconIndex = i % FONT_AWESOME_ICONS.length;
            const char = FONT_AWESOME_ICONS[iconIndex];
            const x = (i % this.matrixLength) * SIZE + SIZE / 2;
            const y = Math.floor(i / this.matrixLength) * SIZE + SIZE / 2;
            atlasCtx.fillText(char, x, y);
          }

          const texture = new THREE.CanvasTexture(atlasCanvas);
          texture.needsUpdate = true;
          const ux = 1 / this.matrixLength;
          const uy = 1 / this.matrixLength;
          this.particleList = [];

          for (let i = 0; i < this.CANVAS_W; i++) {
            for (let j = 0; j < this.CANVAS_H; j++) {
              const ox = Math.floor(this.matrixLength * Math.random());
              const oy = Math.floor(this.matrixLength * Math.random());
              const geometry = new THREE.PlaneGeometry(40, 40);
              this.changeUVs(geometry, ux, uy, ox, oy);
              const material = new THREE.MeshLambertMaterial({
                color: 0xffffff,
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
              });
              const particle = new THREE.Mesh(geometry, material);
              this.wrap.add(particle);
              this.particleList.push(particle);
            }
          }
          this.createParticleCloud();
        }

        createParticleCloud() {
          const geometry = new THREE.BufferGeometry();
          const numParticles = 10000;
          const SIZE = 10000;
          const positions = new Float32Array(numParticles * 3);
          for (let i = 0; i < numParticles; i++) {
            positions[i * 3] = SIZE * (Math.random() - 0.5);
            positions[i * 3 + 1] = SIZE * (Math.random() - 0.5);
            positions[i * 3 + 2] = SIZE * (Math.random() - 0.5);
          }
          geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
          const particleCanvas = document.createElement("canvas");
          particleCanvas.width = 64;
          particleCanvas.height = 64;
          const particleCtx = particleCanvas.getContext("2d");
          const gradient = particleCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
          gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
          gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          particleCtx.fillStyle = gradient;
          particleCtx.fillRect(0, 0, 64, 64);
          const particleTexture = new THREE.CanvasTexture(particleCanvas);
          const material = new THREE.PointsMaterial({
            size: 30,
            color: 0x444444,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false,
            map: particleTexture,
          });
          const mesh = new THREE.Points(geometry, material);
          mesh.position.set(0, 0, 0);
          this.scene.add(mesh);
        }

        createLogo() {
          const canvas = document.createElement("canvas");
          canvas.width = this.CANVAS_W;
          canvas.height = this.CANVAS_H;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#FFFFFF";
          ctx.font = `${this.FONT_SIZE}px ${FONT_NAME}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(this.WORD_LIST[0], this.CANVAS_W / 2, this.CANVAS_H / 2);
          
          const timeline = gsap.timeline({
            onComplete: () => {
              gsap.to("#coverBlack", {
                duration: 1.0,
                opacity: 1.0,
                delay: 5.0,
                onComplete: () => {
                  setTimeout(() => {
                    this.createLogo();
                  }, 2000);
                },
              });
            },
          });

          for (let i = 0; i < this.particleList.length; i++) {
            this.particleList[i].visible = false;
          }

          const pixelColors = ctx.getImageData(0, 0, this.CANVAS_W, this.CANVAS_H).data;
          const existDotList = [];
          for (let i = 0; i < this.CANVAS_W; i++) {
            existDotList[i] = [];
            for (let j = 0; j < this.CANVAS_H; j++) {
              const flag = pixelColors[(i + j * this.CANVAS_W) * 4 + 3] === 0;
              existDotList[i][j] = flag;
            }
          }

          let cnt = 0;
          const max = this.CANVAS_W * this.CANVAS_H;
          for (let i = 0; i < this.CANVAS_W; i++) {
            for (let j = 0; j < this.CANVAS_H; j++) {
              if (existDotList[i][j] === true) continue;
              const particle = this.particleList[cnt];
              particle.material.color.setHSL(this.hue + ((i * canvas.height) / max - 0.5) * 0.1, 1.0, 0.7);
              this.wrap.add(particle);
              const targetPos = {
                x: (i - canvas.width / 2) * 30,
                y: (canvas.height / 2 - j) * 30,
                z: 0,
              };
              const startPos = {
                x: 2000 * (Math.random() - 0.5) - 500,
                y: 1000 * (Math.random() - 0.5),
                z: 10000,
              };
              particle.position.set(startPos.x, startPos.y, startPos.z);
              particle.rotation.z = 10 * Math.PI * (Math.random() - 0.5);
              particle.visible = false;
              const delay = (cnt / 1600) * 4.0 + 2.0 * Math.random();
              timeline.to(particle.rotation, { duration: 8.0, z: 0, ease: "power2.inOut" }, delay);
              timeline.set(particle, { visible: true }, delay);
              timeline.to(particle.position, { duration: 10.0, x: targetPos.x, y: targetPos.y, z: targetPos.z, ease: "expo.inOut" }, delay);
              cnt++;
            }
          }

          this.wrap.position.z = -5000;
          timeline.to(this.wrap.position, { duration: 18.0, z: 6000, ease: "power4.in" }, 0);
          timeline.set(this.camera.position, { x: 200, y: -200, z: 1000 }, 0);
          timeline.to(this.camera.position, { duration: 20.0, x: 0, y: 0, z: 5000, ease: "power2.inOut" }, 0);
          timeline.to("#coverBlack", { duration: 1.0, opacity: 0.0 }, 0);
          timeline.timeScale(1.0);
          this.bg.material.color.setHSL(this.hue, 0.5, 0.1);
        }

        onTick() {
          super.onTick();
          this.camera.lookAt(this.HELPER_ZERO);
          const vec = this.camera.position.clone();
          vec.negate().normalize().multiplyScalar(10000);
          this.bg.position.copy(vec);
          this.bg.lookAt(this.camera.position);
        }

        changeUVs(geometry, unitX, unitY, offsetX, offsetY) {
          const uvAttribute = geometry.attributes.uv;
          if (uvAttribute) {
            const uvArray = uvAttribute.array;
            for (let i = 0; i < uvArray.length; i += 2) {
              uvArray[i] = (uvArray[i] + offsetX) * unitX;
              uvArray[i + 1] = (uvArray[i + 1] + offsetY) * unitY;
            }
            uvAttribute.needsUpdate = true;
          }
        }
      }

      class ParticleTextDemo {
        constructor() {
          this.waitForFonts().then(() => {
            this.world = new ParticleTextWorld();
          });
        }
        async waitForFonts() {
            try {
                // Check if the font is already loaded
                if (document.fonts && document.fonts.ready) {
                    await document.fonts.ready;
                }

                // Extra check for Font Awesome
                const testElement = document.createElement("span");
                testElement.style.fontFamily = "FontAwesome";
                testElement.style.fontSize = "16px";
                testElement.innerHTML = "\uf001";
                testElement.style.position = "absolute";
                testElement.style.left = "-9999px";
                document.body.appendChild(testElement);

                // Wait a short period for the font to be applied
                await new Promise((resolve) => setTimeout(resolve, 100));

                document.body.removeChild(testElement);
            } catch (error) {
                console.warn("Font loading check failed, proceeding anyway:", error);
            }
        }
      }

      new ParticleTextDemo();
    },
  },
};
</script>

<style scoped>
.hero-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #000;
}

#container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#coverBlack {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 100;
  pointer-events: none;
}

.hero-content {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 101;
  text-align: center;
}

.actions-fixed {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  z-index: 102;
  display: flex;
  justify-content: center;
  pointer-events: none;
  padding-bottom: env(safe-area-inset-bottom, 16px);
  background: linear-gradient(to top, rgba(20,20,30,0.85) 60%, rgba(20,20,30,0));
}

.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 0 auto 20px auto;
  pointer-events: auto;
}

.button {
    font-size: 18px;
    padding: 12px 28px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;
    background-color: transparent;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.button-more {
    border: 2px solid #0071e3;
    color: #0071e3;
}

.button-more:hover {
    background-color: #0071e3;
    color: #fff;
    box-shadow: 0 0 25px #0071e3;
}

.button-join {
    border: 2px solid #fff;
    color: #fff;
}

.button-join:hover {
    background-color: #fff;
    color: #000;
    box-shadow: 0 0 25px #fff;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .hero-container {
    height: 80vh;
    min-height: 500px;
  }
  #container {
    height: 60vh;
    min-height: 320px;
  }
  .hero-content {
    bottom: 6%;
    width: 100vw;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 10px;
  }
  .actions {
    flex-direction: column;
    gap: 12px;
    align-items: center;
    margin: 0 auto 12px auto;
  }
  .actions-fixed {
    width: 100vw;
    left: 0;
    bottom: 0;
  }
  .button {
    width: 100%;
    max-width: 320px;
    font-size: 15px;
    padding: 10px 10px;
    border-radius: 30px;
    letter-spacing: 0.5px;
  }
}

@media (max-width: 480px) {
  .hero-container {
    height: 70vh;
    min-height: 350px;
  }
  #container {
    height: 45vh;
    min-height: 180px;
  }
  .button {
    font-size: 14px;
    max-width: 95vw;
    padding: 9px 0;
  }
}
</style> 