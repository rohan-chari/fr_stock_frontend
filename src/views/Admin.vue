<template>
  <div class="admin">
    <div class="admin-header">
      <h1 class="admin-title">Admin Dashboard</h1>
      <p class="admin-subtitle">Manage stock subreddit assignments</p>
    </div>

    <div class="admin-content">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading stocks...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p class="error-message">{{ error }}</p>
        <button class="retry-button" @click="fetchStocks">Retry</button>
      </div>

      <div v-else class="stocks-table-container">
        <table class="stocks-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Description</th>
              <th>Type</th>
              <th>Official Subreddit</th>
              <th>Post Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stock in stocks" :key="stock.id">
              <td>
                <span class="symbol-badge">{{ stock.symbol }}</span>
              </td>
              <td class="description-cell">{{ stock.description }}</td>
              <td>{{ stock.type }}</td>
              <td>
                <span v-if="stock.officialSubreddit" class="subreddit-badge">
                  r/{{ stock.officialSubreddit }}
                </span>
                <span v-else class="no-subreddit">Not assigned</span>
              </td>
              <td>{{ stock.postCount || 0 }}</td>
              <td>
                <button
                  class="edit-button"
                  @click="openEditModal(stock)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="stocks.length === 0" class="empty-state">
          <p>No stocks found</p>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editModalOpen" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Edit Subreddit Assignment</h2>
          <button class="modal-close" @click="closeEditModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Stock</label>
            <div class="stock-info">
              <span class="symbol-badge">{{ editingStock.symbol }}</span>
              <span class="stock-description">{{ editingStock.description }}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="subreddit-input">Official Subreddit</label>
            <div class="input-wrapper">
              <span class="input-prefix">r/</span>
              <input
                id="subreddit-input"
                v-model="editSubreddit"
                type="text"
                class="form-input"
                placeholder="Enter subreddit name"
              />
            </div>
            <p class="form-hint">Leave empty to clear the assignment</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="button-secondary" @click="closeEditModal">Cancel</button>
          <button
            class="button-primary"
            :disabled="saving"
            @click="saveSubreddit"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { adminService } from '../services/adminService'

export default {
  name: 'Admin',
  data() {
    return {
      stocks: [],
      loading: true,
      error: null,
      editModalOpen: false,
      editingStock: null,
      editSubreddit: '',
      saving: false
    }
  },
  mounted() {
    this.fetchStocks()
  },
  methods: {
    async fetchStocks() {
      this.loading = true
      this.error = null

      try {
        const response = await adminService.getStocks()
        this.stocks = response.stocks || []
      } catch (error) {
        this.error = 'Failed to load stocks. Please try again.'
        console.error('Error fetching stocks:', error)
      } finally {
        this.loading = false
      }
    },
    openEditModal(stock) {
      this.editingStock = stock
      this.editSubreddit = stock.officialSubreddit || ''
      this.editModalOpen = true
    },
    closeEditModal() {
      this.editModalOpen = false
      this.editingStock = null
      this.editSubreddit = ''
    },
    async saveSubreddit() {
      this.saving = true

      try {
        const subredditValue = this.editSubreddit.trim() || null
        await adminService.updateStockSubreddit(this.editingStock.symbol, subredditValue)

        // Update local state
        const stockIndex = this.stocks.findIndex(s => s.id === this.editingStock.id)
        if (stockIndex !== -1) {
          this.stocks[stockIndex].officialSubreddit = subredditValue
        }

        this.closeEditModal()
      } catch (error) {
        console.error('Error saving subreddit:', error)
        alert('Failed to update subreddit. Please try again.')
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.admin {
  min-height: calc(100vh - 64px);
  background: var(--color-gray-100);
  padding: 32px 24px;
}

.admin-header {
  max-width: 1200px;
  margin: 0 auto 32px;
}

.admin-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 8px;
}

.admin-subtitle {
  font-size: 16px;
  color: var(--color-gray-500);
}

.admin-content {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-gray-200);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  width: 48px;
  height: 48px;
  background: var(--color-error-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-error);
  margin-bottom: 16px;
}

.error-message {
  color: var(--color-gray-600);
  margin-bottom: 16px;
}

.retry-button {
  padding: 10px 20px;
  background: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.retry-button:hover {
  background: var(--color-primary-600);
}

.stocks-table-container {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--color-gray-200);
  overflow: hidden;
}

.stocks-table {
  width: 100%;
  border-collapse: collapse;
}

.stocks-table th,
.stocks-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-gray-100);
}

.stocks-table th {
  background: var(--color-gray-50);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stocks-table td {
  font-size: 14px;
  color: var(--color-gray-700);
}

.stocks-table tbody tr:hover {
  background: var(--color-gray-50);
}

.stocks-table tbody tr:last-child td {
  border-bottom: none;
}

.symbol-badge {
  display: inline-block;
  padding: 4px 10px;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.description-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subreddit-badge {
  display: inline-block;
  padding: 4px 10px;
  background: var(--color-success-light);
  color: var(--color-success);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.no-subreddit {
  color: var(--color-gray-400);
  font-style: italic;
}

.edit-button {
  padding: 6px 14px;
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-200);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.edit-button:hover {
  background: var(--color-gray-200);
  border-color: var(--color-gray-300);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 24px;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-gray-200);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-gray-900);
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--color-gray-400);
  cursor: pointer;
  transition: all 0.15s;
}

.modal-close:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-gray-700);
  margin-bottom: 8px;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stock-description {
  color: var(--color-gray-600);
  font-size: 14px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.15s;
}

.input-wrapper:focus-within {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.input-prefix {
  padding: 10px 0 10px 12px;
  background: var(--color-gray-50);
  color: var(--color-gray-500);
  font-size: 14px;
}

.form-input {
  flex: 1;
  padding: 10px 12px;
  border: none;
  font-size: 14px;
  outline: none;
}

.form-hint {
  margin-top: 6px;
  font-size: 13px;
  color: var(--color-gray-400);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);
  border-radius: 0 0 16px 16px;
}

.button-secondary {
  padding: 10px 18px;
  background: white;
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.button-secondary:hover {
  background: var(--color-gray-50);
  border-color: var(--color-gray-400);
}

.button-primary {
  padding: 10px 18px;
  background: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.button-primary:hover {
  background: var(--color-primary-600);
}

.button-primary:disabled {
  background: var(--color-gray-300);
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .admin {
    padding: 24px 16px;
  }

  .admin-title {
    font-size: 24px;
  }

  .stocks-table-container {
    overflow-x: auto;
  }

  .stocks-table {
    min-width: 600px;
  }

  .modal {
    max-width: 100%;
  }
}
</style>
