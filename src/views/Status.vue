<template>
  <div class="status-view-container">
    <StarfieldBackground :is-dark="theme.isDark" />
    <v-container class="fill-height content-container" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card 
            class="status-card" 
            elevation="12" 
            :loading="loading"
          >
            <v-card-title class="text-center text-h4 font-weight-bold pa-5">
              报名状态查询
            </v-card-title>
            
            <v-card-text v-if="!result">
              <v-form @submit.prevent="handleQuery">
                <v-text-field
                  v-model="queryInput"
                  label="输入姓名/邮箱/QQ/学号/手机号查询"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  class="mb-3"
                  autofocus
                ></v-text-field>

                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                  dense
                >
                  {{ error }}
                </v-alert>

                <v-btn
                  :disabled="isQueryDisabled"
                  :loading="loading"
                  type="submit"
                  block
                  color="primary"
                  size="large"
                >
                  查询
                </v-btn>
              </v-form>
            </v-card-text>

            <v-card-text v-else class="text-center">
              <v-list class="result-list" bg-color="transparent">
                <v-list-item>
                  <v-list-item-title class="text-h6">
                    {{ result.progress }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    当前状态
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
              
              <v-divider class="my-4"></v-divider>

              <v-stepper alt-labels>
                <v-stepper-item
                  title="提交申请"
                  icon="mdi-file-document-edit"
                  :complete="step1State.complete"
                >
                </v-stepper-item>

                <v-divider></v-divider>

                <v-stepper-item
                  title="审核/面试"
                  icon="mdi-account-group"
                  :complete="step2State.complete"
                >
                </v-stepper-item>

                <v-divider></v-divider>

                <v-stepper-item
                  title="结果反馈"
                  :icon="step3State.icon"
                  :complete="step3State.complete"
                  :error="step3State.error"
                >
                </v-stepper-item>
              </v-stepper>
              
              <v-btn
                @click="reset"
                class="mt-8"
                color="secondary"
                variant="outlined"
              >
                返回
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import StarfieldBackground from '@/components/StarfieldBackground.vue';
import { theme } from '@/theme.js';

export default {
  name: 'StatusView',
  components: {
    StarfieldBackground,
  },
  setup() {
    const queryInput = ref('');
    
    const loading = ref(false);
    const error = ref(null);
    const result = ref(null);

    const isQueryDisabled = computed(() => {
      return !queryInput.value.trim();
    });

    const step1State = computed(() => {
      if (!result.value) return {};
      return { complete: result.value.idx >= 0 };
    });

    const step2State = computed(() => {
      if (!result.value) return {};
      // 任何面试/审核相关的状态都意味着第二步正在进行或已完成
      return { complete: result.value.idx >= 1 };
    });

    const step3State = computed(() => {
      if (!result.value) return {};
      const isSuccess = result.value.idx === 4;
      const isFailure = result.value.idx < 0;
      return {
        complete: isSuccess,
        error: isFailure,
        icon: isSuccess
          ? 'mdi-check-decagram'
          : isFailure
          ? 'mdi-close-octagon'
          : 'mdi-comment-question-outline',
      };
    });
    
    const handleQuery = async () => {
      if (isQueryDisabled.value) return;
      
      loading.value = true;
      error.value = null;
      result.value = null;

      try {
        const input = queryInput.value.trim();
        const body = {};

        if (input.includes('@')) {
          body.email = input;
        } else if (/^\d+$/.test(input)) {
          body.phone = input;
          body.qq = input;
          body.uid = input;
        } else {
          body.name = input;
        }
        
        const response = await axios.post('/api/get_status/', body);
        result.value = response.data;
        
      } catch (e) {
        const status = e.response?.status;
        if (status === 400) error.value = '缺少查询参数或参数格式不正确';
        else if (status === 404) error.value = '未找到您的报名记录';
        else if (status === 406) error.value = '找到多条记录，请提供更精确的信息';
        else error.value = e.response?.data?.message || '查询失败，请稍后再试';
      } finally {
        loading.value = false;
      }
    };

    const reset = () => {
      queryInput.value = '';
      result.value = null;
      error.value = null;
    };

    return {
      theme,
      queryInput,
      loading,
      error,
      result,
      isQueryDisabled,
      step1State,
      step2State,
      step3State,
      handleQuery,
      reset
    };
  },
};
</script>

<style scoped>
.status-view-container {
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
}

.content-container {
  position: relative;
  z-index: 1;
}

.status-card {
  background-color: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px !important;
  color: #fff;
}

.text-center {
  text-align: center;
}

.v-card-title {
  color: #f5f5f7;
}

.v-text-field :deep(label),
.v-text-field :deep(.v-input__icon .v-icon) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-text-field :deep(input) {
  color: #fff !important;
}

.v-text-field :deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.v-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.result-list {
  color: #fff;
}

.result-list :deep(.v-list-item-title) {
  font-size: 1.5rem !important;
  font-weight: 600;
  color: #fff !important;
  text-align: center;
  margin-bottom: 8px;
}

.result-list :deep(.v-list-item-subtitle) {
  font-size: 0.9rem !important;
  color: rgba(255, 255, 255, 0.7) !important;
  text-align: center;
}

.result-list :deep(.v-list-item__prepend .v-icon) {
  color: rgba(255, 255, 255, 0.8) !important;
}

.v-stepper {
  background-color: transparent !important;
  color: #fff;
}

.v-stepper :deep(.v-stepper-item__title) {
  color: #fff;
}

.v-stepper :deep(.v-stepper-item--complete .v-stepper-item__title) {
  color: #4caf50; /* Vuetify success color */
}

.v-stepper :deep(.v-stepper-item--error .v-stepper-item__title) {
  color: #f44336; /* Vuetify error color */
}

@media (max-width: 600px) {
  .v-card-title {
    font-size: 1.8rem !important;
  }
}
</style> 