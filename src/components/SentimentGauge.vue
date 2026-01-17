<template>
  <div class="sentiment-gauge">
    <div class="gauge-label">
      <span class="label-text">Community Sentiment</span>
      <span class="sentiment-value" :class="sentimentClass">{{ sentimentLabel }}</span>
    </div>
    <div class="gauge-container">
      <span class="gauge-label-end bearish-label">Bearish</span>
      <div class="gauge-track">
        <div
          class="gauge-fill-negative"
          :class="{ animated: isAnimated }"
          :style="{ width: negativeFillWidth }"
        ></div>
        <div
          class="gauge-fill-positive"
          :class="{ animated: isAnimated }"
          :style="{ width: positiveFillWidth }"
        ></div>
        <div class="gauge-center-line"></div>
      </div>
      <div class="bullish-section">
        <img src="@/assets/bull.svg" alt="Bull" class="bull-icon" />
        <span class="gauge-label-end bullish-label">Bullish</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SentimentGauge',
  props: {
    sentiment: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isAnimated: false,
      displaySentiment: 0
    }
  },
  computed: {
    normalizedSentiment() {
      return Math.max(-1, Math.min(1, this.displaySentiment))
    },
    negativeFillWidth() {
      if (this.normalizedSentiment >= 0) return '0%'
      return `${Math.abs(this.normalizedSentiment) * 50}%`
    },
    positiveFillWidth() {
      if (this.normalizedSentiment <= 0) return '0%'
      return `${this.normalizedSentiment * 50}%`
    },
    sentimentClass() {
      if (this.normalizedSentiment >= 0.1) return 'bullish'
      if (this.normalizedSentiment <= -0.1) return 'bearish'
      return 'neutral'
    },
    sentimentLabel() {
      if (this.normalizedSentiment >= 0.3) return 'Bullish'
      if (this.normalizedSentiment >= 0.1) return 'Slightly Bullish'
      if (this.normalizedSentiment <= -0.3) return 'Bearish'
      if (this.normalizedSentiment <= -0.1) return 'Slightly Bearish'
      return 'Neutral'
    }
  },
  mounted() {
    setTimeout(() => {
      this.isAnimated = true
      this.displaySentiment = this.sentiment
    }, 100)
  },
  watch: {
    sentiment(newVal) {
      this.displaySentiment = newVal
    }
  }
}
</script>

<style scoped>
.sentiment-gauge {
  padding: 20px 32px 24px;
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
}

.gauge-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.label-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sentiment-value {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

.sentiment-value.bullish {
  background: var(--color-success-light);
  color: var(--color-success);
}

.sentiment-value.bearish {
  background: var(--color-error-light);
  color: var(--color-error);
}

.sentiment-value.neutral {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.gauge-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gauge-label-end {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  flex-shrink: 0;
}

.bearish-label {
  color: var(--color-error);
}

.bullish-label {
  color: var(--color-success);
}

.bullish-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.bull-icon {
  width: 32px;
  height: 24px;
}

.gauge-track {
  flex: 1;
  height: 20px;
  background: var(--color-gray-200);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.gauge-fill-negative {
  position: absolute;
  right: 50%;
  top: 0;
  height: 100%;
  width: 0%;
  background: var(--color-error);
  border-radius: 10px 0 0 10px;
}

.gauge-fill-negative.animated {
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.gauge-fill-positive {
  position: absolute;
  left: 50%;
  top: 0;
  height: 100%;
  width: 0%;
  background: var(--color-success);
  border-radius: 0 10px 10px 0;
}

.gauge-fill-positive.animated {
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.gauge-center-line {
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: 100%;
  background: var(--color-gray-400);
  transform: translateX(-50%);
}

@media (max-width: 768px) {
  .sentiment-gauge {
    padding: 16px;
  }

  .gauge-container {
    gap: 8px;
  }

  .gauge-label-end {
    font-size: 10px;
  }

  .gauge-track {
    height: 16px;
    border-radius: 8px;
  }

  .gauge-fill-negative {
    border-radius: 8px 0 0 8px;
  }

  .gauge-fill-positive {
    border-radius: 0 8px 8px 0;
  }

  .bull-icon {
    width: 24px;
    height: 18px;
  }

  .bullish-section {
    gap: 2px;
  }
}
</style>
