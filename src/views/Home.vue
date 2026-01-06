<template>
  <div class="home-container">
    <div class="search-container">
      <h1 class="title">Stock Fundamental Research</h1>
      <SearchBar @search="handleSearch" />
      <div v-if="loading" class="loading">Searching...</div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="searchResults && searchResults.length > 0" class="search-results">
        <div 
          v-for="stock in searchResults" 
          :key="stock.symbol" 
          class="stock-result"
          @click="selectStock(stock.symbol)"
        >
          <div class="stock-symbol">{{ stock.symbol }}</div>
          <div class="stock-name">{{ stock.name || stock.symbol }}</div>
        </div>
      </div>
    </div>
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
        const results = await stockService.searchStocks(query.trim())
        this.searchResults = results
      } catch (error) {
        this.error = 'Failed to search stocks. Please try again.'
        console.error('Search error:', error)
      } finally {
        this.loading = false
      }
    },
    selectStock(symbol) {
      if (symbol && symbol.trim()) {
        this.$router.push({ name: 'StockDetail', params: { symbol: symbol.toUpperCase().trim() } })
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.search-container {
  width: 100%;
  max-width: 700px;
  text-align: center;
}

.title {
  color: #1a1a1a;
  font-size: 2.5em;
  margin-bottom: 40px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.loading {
  margin-top: 20px;
  color: #666;
  font-size: 16px;
}

.error {
  margin-top: 20px;
  color: #dc2626;
  font-size: 16px;
  padding: 12px;
  background: #fee2e2;
  border-radius: 8px;
}

.search-results {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.stock-result {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stock-result:hover {
  background: #f3f4f6;
  border-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stock-symbol {
  font-weight: 600;
  font-size: 18px;
  color: #1a1a1a;
}

.stock-name {
  font-size: 14px;
  color: #666;
}
</style>

