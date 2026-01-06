<template>
  <div class="stock-detail-container">
    <div class="header">
      <button @click="goBack" class="back-button">← Back</button>
      <h1 class="stock-symbol">{{ symbol }}</h1>
    </div>
    
    <div v-if="loading" class="loading">Loading stock data...</div>
    
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="stockData" class="stock-content">
      <div class="stock-info">
        <h2>{{ stockData.name || symbol }}</h2>
        <p class="stock-description">Stock fundamental data will be displayed here</p>
        <!-- Stock data will be rendered here -->
      </div>
    </div>
  </div>
</template>

<script>
import { stockService } from '../services/stockService'

export default {
  name: 'StockDetail',
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
      stockData: null
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
    },
    goBack() {
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>

<style scoped>
.stock-detail-container {
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.back-button {
  padding: 10px 20px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.back-button:hover {
  background: #e0e0e0;
}

.stock-symbol {
  color: #1a1a1a;
  font-size: 2em;
  font-weight: 700;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #dc2626;
}

.stock-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stock-info h2 {
  color: #1a1a1a;
  font-size: 1.8em;
  margin-bottom: 10px;
}

.stock-description {
  color: #666;
  font-size: 16px;
}
</style>

