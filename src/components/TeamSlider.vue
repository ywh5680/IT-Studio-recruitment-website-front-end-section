<template>
  <div class="team-grid-container">
    <!-- Desktop Filters -->
    <div class="desktop-filters">
      <!-- Year Selector -->
      <div class="year-selector">
        <v-chip-group
          v-model="selectedYear"
          active-class="primary--text"
          mandatory
          class="chip-group"
        >
          <v-chip
            v-for="yearData in teamStructure"
            :key="yearData.year"
            :value="yearData.year"
            class="filter-chip"
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
          class="chip-group"
        >
          <v-chip
            v-for="department in departments"
            :key="department"
            :value="department"
            class="filter-chip"
          >
            {{ department }}
          </v-chip>
        </v-chip-group>
      </div>
    </div>

    <!-- Mobile Filters -->
    <div class="mobile-filters">
      <div class="filter-row">
        <v-select
          v-model="selectedYear"
          :items="yearOptions"
          :item-title="(item) => item + '届'"
          label="选择届数"
          outlined
          dense
          hide-details
          class="mobile-select"
        ></v-select>
        
        <v-select
          v-model="selectedDepartment"
          :items="departmentOptions"
          label="选择部门"
          outlined
          dense
          hide-details
          class="mobile-select"
        ></v-select>
      </div>
    </div>

    <!-- Team Grid -->
    <div v-if="members.length > 0" class="team-grid">
      <div
        v-for="(member, index) in members"
        :key="member.name + index"
        class="member-card"
      >
        <div class="member-avatar">
          <img :src="member.avatar" :alt="member.name" />
        </div>
        <div class="member-info">
          <h3 class="member-name">{{ member.name }}</h3>
          <p class="member-department">{{ member.department }}</p>
          <p class="member-quote">"{{ member.quote }}"</p>
        </div>
      </div>
    </div>
    
    <div v-else class="no-members-message">
      该分类下暂无成员
    </div>
  </div>
</template>

<script>
import { teamStructureData, departmentsData } from '../data.js';

export default {
  name: 'TeamSlider',
  data() {
    return {
      teamStructure: teamStructureData,
      selectedYear: teamStructureData[0]?.year || null,
      departments: ['全部', ...departmentsData.map(d => d.name)],
      selectedDepartment: '全部',
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
    yearOptions() {
      return this.teamStructure.map(y => y.year);
    },
    departmentOptions() {
      return this.departments;
    }
  }
};
</script>

<style scoped>
/* Container */
.team-grid-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* Desktop Filters */
.desktop-filters {
  display: block;
}

.mobile-filters {
  display: none;
}

/* Year Selector */
.year-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  color: #fff;
  width: 100%;
  overflow-x: auto;
  padding: 0 10px;
}

/* Department Selector */
.department-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  color: #fff;
  width: 100%;
  overflow-x: auto;
  padding: 0 10px;
}

/* Mobile Filters */
.mobile-filters {
  margin-bottom: 30px;
}

.filter-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.mobile-select {
  flex: 1;
  min-width: 140px;
}

/* 移动端下拉菜单主题适配 */
.mobile-select :deep(.v-input__control) {
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px;
}

.mobile-select :deep(.v-field) {
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: #fff !important;
}

.mobile-select :deep(.v-field__input) {
  color: #fff !important;
}

/* Chip Group Styles */
.chip-group {
  flex-wrap: wrap;
  justify-content: center;
}

.filter-chip {
  margin: 4px !important;
  flex-shrink: 0;
}

/* No Members Message */
.no-members-message {
  text-align: center;
  color: #fff;
  font-size: 1.2rem;
  margin-top: 50px;
}

/* Team Grid */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
  justify-items: center;
  max-width: 100%;
}

/* Member Card */
.member-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 320px;
  box-sizing: border-box;
}

.member-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Member Avatar */
.member-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Member Info */
.member-info {
  color: #fff;
}

.member-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #fff;
}

.member-department {
  font-size: 0.9rem;
  color: #0071e3;
  margin-bottom: 12px;
  font-weight: 500;
}

.member-quote {
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
  margin: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .team-grid-container {
    padding: 20px 15px;
  }
  
  .desktop-filters {
    display: none;
  }
  
  .mobile-filters {
    display: block;
  }
  
  .team-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 30px;
  }
  
  .member-card {
    padding: 20px;
    max-width: 100%;
  }
  
  .member-avatar {
    width: 100px;
    height: 100px;
    margin-bottom: 16px;
  }
  
  .member-name {
    font-size: 1.3rem;
  }
  
  .member-quote {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .team-grid-container {
    padding: 15px 10px;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .mobile-select {
    min-width: 100%;
  }
  
  .team-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 20px;
  }
  
  .member-card {
    padding: 16px;
    max-width: 100%;
  }
  
  .member-avatar {
    width: 80px;
    height: 80px;
    margin-bottom: 12px;
  }
  
  .member-name {
    font-size: 1.2rem;
  }
  
  .member-department {
    font-size: 0.8rem;
  }
  
  .member-quote {
    font-size: 0.85rem;
  }
}
</style> 