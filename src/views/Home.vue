<template>
  <div class="home-container">
    <div class="search-container">
      <h1 class="title">Stock Fundamental Research</h1>
      <SearchBar 
        :searchResults="searchResults" 
        :loading="loading"
        @search="handleSearch"
        @select="handleStockSelect"
      />
      <div v-if="error" class="error">{{ error }}</div>
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
        const response = await stockService.searchStocks(query.trim())
        // Handle the API response structure with result array
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

.error {
  margin-top: 20px;
  color: #dc2626;
  font-size: 16px;
  padding: 12px;
  background: #fee2e2;
  border-radius: 8px;
}
</style>

