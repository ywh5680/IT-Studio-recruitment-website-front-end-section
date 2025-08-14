<template>
  <div class="message-board-container">
    <StarfieldBackground :is-dark="theme.isDark" />
    <v-container class="message-board-content">
      <h3 class="text-h3 text-center font-weight-bold mb-8 text-white">留言板</h3>

      <v-row justify="center">
        <v-col cols="12" md="8">
          <!-- 留言列表 -->
          <div class="message-list mb-10" ref="messageList">
            <!-- 搜索状态反馈 -->
            <div v-if="searchStatus" class="search-feedback">
              <v-alert
                :type="getAlertType(searchStatus)"
                variant="tonal"
                border="start"
                class="mb-4"
                dismissible
              >
                <template v-if="searchStatus === 'searching'">
                  <v-progress-circular indeterminate size="24" class="mr-2"></v-progress-circular>
                  正在查找被回复的评论...
                </template>
                <template v-else-if="searchStatus === 'found'">
                  <v-icon icon="mdi-check-circle" class="mr-2"></v-icon>
                  已找到被回复的评论
                </template>
                <template v-else-if="searchStatus === 'not-found'">
                  <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
                  未能找到该评论，可能已被删除
                </template>
                <template v-else-if="searchStatus === 'error'">
                  <v-icon icon="mdi-alert-octagon" class="mr-2"></v-icon>
                  搜索过程中出错，请重试
                </template>
              </v-alert>
            </div>
            <div v-if="commentsLoading" class="text-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <template v-else-if="comments.length > 0">
              <CommentItem
                  v-for="comment in comments"
                  :key="comment.id"
                  :comment="comment"
                  @reply="setReply"
                  @jump-to="jumpToComment"
              />
            </template>
            <v-card v-else class="no-comments-card" flat>
              <v-card-text class="text-center text-grey">
                <span v-if="commentsError">{{ commentsError }}</span>
                <span v-else>还没有人留言，快来抢占第一个沙发吧！</span>
              </v-card-text>
            </v-card>

            <!-- 无限滚动哨兵 -->
            <div ref="sentinel" class="infinite-sentinel" v-if="hasMore"></div>
          </div>

          <!-- 留言表单 -->
          <v-card class="message-form-card" elevation="12">
            <v-card-title class="text-h5">
              {{ formTitle }}
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="handleSubmit">
                <!-- 显示被回复的评论内容 -->
                <v-alert v-if="replyingToInfo" type="info" variant="tonal" class="mb-4" border="start">
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-caption">
                        回复给: <strong>{{ replyingToInfo.author }}</strong>
                      </div>
                      <div class="text-body-2 original-comment">
                        "{{ replyingToInfo.content }}"
                      </div>
                    </div>
                    <v-btn size="x-small" icon="mdi-close" variant="text" @click="cancelReply"></v-btn>
                  </div>
                </v-alert>

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
                        :error-messages="emailErrors"
                        @blur="validateEmail"
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
    <WebsiteFooter></WebsiteFooter>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import commentService from '@/services/commentService';
import StarfieldBackground from '@/components/StarfieldBackground.vue';
import CommentItem from '@/components/CommentItem.vue';
import { theme } from '@/theme.js';
import WebsiteFooter from '@/components/WebsiteFooter.vue';

const comments = ref([]);
const commentsLoading = ref(true);
const commentsError = ref(null);

// 无限滚动参数
const start = ref(0)
const limit = 10
const hasMore = ref(true);
const loadingMore = ref(false);
const sentinel = ref(null);
let io = null;

const newComment = ref({
  content: '',
  email: '',
  qq: ''
});

const loading = ref(false);
const error = ref(null);
const replyingTo = ref(null); // 只存id
const replyingToInfo = ref(null); // 存简要信息

// 邮箱校验状态
const emailValid = ref(true);
const emailErrors = ref([]);

// RFC5322标准的简化版邮箱正则
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const formTitle = computed(() => {
  return replyingTo.value ? `回复评论 #${replyingTo.value}` : '留下你的足迹';
});

// 检查邮箱格式的合法性
const validateEmail = () => {
  // 邮箱不为空时才进行校验
  if (newComment.value.email) {
    if (emailRegex.test(newComment.value.email)) {
      emailValid.value = true;
      emailErrors.value = [];
    } else {
      emailValid.value = false;
      emailErrors.value = ['请输入有效的邮箱地址'];
    }
  } else {
    // 邮箱为空时清除错误信息
    emailValid.value = true;
    emailErrors.value = [];
  }
  return emailValid.value;
};

// 更新提交禁用状态
const isSubmitDisabled = computed(() => {
  const contentEmpty = !newComment.value.content.trim();
  const bothEmpty = !newComment.value.email && !newComment.value.qq;
  const emailInvalid = newComment.value.email && !emailValid.value;

  return contentEmpty || bothEmpty || emailInvalid;
});

const loadComments = async () => {
  if (loadingMore.value && !searchingParentId.value) return;
  loadingMore.value = true;

  if (start.value === 0) {
    commentsLoading.value = true;
    commentsError.value = null;
  }
  try {
  const { comments: newComments, hasMore: serverHasMore } = await commentService.getComments(start.value, limit);
    console.log('获取到数据:', {
      newComments: newComments.map(c => c.id),
      serverHasMore,
      currentStart: start.value
    });

    if (io && sentinel.value) {
      io.unobserve(sentinel.value);
      io.observe(sentinel.value);
    }

    // 更新数据
    comments.value = [...comments.value, ...newComments];
    start.value += newComments.length; 
    hasMore.value = serverHasMore;

  } catch (e) {
    console.error('获取评论失败:', e);
    commentsError.value = e.response?.data?.message || '无法加载评论，请稍后刷新重试';
    hasMore.value = false;
  } finally {
    commentsLoading.value = false;
    loadingMore.value = false;
  }
};

const messageList = ref(null);

const setupInfiniteScroll = () => {
  if (!sentinel.value || !messageList.value ) return;
  io = new IntersectionObserver((entries) => {
    const entry = entries[0];
    // 仅当用户在第一页发生过一次滚动后，才允许加载第二页
    if (entry.isIntersecting && hasMore.value && !loadingMore.value ) {
      loadComments();
    }
  }, {root:messageList.value, rootMargin: '100px', threshold: 0.2 });
  io.observe(sentinel.value);
};

const handleSubmit = async () => {
  // 先检查邮箱格式
  if (!validateEmail()) {
    error.value = '请修正邮箱格式后再提交';
    return;
  }

  if (isSubmitDisabled.value) return;

  loading.value = true;
  error.value = null;

  try {
    const body = {
      content: newComment.value.content,
    };
    if (newComment.value.email) body.email = newComment.value.email;
    if (newComment.value.qq) body.qq = newComment.value.qq;
    if (replyingTo.value) body.orid = replyingTo.value;


    await commentService.postComment(body);

    // 成功后清空表单
    newComment.value = { content: '', email: '', qq: '' };

    // 重新加载第一页，回到顶部
    comments.value = [];
    start.value = 0;
    hasMore.value = true;
    await loadComments();

    // 重置回复状态
    replyingTo.value = null;
    replyingToInfo.value = null;
  } catch (e) {
    console.error('评论提交失败:', e);
    const status = e.response?.status;
    if (status === 400) error.value = '缺少必要参数';
    else if (status === 404) error.value = '回复的评论不存在';
    else if (status === 422) error.value = '数据不合法，请检查邮箱或QQ号';
    else error.value = e.response?.data?.message || '发布失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

const setReply = ({ id, content, author }) => {
  replyingTo.value = id;
  replyingToInfo.value = { content, author };
  document.querySelector('.message-form-card').scrollIntoView({ behavior: 'smooth' });
};

const cancelReply = () => {
  replyingTo.value = null;
  replyingToInfo.value = null;
};

onMounted(() => {
  loadComments();
  setupInfiniteScroll();
});

onBeforeUnmount(() => {
  if (io && sentinel.value) io.unobserve(sentinel.value);
  if (io) io.disconnect();
});

// 处理从子项发起的跳转父评论请求
const findCommentEl = (id) => document.getElementById(`c-${id}`);

const searchingParentId = ref(null);
const searchTimeout = ref(null);
const maxSearchAttempts = 5; // 最多尝试加载5次
let currentAttempts = 0;
const searchStatus = ref(''); // 'searching', 'found', 'not-found', 'error'

const jumpToComment = (targetId) => {
  if (!targetId) return;
  searchStatus.value = 'searching';

  // 先尝试直接查找
  const el = findCommentEl(targetId);
  if (el) {
    searchStatus.value = 'found';
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // 如果没找到，开始自动加载更多
  searchingParentId.value = targetId;
  currentAttempts = 0;

  // 清除之前的超时
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  // 设置超时
  searchTimeout.value = setTimeout(() => {
    searchStatus.value = 'error';
    searchingParentId.value = null;
    error.value = '未能找到该评论，可能已被删除或无法加载';
  }, 10000); // 10秒超时
  
  (async () => {
    await searchParentComment();
  })();
};

const searchParentComment = async () => {
  if (!hasMore.value || currentAttempts >= maxSearchAttempts) {
    searchStatus.value = 'not-found';
    searchingParentId.value = null;
    if (searchTimeout.value) clearTimeout(searchTimeout.value);
    error.value = '未能找到该评论，可能已被删除或无法加载';
    return;
  }
  
  currentAttempts++;
  await loadComments();
  
  // 检查是否已加载
  const targetExists = comments.value.some(c => c.id === searchingParentId.value);
  if (targetExists) {
    const targetId = searchingParentId.value; // 保存当前搜索的ID
    searchStatus.value = 'found';
    searchingParentId.value = null;
    if (searchTimeout.value) clearTimeout(searchTimeout.value);
      // 自动隐藏成功提示
    setTimeout(() => {
      searchStatus.value = '';
    }, 2000);

    setTimeout(() => {
      const el = findCommentEl(targetId); // 使用保存的ID
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
    return;
  }
  
  // 继续搜索
  if (searchingParentId.value) {
    setTimeout(() => searchParentComment(), 0);
  }
};

const getAlertType = (status) => {
  switch(status) {
    case 'searching': return 'info';
    case 'found': return 'success';
    case 'not-found': return 'warning';
    case 'error': return 'error';
    default: return 'info';
  }
};
</script>

<style scoped>
.message-board-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.message-board-content {
  padding: 120px 20px 80px;
  position: relative;
  z-index: 1;
  flex: 1;
}

.message-list {
  max-height: 60vh; 
  overflow-y: auto; 
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 8px; 
}

/* 滚动条 */
.message-list::-webkit-scrollbar {
  width: 6px;
}
.message-list::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
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

.original-comment {
  font-style: italic;
  opacity: 0.8;
  margin-top: 4px;
}

.infinite-sentinel {
  height: 1px;
  width: 1px;
  pointer-events: none;
  visibility: hidden
}

.search-feedback {
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-feedback .v-alert {
  backdrop-filter: blur(5px);
  border-radius: 8px;
}

.search-feedback .v-icon {
  vertical-align: middle;
}
</style>