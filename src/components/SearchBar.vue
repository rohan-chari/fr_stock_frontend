<template>
  <div class="search-box">
    <input 
      type="text" 
      v-model="localQuery" 
      @keyup.enter="handleSearch"
      placeholder="Enter stock symbol (e.g., AAPL, MSFT, TSLA)"
      class="search-input"
    />
    <button @click="handleSearch" class="search-button">Search</button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      localQuery: ''
    }
  },
  methods: {
    handleSearch() {
      if (this.localQuery.trim()) {
        this.$emit('search', this.localQuery)
        this.localQuery = ''
      }
    }
  }
}
</script>

<style scoped>
.search-box {
  display: flex;
  gap: 12px;
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.search-input {
  flex: 1;
  padding: 16px 20px;
  font-size: 16px;
  border: none;
  outline: none;
  background: transparent;
  color: #1a1a1a;
}

.search-input::placeholder {
  color: #999;
}

.search-button {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-button:hover {
  background: #1d4ed8;
}

.search-button:active {
  background: #1e40af;
}
</style>

