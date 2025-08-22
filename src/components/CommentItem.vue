<template>
  <div class="comment-wrapper" :id="`c-${comment.displayId}`">
    <div class="message-item">
      <div class="message-header">
        <span class="comment-id">#{{ comment.displayId }}</span>
        <button
          v-if="comment.displayParentId"
          class="reply-to as-link"
          type="button"
          @click="emitJumpTo(comment.displayParentId)"
        >
          回复 #{{ comment.displayParentId }}
        </button>
      </div>
      <p ref="contentRef" class="message-content" :class="{ clamped: isClamped && !expanded }">{{ comment.content }}</p>
      <div class="toggle-row" v-if="isClamped">
        <v-btn size="x-small" variant="text" color="primary" @click="expanded = !expanded">
          {{ expanded ? '收起' : '展开' }}
        </v-btn>
      </div>
      <div class="message-meta">
        <span class="author">- {{ getAuthorName(comment) }}</span>
        <span class="timestamp">{{ formatDateTime(comment.datetime) }}</span>
        <v-btn size="small" variant="text" color="primary" @click="handleReplyClick">
          <v-icon size="small" class="mr-1">mdi-reply</v-icon>
          回复
        </v-btn>
      </div>
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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['reply', 'jump-to']);

// 折叠逻辑：基于实际渲染行数检测
const expanded = ref(false);
const contentRef = ref(null);
const isClamped = ref(false);

const computeLineClamp = () => {
  const el = contentRef.value;
  if (!el) {
    isClamped.value = false;
    return;
  }
  const style = window.getComputedStyle(el);
  const lineHeight = parseFloat(style.lineHeight);
  const maxLines = 6;
  const maxHeight = lineHeight * maxLines;
  isClamped.value = el.scrollHeight - 1 > maxHeight;
};

const onResize = () => computeLineClamp();

onMounted(async () => {
  await nextTick();
  computeLineClamp();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});

const handleReplyClick = () => {
  emit('reply', {
    id: props.comment.id,
    content: props.comment.content,
    author: getAuthorName(props.comment)
  });
};

const emitJumpTo = (id) => {
  if (!id) return;
  // 直接使用displayId进行跳转
  const targetEl = document.getElementById(`c-${id}`);
  if (targetEl) {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // 添加高亮效果
    targetEl.classList.add('highlight');
    setTimeout(() => targetEl.classList.remove('highlight'), 2000);
  } else {
    emit('jump-to', id); // 让父组件处理未找到的情况
  }
};

const getAuthorName = (comment) => {
  if (!comment) return '匿名用户';
  // 隐私保护，只显示QQ后4位和邮箱前缀
  if (comment.qq) return `QQ用户 ${comment.qq.slice(-4)}`;
  if (comment.email) {
    const [name] = comment.email.split('@');
    return name.length > 8 ? `${name.slice(0, 8)}...` : name;
  }
  return '匿名用户';
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
.reply-to { color: rgba(var(--v-theme-primary), 0.8); font-style: italic; }
.reply-to.as-link { cursor: pointer; text-decoration: underline; }
.message-content {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #f5f5f7;
  margin-bottom: 12px;
  white-space: pre-wrap;
  word-break: break-word;
}
.message-content.clamped {
  display: -webkit-box;
  line-clamp: 6;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.toggle-row {
  margin-top: -6px;
  margin-bottom: 6px;
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

/* 跳转评论时高亮显示 */
.comment-wrapper.highlight {
  animation: highlight-fade 2s ease;
}
@keyframes highlight-fade {
  0% { background: rgba(var(--v-theme-primary), 0.3); }
  100% { background: transparent; }
}
/* 移除缩进与子评论区块，全部平级展示 */
</style> 