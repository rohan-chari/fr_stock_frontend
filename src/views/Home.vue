<template>
  <div class="home">
    <section class="hero">
      <div class="hero-background"></div>
      <div class="hero-content">
        <div class="hero-badge">Stock Research Platform</div>
        <h1 class="hero-title">Make Informed Investment Decisions</h1>
        <p class="hero-subtitle">
          Access real-time sentiment analysis and community discussions from Reddit, Twitter, and more.
        </p>
        <div class="search-section">
          <SearchBar
            :searchResults="searchResults"
            :loading="loading"
            @search="handleSearch"
            @select="handleStockSelect"
          />
          <p class="search-hint">Try searching for AAPL, TSLA, or NVDA</p>
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </section>

    <section class="features">
      <div class="features-header">
        <h2 class="features-title">Research Tools</h2>
        <p class="features-subtitle">Everything you need to analyze market sentiment</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </div>
          <h3 class="feature-title">Community Sentiment</h3>
          <p class="feature-description">Aggregate opinions from Reddit discussions with AI-powered sentiment analysis.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon icon-green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="M18 9l-5 5-4-4-3 3"/>
            </svg>
          </div>
          <h3 class="feature-title">Trend Analysis</h3>
          <p class="feature-description">Track how sentiment changes over time and spot emerging trends early.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon icon-orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h3 class="feature-title">Real-Time Updates</h3>
          <p class="feature-description">Fresh data from multiple sources, updated continuously throughout the day.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import { stockService } from '../services/stockService'

export default {
  name: 'Home',
  components: {
    SearchBar
  },
  data() {
    return {
      searchResults: [],
      loading: false,
      error: null
    }
  },
  methods: {
    async handleSearch(query) {
      if (!query || !query.trim()) {
        this.searchResults = []
        return
      }

      this.loading = true
      this.error = null
      this.searchResults = []

      try {
        const response = await stockService.searchStocks(query.trim())
        this.searchResults = response.result || response || []
      } catch (error) {
        this.error = 'Failed to search stocks. Please try again.'
        console.error('Search error:', error)
        this.searchResults = []
      } finally {
        this.loading = false
      }
    },
    handleStockSelect(stock) {
      const symbol = stock.symbol || stock.displaySymbol
      if (symbol && symbol.trim()) {
        this.$router.push({ name: 'StockDetail', params: { symbol: symbol.toUpperCase().trim() } })
      }
    }
  }
}
</script>

<style scoped>
.home {
  min-height: calc(100vh - 64px);
}

.hero {
  position: relative;
  padding: 80px 24px 100px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-gray-900) 0%, var(--color-gray-800) 50%, var(--color-primary-700) 100%);
}

.hero-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 70% 20%, var(--color-primary-600) 0%, transparent 50%);
  opacity: 0.3;
}

.hero-content {
  position: relative;
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary-300);
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: white;
  line-height: 1.1;
  margin-bottom: 20px;
  letter-spacing: -0.03em;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--color-gray-400);
  line-height: 1.6;
  margin-bottom: 40px;
}

.search-section {
  margin-bottom: 16px;
}

.search-hint {
  margin-top: 16px;
  font-size: 13px;
  color: var(--color-gray-500);
}

.error-message {
  margin-top: 16px;
  padding: 12px 16px;
  background: var(--color-error-light);
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: var(--color-error);
  font-size: 14px;
}

.features {
  padding: 80px 24px;
  background: white;
}

.features-header {
  text-align: center;
  margin-bottom: 48px;
}

.features-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 12px;
}

.features-subtitle {
  font-size: 16px;
  color: var(--color-gray-500);
}

.features-grid {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  padding: 32px 28px;
  border-radius: 16px;
  border: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);
  transition: all 0.2s ease;
}

.feature-card:hover {
  border-color: var(--color-primary-200);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.feature-icon {
  width: 52px;
  height: 52px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-100);
  border-radius: 12px;
  color: var(--color-primary-600);
}

.feature-icon.icon-green {
  background: var(--color-success-light);
  color: var(--color-success);
}

.feature-icon.icon-orange {
  background: #ffedd5;
  color: #ea580c;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 10px;
}

.feature-description {
  font-size: 14px;
  color: var(--color-gray-500);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero {
    padding: 48px 20px 64px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .features {
    padding: 48px 20px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .feature-card {
    padding: 24px;
  }
}
</style>
