// Admin API Service
// This service handles all API calls related to admin functionality

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const adminService = {
  /**
   * Fetch all stocks with their subreddit assignments
   * @returns {Promise<Object>} Object containing stocks array
   */
  async getStocks() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stocks`)

      if (!response.ok) {
        throw new Error('Failed to fetch admin stocks')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching admin stocks:', error)
      throw error
    }
  },

  /**
   * Update a stock's official subreddit
   * @param {string} symbol - Stock symbol (e.g., 'NVDA')
   * @param {string|null} officialSubreddit - Subreddit name or null to clear
   * @returns {Promise<Object>} Updated stock info
   */
  async updateStockSubreddit(symbol, officialSubreddit) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stocks/${symbol}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ officialSubreddit })
      })

      if (!response.ok) {
        throw new Error(`Failed to update subreddit for ${symbol}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating stock subreddit:', error)
      throw error
    }
  }
}
