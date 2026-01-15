<template>
  <div class="stock-detail">
    <div class="container">
      <nav class="breadcrumb">
        <router-link to="/" class="breadcrumb-link">Home</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ symbol }}</span>
      </nav>

      <div v-if="loading" class="loading-state">
        <div class="loading-card">
          <div class="loading-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="M18 9l-5 5-4-4-3 3"/>
            </svg>
          </div>
          <h2 class="loading-title">Researching {{ symbol }}</h2>
          <p class="loading-message">
            We're gathering the latest discussions and sentiment data for this stock.
            This may take a few moments on first lookup.
          </p>
          <div class="loading-progress">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-card">
          <div class="error-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p class="error-message">{{ error }}</p>
          <button @click="fetchStockData" class="retry-button">Try Again</button>
        </div>
      </div>

      <div v-else-if="stockData" class="stock-content">
        <header class="stock-header">
          <div class="stock-title-section">
            <div class="symbol-badge">{{ stockData.stockSymbol || symbol }}</div>
            <p class="stock-stats">{{ stockData.totalPosts || 0 }} posts · {{ stockData.totalComments || 0 }} comments analyzed</p>
          </div>
        </header>

        <SentimentGauge
          v-if="stockData.averageSentiment !== undefined"
          :sentiment="stockData.averageSentiment"
        />

        <SourceTabs v-model:activeTab="activeTab" />

        <div class="tab-content">
          <div v-if="activeTab === 'reddit'" class="posts-container">
            <div v-if="stockData.posts && stockData.posts.length > 0" class="posts-list">
              <PostCard
                v-for="post in stockData.posts"
                :key="post.id"
                :post="post"
              />
            </div>
            <div v-else class="empty-state">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </div>
              <p>No Reddit discussions found for {{ symbol }}.</p>
            </div>
          </div>

          <div v-else class="coming-soon-state">
            <div class="coming-soon-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <p>This data source is coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { stockService } from '../services/stockService'
import SourceTabs from '../components/SourceTabs.vue'
import PostCard from '../components/PostCard.vue'
import SentimentGauge from '../components/SentimentGauge.vue'

export default {
  name: 'StockDetail',
  components: {
    SourceTabs,
    PostCard,
    SentimentGauge
  },
  props: {
    symbol: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      error: null,
      stockData: null,
      activeTab: 'reddit'
    }
  },
  mounted() {
    this.fetchStockData()
  },
  watch: {
    symbol() {
      this.fetchStockData()
    }
  },
  methods: {
    async fetchStockData() {
      this.loading = true
      this.error = null

      try {
        this.stockData = await stockService.getStockData(this.symbol)
      } catch (err) {
        this.error = err.message || 'Failed to fetch stock data'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.stock-detail {
  min-height: calc(100vh - 64px);
  background: var(--color-gray-50);
  padding: 32px 24px;
}

.container {
  max-width: 960px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  font-size: 14px;
}

.breadcrumb-link {
  color: var(--color-gray-500);
  transition: color 0.15s;
}

.breadcrumb-link:hover {
  color: var(--color-primary-600);
}

.breadcrumb-separator {
  color: var(--color-gray-300);
}

.breadcrumb-current {
  color: var(--color-gray-900);
  font-weight: 500;
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.loading-card {
  background: white;
  border-radius: 16px;
  border: 1px solid var(--color-gray-200);
  padding: 56px 48px;
  text-align: center;
  max-width: 420px;
  width: 100%;
}

.loading-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-100);
  border-radius: 16px;
  color: var(--color-primary-600);
  animation: pulse-icon 2s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.loading-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 12px;
}

.loading-message {
  font-size: 14px;
  color: var(--color-gray-500);
  line-height: 1.6;
  margin-bottom: 28px;
}

.loading-progress {
  width: 100%;
}

.progress-bar {
  height: 4px;
  background: var(--color-gray-200);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-400));
  border-radius: 2px;
  animation: progress 2s ease-in-out infinite;
}

@keyframes progress {
  0% {
    width: 0%;
    margin-left: 0%;
  }
  50% {
    width: 60%;
    margin-left: 20%;
  }
  100% {
    width: 0%;
    margin-left: 100%;
  }
}

/* Error State */
.error-state {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.error-card {
  background: white;
  border-radius: 16px;
  border: 1px solid var(--color-gray-200);
  padding: 48px;
  text-align: center;
  max-width: 400px;
}

.error-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-error-light);
  border-radius: 14px;
  color: var(--color-error);
}

.error-message {
  color: var(--color-gray-700);
  margin-bottom: 20px;
  font-size: 15px;
}

.retry-button {
  padding: 12px 24px;
  background: var(--color-primary-600);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.retry-button:hover {
  background: var(--color-primary-700);
}

/* Stock Content */
.stock-content {
  background: white;
  border-radius: 16px;
  border: 1px solid var(--color-gray-200);
  overflow: hidden;
}

.stock-header {
  padding: 32px;
  background: linear-gradient(135deg, var(--color-gray-900) 0%, var(--color-gray-800) 100%);
}

.symbol-badge {
  display: inline-block;
  font-size: 28px;
  font-weight: 700;
  color: white;
  background: var(--color-primary-600);
  padding: 8px 20px;
  border-radius: 8px;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.stock-stats {
  font-size: 14px;
  color: var(--color-gray-400);
}

/* Tab Content */
.tab-content {
  padding: 24px 32px 32px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-state,
.coming-soon-state {
  text-align: center;
  padding: 64px 24px;
  color: var(--color-gray-500);
  font-size: 14px;
}

.empty-icon,
.coming-soon-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-100);
  border-radius: 20px;
  color: var(--color-gray-400);
}

@media (max-width: 768px) {
  .stock-detail {
    padding: 24px 16px;
  }

  .stock-header {
    padding: 24px;
  }

  .symbol-badge {
    font-size: 22px;
    padding: 6px 16px;
  }

  .tab-content {
    padding: 16px;
  }

  .loading-card {
    padding: 40px 24px;
  }
}
</style>
