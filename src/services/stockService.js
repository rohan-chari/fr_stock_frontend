// Stock API Service
// This service handles all API calls related to stock data

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const stockService = {
  /**
   * Fetch stock fundamental data by symbol
   * @param {string} symbol - Stock symbol (e.g., 'AAPL')
   * @returns {Promise<Object>} Stock data
   */
  async getStockData(symbol) {
    try {
      const response = await fetch(`${API_BASE_URL}/stock/${symbol}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${symbol}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching stock data:', error)
      throw error
    }
  },

  /**
   * Search for stocks by symbol or name
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching stocks
   */
  async searchStocks(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/stock/search?q=${encodeURIComponent(query)}`)
      
      if (!response.ok) {
        throw new Error('Failed to search stocks')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error searching stocks:', error)
      throw error
    }
  },

  /**
   * Get stock fundamentals (P/E ratio, market cap, etc.)
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Fundamental data
   */
  async getStockFundamentals(symbol) {
    try {
      const response = await fetch(`${API_BASE_URL}/stock/${symbol}/fundamentals`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch fundamentals for ${symbol}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching stock fundamentals:', error)
      throw error
    }
  }
}

