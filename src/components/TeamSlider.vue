<template>
  <div class="team-slider-container">
    <!-- Year Selector -->
    <div class="year-selector">
       <v-chip-group
            v-model="selectedYear"
            active-class="primary--text"
            mandatory
        >
            <v-chip
                v-for="yearData in teamStructure"
                :key="yearData.year"
                :value="yearData.year"
            >
                {{ yearData.year }}届
            </v-chip>
        </v-chip-group>
    </div>

    <!-- Department Selector -->
    <div class="department-selector">
        <v-chip-group
            v-model="selectedDepartment"
            active-class="primary--text"
            mandatory
        >
            <v-chip
                v-for="department in departments"
                :key="department"
                :value="department"
            >
                {{ department }}
            </v-chip>
        </v-chip-group>
    </div>


    <!-- Slider -->
    <div v-if="members.length > 0" class="slider--teams" :class="{ visible: loaded }">
      <div class="slider--teams__team">
        <ul id="list" class="cf" :style="listStyle">
          <li
            v-for="(member, index) in members"
            :key="member.name + index"
            @click="handleMemberClick(index)"
            :style="itemStyle"
          >
            <figure :class="{ active: current === index }">
              <div>
                <div :style="getAvatarStyle(member.avatar)"></div>
              </div>
              <figcaption>
                <h2>{{ member.name }}</h2>
                <p>"{{ member.quote }}"</p>
              </figcaption>
            </figure>
          </li>
        </ul>
      </div>
    </div>
     <div v-else class="no-members-message">
      该分类下暂无成员
    </div>
  </div>
</template>

<script>
import { teamStructureData, departmentsData } from '../data.js';
import { gsap } from 'gsap';

export default {
  name: 'TeamSlider',
  data() {
    return {
      teamStructure: teamStructureData,
      selectedYear: teamStructureData[0]?.year || null,
      departments: ['全部', ...departmentsData.map(d => d.name)],
      selectedDepartment: '全部',
      current: 0,
      autoSlider: null,
      nView: 3, // Number of items in view
      loaded: false,
    };
  },
  computed: {
    members() {
      const yearData = this.teamStructure.find(y => y.year === this.selectedYear);
      if (!yearData) return [];
      
      const allMembers = yearData.departments.flatMap(d => d.members.map(m => ({ ...m, department: d.name })));

      if (this.selectedDepartment === '全部') {
        return allMembers;
      }
      return allMembers.filter(m => m.department === this.selectedDepartment);
    },
    nItems() {
      return this.members.length;
    },
    listStyle() {
      if (this.nItems > 0) {
        return {
          'margin-left': `${100 / this.nView / 2}%`,
          'width': `${(100 * (this.nItems / this.nView))}%`,
        };
      }
      return {};
    },
    itemStyle() {
      if (this.nItems > 0) {
        return {
          width: `${100 / this.nItems}%`,
        };
      }
      return {};
    }
  },
  methods: {
    getAvatarStyle(avatarUrl) {
      return {
        background: `url(${avatarUrl}) no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    },
    handleMemberClick(index) {
      this.stopMove();
      this.moveIt(index);
    },
    moveIt(index) {
      this.current = index;
      const targetX = `${(-100 / this.nItems) * index}%`;
      gsap.to('#list', {
        translateX: targetX,
        duration: 1,
        ease: 'elastic.out(1, 0.75)',
      });
    },
    autoMove() {
      if (this.nItems > 0) {
        let next = (this.current + 1) % this.nItems;
        this.moveIt(next);
      }
    },
    stopMove() {
      if (this.autoSlider) {
        clearInterval(this.autoSlider);
        this.autoSlider = null;
      }
    },
    startAutoMove() {
      this.stopMove();
      this.autoSlider = setInterval(this.autoMove, 3000);
    },
    resetSlider() {
        this.current = 0;
        this.stopMove();
        this.$nextTick(() => {
            if (this.members.length > 0) {
                gsap.set('#list', { translateX: '0%' }); // Reset position instantly
                this.moveIt(0);
                this.startAutoMove();
            }
        });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.resetSlider();
      setTimeout(() => {
        this.loaded = true;
      }, 500);
    });
  },
  beforeUnmount() {
    this.stopMove();
  },
  watch: {
    selectedYear() {
        this.resetSlider();
    },
    selectedDepartment() {
        this.resetSlider();
    }
  }
};
</script>

<style scoped>
/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

ul li {
  list-style-type: none;
}

/* Container */
.team-slider-container {
  padding: 60px 0;
  position: relative;
  width: 100%;
  overflow-x: hidden;
}

/* Year Selector */
.year-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  color:#fff;
}

/* Department Selector */
.department-selector {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
    color:#fff ;
}

/* No Members Message */
.no-members-message {
    text-align: center;
    color: #fff;
    font-size: 1.2rem;
    margin-top: 50px;
}


.year-selector button {
  background: none;
  border: 1px solid #fff;
  color: #fff;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 5px;
}

.year-selector button.active,
.year-selector button:hover {
  background: #fff;
  color: #333;
}


/* Slider */
.slider--teams {
  position: relative;
  max-width: 1200px; /* Increased size */
  margin: 0 auto;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.slider--teams.visible {
  opacity: 1;
  transform: translateY(0);
}

.slider--teams__team {
  position: relative;
  overflow: hidden;
}

#list {
  position: relative;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  padding: 0;
}

#list li {
  position: relative;
  display: inline-block;
  float: left;
  text-align: center;
}

#list li figure {
  cursor: pointer;
  margin: 1em;
  opacity: 0.5;
  backface-visibility: hidden;
  transition: transform 450ms cubic-bezier(0.445, 0.050, 0.550, 0.950), opacity 450ms ease-in-out;
  transform: scale(0.5) translateZ(0px);
}

#list li figure:hover {
  opacity: 0.8;
  transform: scale(0.6) translateZ(0px);
}

#list li figure:active {
  opacity: 1;
  transform: scale(0.7) translateZ(0px);
}

#list li figure > div {
  border-radius: 10px;
  position: relative;
  margin: 2rem auto;
  width: 150px;
  height: 150px;
  overflow: hidden;
  transform: rotate(45deg) translateZ(0px);
  border: 3px solid #fff;
}

#list li figure > div > div {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 210px;
  height: 210px;
  transform: rotate(-45deg) translate(-50%, -50%);
}

#list li figure figcaption {
  color: #fff;
}

#list li figure figcaption h2 {
  font-size: 1.8rem;
  font-weight: 800;
}

#list li figure figcaption p {
  font-size: 1rem;
  font-weight: 400;
  margin-top: 8px;
  font-style: italic;
}

#list li figure.active {
  opacity: 1 !important;
  transform: scale(1) translateZ(0px) !important;
}

.cf:before,
.cf:after {
  content: " ";
  display: table;
}

.cf:after {
  clear: both;
}
</style> 