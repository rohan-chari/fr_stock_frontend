<template>
  <div class="comment-item">
    <div class="comment-header">
      <div class="comment-meta">
        <span class="upvotes" v-if="comment.upvotes !== undefined">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l-8 8h5v8h6v-8h5z"/>
          </svg>
          {{ formatUpvotes(comment.upvotes) }}
        </span>
        <span v-if="comment.upvotes !== undefined && comment.createdAt" class="separator">·</span>
        <span v-if="comment.createdAt" class="timestamp">{{ formatTime(comment.createdAt) }}</span>
      </div>
      <div v-if="comment.sentiment !== null && comment.sentiment !== undefined" class="sentiment-badge" :class="sentimentClass">
        <span class="sentiment-icon">{{ sentimentIcon }}</span>
        {{ sentimentLabel }}
      </div>
    </div>
    <p class="comment-body">{{ comment.body }}</p>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    sentimentClass() {
      if (this.comment.sentiment === null || this.comment.sentiment === undefined) return ''
      if (this.comment.sentiment >= 0.3) return 'bullish'
      if (this.comment.sentiment <= -0.3) return 'bearish'
      return 'neutral'
    },
    sentimentLabel() {
      if (this.comment.sentiment === null || this.comment.sentiment === undefined) return ''
      if (this.comment.sentiment >= 0.3) return 'Bullish'
      if (this.comment.sentiment <= -0.3) return 'Bearish'
      return 'Neutral'
    },
    sentimentIcon() {
      if (this.comment.sentiment === null || this.comment.sentiment === undefined) return ''
      if (this.comment.sentiment >= 0.3) return '↑'
      if (this.comment.sentiment <= -0.3) return '↓'
      return '→'
    }
  },
  methods: {
    formatUpvotes(count) {
      if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k'
      }
      return count
    },
    formatTime(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffHours < 1) return 'Just now'
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      return date.toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.comment-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--color-gray-100);
}

.comment-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.comment-item:first-child {
  padding-top: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-gray-400);
}

.upvotes {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-gray-600);
  font-weight: 600;
}

.upvotes svg {
  color: var(--color-primary-500);
}

.separator {
  color: var(--color-gray-300);
}

.sentiment-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.sentiment-icon {
  font-size: 12px;
  font-weight: 700;
}

.sentiment-badge.bullish {
  background: var(--color-success-light);
  color: var(--color-success);
}

.sentiment-badge.bearish {
  background: var(--color-error-light);
  color: var(--color-error);
}

.sentiment-badge.neutral {
  background: var(--color-gray-100);
  color: var(--color-gray-500);
}

.comment-body {
  font-size: 14px;
  color: var(--color-gray-700);
  line-height: 1.6;
}
</style>
