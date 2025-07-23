<template>
  <div class="message-board-container">
    <StarfieldBackground :is-dark="theme.isDark" />
    <v-container class="message-board-content">
      <h3 class="text-h3 text-center font-weight-bold mb-8">留言板</h3>
      
      <v-row justify="center">
        <v-col cols="12" md="8">
          <!-- 留言列表 -->
          <div class="message-list mb-10">
            <div v-if="commentsLoading" class="text-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <template v-else-if="comments.length > 0">
              <CommentItem
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                @reply="setReply"
              />
            </template>
            <v-card v-else class="no-comments-card" flat>
              <v-card-text class="text-center text-grey">
                <span v-if="commentsError">{{ commentsError }}</span>
                <span v-else>还没有人留言，快来抢占第一个沙发吧！</span>
              </v-card-text>
            </v-card>
          </div>

          <!-- 留言表单 -->
          <v-card class="message-form-card" elevation="12">
            <v-card-title class="text-h5">
              {{ formTitle }}
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="handleSubmit">
                <v-textarea
                  v-model="newComment.content"
                  label="说点什么吧..."
                  variant="outlined"
                  rows="4"
                  counter
                  maxlength="500"
                  class="mb-3"
                  autofocus
                ></v-textarea>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="newComment.email"
                      label="邮箱"
                      variant="outlined"
                      prepend-inner-icon="mdi-email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="newComment.qq"
                      label="QQ (可选)"
                      variant="outlined"
                      type="number"
                      prepend-inner-icon="mdi-qqchat"
                    ></v-text-field>
                  </v-col>
                </v-row>
                
                <v-alert v-if="replyingTo" type="info" variant="tonal" class="mb-4" dense>
                  正在回复评论 #{{ replyingTo }}
                  <v-btn size="x-small" icon="mdi-close" variant="text" @click="cancelReply"></v-btn>
                </v-alert>

                <v-alert v-if="error" type="error" variant="tonal" class="mb-4" dense>
                  {{ error }}
                </v-alert>
                
                <v-btn
                  :disabled="isSubmitDisabled"
                  :loading="loading"
                  type="submit"
                  block
                  color="primary"
                  size="large"
                >
                  发布
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import StarfieldBackground from '@/components/StarfieldBackground.vue';
import CommentItem from '@/components/CommentItem.vue';
import { theme } from '@/theme.js';

const comments = ref([]);
const commentsLoading = ref(true);
const commentsError = ref(null);

const newComment = ref({
  content: '',
  email: '',
  qq: ''
});

const loading = ref(false);
const error = ref(null);
const replyingTo = ref(null);

const formTitle = computed(() => {
  return replyingTo.value ? `回复评论 #${replyingTo.value}` : '留下你的足迹';
});

const isSubmitDisabled = computed(() => {
  return !newComment.value.content.trim() || (!newComment.value.email && !newComment.value.qq);
});

const fetchComments = async () => {
  commentsLoading.value = true;
  commentsError.value = null;
  try {
    const response = await axios.get('/api/comments/');
    comments.value = response.data;
  } catch (e) {
    commentsError.value = e.response?.data?.message || '无法加载评论，请稍后刷新重试';
  } finally {
    commentsLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (isSubmitDisabled.value) return;

  loading.value = true;
  error.value = null;
  
  try {
    const body = {
      content: newComment.value.content,
    };
    if (newComment.value.email) body.email = newComment.value.email;
    if (newComment.value.qq) body.qq = newComment.value.qq;
    if (replyingTo.value) body.parent = replyingTo.value;

    await axios.post('/api/comment/', body);
    
    // 成功后清空表单并刷新列表
    newComment.value = { content: '', email: '', qq: '' };
    replyingTo.value = null;
    await fetchComments(); // 刷新评论列表
  } catch (e) {
    const status = e.response?.status;
    if (status === 400) error.value = '缺少必要参数';
    else if (status === 404) error.value = '回复的评论不存在';
    else if (status === 422) error.value = '数据不合法，请检查邮箱或QQ号';
    else error.value = e.response?.data?.message || '发布失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

const setReply = (parentId) => {
  replyingTo.value = parentId;
  document.querySelector('.message-form-card').scrollIntoView({ behavior: 'smooth' });
};

const cancelReply = () => {
  replyingTo.value = null;
};

onMounted(() => {
  fetchComments();
});
</script>

<style scoped>
.message-board-container {
  min-height: 100vh;
}
.message-board-content {
  padding: 120px 20px 80px;
  position: relative;
  z-index: 1;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-item {
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.message-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.message-content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #f5f5f7;
  margin-bottom: 12px;
}

.message-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: #a1a1a6;
}

.message-meta .author {
  font-weight: 600;
  color: #9cd9f9;
}

.message-form-card {
  background-color: rgba(30, 30, 30, 0.7) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px !important;
  color: #fff;
}

.no-comments-card {
  background-color: transparent !important;
  padding: 40px 0;
}
</style> 