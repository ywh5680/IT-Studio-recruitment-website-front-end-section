<template>
  <div class="comment-wrapper">
    <div class="message-item">
      <p class="message-content">{{ comment.content }}</p>
      <div class="message-meta">
        <span class="author">- {{ comment.author }}</span>
        <span class="timestamp">{{ comment.timestamp }}</span>
        <v-btn size="small" variant="text" @click="$emit('reply', comment.id)">回复</v-btn>
      </div>
    </div>
    <div v-if="comment.children && comment.children.length > 0" class="replies-list">
      <CommentItem
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
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
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
});

defineEmits(['reply']);
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

.replies-list {
  margin-top: 15px;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 2px solid rgba(255, 255, 255, 0.15);
}

.reply-item:last-child .comment-wrapper {
  margin-bottom: 0;
}
</style> 