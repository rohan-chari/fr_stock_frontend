<template>
  <div class="post-card">
    <div class="post-header">
      <h3 class="post-title">
        <a :href="post.url" target="_blank" rel="noopener noreferrer">
          {{ post.title }}
          <svg class="external-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </h3>
      <div class="post-meta">
        <span class="post-source">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
          </svg>
          Reddit
        </span>
        <span class="separator">·</span>
        <span class="post-time">{{ formatTime(post.postTime) }}</span>
      </div>
    </div>

    <div class="comments-section">
      <button
        class="comments-toggle"
        @click="showComments = !showComments"
        v-if="post.comments && post.comments.length > 0"
      >
        <svg
          class="chevron"
          :class="{ rotated: showComments }"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
        <span class="comment-count">{{ post.comments.length }}</span>
        comment{{ post.comments.length !== 1 ? 's' : '' }}
        <span v-if="sentimentSummary" class="sentiment-summary" :class="sentimentSummary.class">
          {{ sentimentSummary.label }}
        </span>
      </button>
      <span v-else class="no-comments">No comments yet</span>

      <div v-if="showComments && post.comments" class="comments-list">
        <CommentItem
          v-for="comment in post.comments"
          :key="comment.id"
          :comment="comment"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CommentItem from './CommentItem.vue'

export default {
  name: 'PostCard',
  components: {
    CommentItem
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showComments: false
    }
  },
  computed: {
    sentimentSummary() {
      if (!this.post.comments || this.post.comments.length === 0) return null

      const sentiments = this.post.comments
        .filter(c => c.sentiment !== null)
        .map(c => c.sentiment)

      if (sentiments.length === 0) return null

      const avg = sentiments.reduce((a, b) => a + b, 0) / sentiments.length

      if (avg >= 0.2) return { label: 'Mostly Bullish', class: 'bullish' }
      if (avg <= -0.2) return { label: 'Mostly Bearish', class: 'bearish' }
      return { label: 'Mixed', class: 'neutral' }
    }
  },
  methods: {
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
.post-card {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.post-card:hover {
  border-color: var(--color-primary-200);
  box-shadow: var(--shadow-md);
}

.post-header {
  padding: 20px 24px;
}

.post-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-gray-900);
  line-height: 1.5;
  margin-bottom: 10px;
}

.post-title a {
  color: inherit;
  text-decoration: none;
  display: inline;
}

.post-title a:hover {
  color: var(--color-primary-600);
}

.external-icon {
  display: inline;
  margin-left: 6px;
  vertical-align: middle;
  opacity: 0.4;
  transition: opacity 0.15s;
}

.post-title a:hover .external-icon {
  opacity: 1;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.post-source {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ff4500;
  font-weight: 500;
}

.separator {
  color: var(--color-gray-300);
}

.post-time {
  color: var(--color-gray-500);
}

.comments-section {
  padding: 14px 24px;
  background: var(--color-gray-50);
  border-top: 1px solid var(--color-gray-100);
}

.comments-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-gray-600);
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.15s;
}

.comments-toggle:hover {
  color: var(--color-gray-900);
}

.comment-count {
  font-weight: 600;
  color: var(--color-primary-600);
}

.chevron {
  transition: transform 0.2s;
  color: var(--color-gray-400);
}

.chevron.rotated {
  transform: rotate(180deg);
}

.sentiment-summary {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-left: 4px;
}

.sentiment-summary.bullish {
  background: var(--color-success-light);
  color: var(--color-success);
}

.sentiment-summary.bearish {
  background: var(--color-error-light);
  color: var(--color-error);
}

.sentiment-summary.neutral {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.no-comments {
  font-size: 13px;
  color: var(--color-gray-400);
}

.comments-list {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-gray-200);
}
</style>
