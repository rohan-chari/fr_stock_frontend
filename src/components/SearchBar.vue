<template>
  <div class="search-wrapper" ref="searchWrapper">
    <div class="search-box" :class="{ 'search-box-focused': isFocused }">
      <div class="search-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      </div>
      <input
        type="text"
        v-model="localQuery"
        @focus="isFocused = true"
        @blur="handleBlur"
        @keydown.down.prevent="navigateDown"
        @keydown.up.prevent="navigateUp"
        @keydown.enter.prevent="selectHighlighted"
        placeholder="Search by symbol or company name..."
        class="search-input"
      />
    </div>
    <div
      v-if="showDropdown && (searchResults.length > 0 || loading)"
      class="dropdown"
    >
      <div v-if="loading" class="dropdown-item loading-item">
        <div class="loading-dot"></div>
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
      this.highlightedIndex = -1

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }

      this.debounceTimer = setTimeout(() => {
        this.$emit('search', newValue)
      }, 300)
    },
    searchResults() {
      this.highlightedIndex = -1
    }
  },
  methods: {
    handleBlur() {
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
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 4px;
  box-shadow: var(--shadow-lg);
  border: 2px solid transparent;
  transition: all 0.2s;
}

.search-box-focused {
  border-color: var(--color-primary-400);
  box-shadow: var(--shadow-lg), 0 0 0 4px var(--color-primary-100);
}

.search-icon {
  padding: 12px 8px 12px 16px;
  color: var(--color-gray-400);
}

.search-input {
  flex: 1;
  padding: 16px 20px 16px 8px;
  font-size: 16px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-gray-900);
}

.search-input::placeholder {
  color: var(--color-gray-400);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-gray-200);
  max-height: 320px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.1s;
  border-bottom: 1px solid var(--color-gray-100);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover,
.dropdown-item.highlighted {
  background-color: var(--color-primary-50);
}

.dropdown-item.loading-item {
  cursor: default;
  color: var(--color-gray-500);
  justify-content: center;
}

.loading-dot {
  width: 8px;
  height: 8px;
  background: var(--color-primary-500);
  border-radius: 50%;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.stock-symbol {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-gray-900);
  min-width: 70px;
  flex-shrink: 0;
}

.stock-description {
  font-size: 13px;
  color: var(--color-gray-600);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stock-type {
  font-size: 11px;
  color: var(--color-primary-600);
  background: var(--color-primary-50);
  padding: 3px 8px;
  border-radius: 4px;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 500;
}

/* Scrollbar styling */
.dropdown::-webkit-scrollbar {
  width: 8px;
}

.dropdown::-webkit-scrollbar-track {
  background: var(--color-gray-100);
  border-radius: 4px;
}

.dropdown::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: 4px;
}

.dropdown::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-400);
}
</style>
