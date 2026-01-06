<template>
  <div class="search-wrapper" ref="searchWrapper">
    <div class="search-box" :class="{ 'search-box-focused': isFocused }">
      <input 
        type="text" 
        v-model="localQuery" 
        @focus="isFocused = true"
        @blur="handleBlur"
        @keydown.down.prevent="navigateDown"
        @keydown.up.prevent="navigateUp"
        @keydown.enter.prevent="selectHighlighted"
        placeholder="Enter stock symbol (e.g., AAPL, MSFT, TSLA)"
        class="search-input"
      />
    </div>
    <div 
      v-if="showDropdown && (searchResults.length > 0 || loading)" 
      class="dropdown"
    >
      <div v-if="loading" class="dropdown-item loading-item">
        <span>Searching...</span>
      </div>
      <div
        v-for="(stock, index) in searchResults"
        :key="stock.symbol"
        class="dropdown-item"
        :class="{ 'highlighted': index === highlightedIndex }"
        @mouseenter="highlightedIndex = index"
        @mousedown.prevent="selectStock(stock)"
      >
        <span class="stock-symbol">{{ stock.displaySymbol || stock.symbol }}</span>
        <span class="stock-description">{{ stock.description }}</span>
        <span class="stock-type">{{ stock.type }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    searchResults: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localQuery: '',
      debounceTimer: null,
      isFocused: false,
      highlightedIndex: -1,
      blurTimeout: null
    }
  },
  computed: {
    showDropdown() {
      return this.isFocused && (this.localQuery.trim().length > 0 || this.searchResults.length > 0)
    }
  },
  watch: {
    localQuery(newValue) {
      // Reset highlighted index when query changes
      this.highlightedIndex = -1
      
      // Clear existing timer
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }
      
      // Set new timer to debounce the search
      this.debounceTimer = setTimeout(() => {
        this.$emit('search', newValue)
      }, 300) // 300ms debounce delay
    },
    searchResults() {
      // Reset highlighted index when results change
      this.highlightedIndex = -1
    }
  },
  methods: {
    handleBlur() {
      // Delay hiding dropdown to allow click events to fire
      this.blurTimeout = setTimeout(() => {
        this.isFocused = false
      }, 200)
    },
    navigateDown() {
      if (this.searchResults.length > 0) {
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.searchResults.length - 1)
      }
    },
    navigateUp() {
      if (this.searchResults.length > 0) {
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1)
      }
    },
    selectHighlighted() {
      if (this.highlightedIndex >= 0 && this.highlightedIndex < this.searchResults.length) {
        this.selectStock(this.searchResults[this.highlightedIndex])
      }
    },
    selectStock(stock) {
      this.localQuery = ''
      this.isFocused = false
      this.$emit('select', stock)
    }
  },
  beforeUnmount() {
    // Clean up timers on component destruction
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    if (this.blurTimeout) {
      clearTimeout(this.blurTimeout)
    }
  }
}
</script>

<style scoped>
.search-wrapper {
  position: relative;
  width: 100%;
}

.search-box {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
}

.search-box-focused {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-color: #2563eb;
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

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.1s;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover,
.dropdown-item.highlighted {
  background-color: #f5f5f5;
}

.dropdown-item.loading-item {
  cursor: default;
  color: #666;
  justify-content: center;
}

.stock-symbol {
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
  min-width: 60px;
  flex-shrink: 0;
}

.stock-description {
  font-size: 13px;
  color: #666;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stock-type {
  font-size: 11px;
  color: #999;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* Scrollbar styling */
.dropdown::-webkit-scrollbar {
  width: 8px;
}

.dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dropdown::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.dropdown::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

