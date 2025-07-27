<template>
  <div class="comment-wrapper">
    <div class="message-item" :class="{'deep-reply': isDeep}">
      <div class="message-header">
        <span class="comment-id">#{{ comment.id }}</span>
        <span v-if="comment.parent" class="reply-to">回复 #{{ comment.parent }}</span>
      </div>
      <p class="message-content">{{ comment.content }}</p>
      <div class="message-meta">
        <span class="author">- {{ getAuthorName(comment) }}</span>
        <span class="timestamp">{{ formatDateTime(comment.datetime) }}</span>
        <v-btn size="small" variant="text" color="primary" @click="handleReplyClick">
          <v-icon size="small" class="mr-1">mdi-reply</v-icon>
          回复
        </v-btn>
      </div>
    </div>

    <!-- 展开/收起回复按钮 -->
    <div v-if="showLoadRepliesBtn" class="children-count">
      <v-btn size="small" variant="text" color="primary" :loading="loadingChildren" @click="loadChildren">
        展开{{ childrenCount }}条回复
      </v-btn>
    </div>
    <div v-if="showCollapseBtn" class="children-count">
      <v-btn size="small" variant="text" color="primary" @click="collapseChildren">
        收起回复
      </v-btn>
    </div>

    <div v-if="childrenVisible && childrenComments.length > 0" class="replies-list">
      <CommentItem
        v-for="child in childrenComments"
        :key="child.id"
        :comment="child"
        :depth="depth + 1"
        class="reply-item"
        @reply="$emit('reply', $event)"
      />
    </div>
  </div>
</template>

<script>
// This is needed for the component to be able to refer to itself recursively.
export default {
  name: 'CommentItem'
}
</script>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['reply']);

const isDeep = computed(() => props.depth > 2);

// 懒加载子评论相关
const childrenIds = computed(() => Array.isArray(props.comment.children) ? props.comment.children : []);
const childrenComments = ref([]); // 真正用于递归渲染的对象数组
const childrenLoaded = ref(false);
const loadingChildren = ref(false);
const childrenVisible = ref(false); // 控制显示/收起
const childrenCount = computed(() => childrenIds.value.length);

const hasReplies = computed(() => childrenIds.value.length > 0);
const showLoadRepliesBtn = computed(() => hasReplies.value && !childrenVisible.value);
const showCollapseBtn = computed(() => hasReplies.value && childrenVisible.value);

// 懒加载递归获取子评论对象
const loadChildren = async () => {
  if (childrenLoaded.value || loadingChildren.value) {
    childrenVisible.value = true;
    return;
  }
  loadingChildren.value = true;
  try {
    // 获取所有直接子评论对象
    const res = await api.get(`/comment/${props.comment.id}/`);
    const comments = res.data;
    // 对每个子评论递归加载其 childrenComments
    for (const comment of comments) {
      if (Array.isArray(comment.children) && comment.children.length > 0) {
        comment.childrenComments = [];
      }
    }
    childrenComments.value = comments;
    childrenLoaded.value = true;
    childrenVisible.value = true;
  } catch (e) {
    alert('加载子评论失败');
  } finally {
    loadingChildren.value = false;
  }
};

const collapseChildren = () => {
  childrenVisible.value = false;
};

const handleReplyClick = () => {
  emit('reply', {
    id: props.comment.id,
    content: props.comment.content,
    author: getAuthorName(props.comment)
  });
};

const getAuthorName = (comment) => {
  if (!comment) return '未知用户';
  if (comment.qq) {
    return `QQ: ${comment.qq}`;
  } else if (comment.email) {
    return `邮箱: ${comment.email}`;
  } else {
    return '匿名用户';
  }
};

const formatDateTime = (datetime) => {
  if (!datetime) return '';
  try {
    const date = new Date(datetime);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return datetime;
  }
};

onMounted(() => {
  // 如果父组件传递了 childrenComments（如顶层），直接用
  if (Array.isArray(props.comment.childrenComments) && props.comment.childrenComments.length > 0) {
    childrenComments.value = props.comment.childrenComments;
    childrenLoaded.value = true;
    childrenVisible.value = true;
  }
});
</script>

<style scoped>
.comment-wrapper {
  margin-bottom: 20px;
}
.message-item {
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}
.message-item.deep-reply {
  background: rgba(var(--v-theme-primary), 0.08);
  border-color: rgba(var(--v-theme-primary), 0.2);
}
.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.85rem;
}
.comment-id {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}
.reply-to {
  color: rgba(var(--v-theme-primary), 0.8);
  font-style: italic;
}
.message-content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #f5f5f7;
  margin-bottom: 12px;
  white-space: pre-wrap;
  word-break: break-word;
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
.replies-list {
  margin-top: 8px;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 2px solid rgba(255, 255, 255, 0.15);
}
.reply-item:last-child .comment-wrapper {
  margin-bottom: 0;
}
.children-count {
  margin: 8px 0 0 20px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}
</style> 