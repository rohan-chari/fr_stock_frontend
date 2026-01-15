<template>
  <div class="sentiment-gauge">
    <div class="gauge-label">
      <span class="label-text">Community Sentiment</span>
      <span class="sentiment-value" :class="sentimentClass">{{ sentimentLabel }}</span>
    </div>
    <div class="gauge-container">
      <div class="bear-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="none"/>
          <circle cx="6" cy="6" r="2.5"/>
          <circle cx="18" cy="6" r="2.5"/>
          <ellipse cx="12" cy="14" rx="8" ry="7"/>
          <circle cx="8.5" cy="12" r="1.5" fill="white"/>
          <circle cx="15.5" cy="12" r="1.5" fill="white"/>
          <ellipse cx="12" cy="16" rx="3" ry="1.5" fill="#1f2937"/>
          <path d="M9 14.5 Q12 13 15 14.5" stroke="#1f2937" stroke-width="1.5" fill="none"/>
        </svg>
      </div>
      <div class="gauge-track">
        <div class="gauge-fill-negative" :style="{ width: negativeFillWidth }"></div>
        <div class="gauge-fill-positive" :style="{ width: positiveFillWidth }"></div>
        <div class="gauge-center"></div>
        <div
          class="gauge-indicator"
          :style="{ left: indicatorPosition }"
          :class="{ animated: isAnimated }"
        >
          <div class="indicator-dot"></div>
        </div>
      </div>
      <div class="bull-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 8 L5 4 L7 7" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M22 8 L19 4 L17 7" stroke="currentColor" stroke-width="2" fill="none"/>
          <ellipse cx="12" cy="14" rx="8" ry="7"/>
          <circle cx="8.5" cy="12" r="1.5" fill="white"/>
          <circle cx="15.5" cy="12" r="1.5" fill="white"/>
          <ellipse cx="12" cy="17" rx="2.5" ry="1.5" fill="#f8fafc"/>
          <circle cx="11" cy="17" r="0.5" fill="#1f2937"/>
          <circle cx="13" cy="17" r="0.5" fill="#1f2937"/>
        </svg>
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
    indicatorPosition() {
      const percentage = ((this.normalizedSentiment + 1) / 2) * 100
      return `${percentage}%`
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
  margin-bottom: 14px;
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
  gap: 16px;
}

.bear-icon {
  color: var(--color-error);
  flex-shrink: 0;
  opacity: 0.9;
}

.bull-icon {
  color: var(--color-success);
  flex-shrink: 0;
  opacity: 0.9;
}

.gauge-track {
  flex: 1;
  height: 8px;
  background: var(--color-gray-200);
  border-radius: 4px;
  position: relative;
  overflow: visible;
}

.gauge-fill-negative {
  position: absolute;
  right: 50%;
  top: 0;
  height: 100%;
  background: linear-gradient(to left, var(--color-gray-200), var(--color-error));
  border-radius: 4px 0 0 4px;
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.gauge-fill-positive {
  position: absolute;
  left: 50%;
  top: 0;
  height: 100%;
  background: linear-gradient(to right, var(--color-gray-200), var(--color-success));
  border-radius: 0 4px 4px 0;
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.gauge-center {
  position: absolute;
  left: 50%;
  top: -4px;
  width: 2px;
  height: 16px;
  background: var(--color-gray-400);
  transform: translateX(-50%);
  border-radius: 1px;
}

.gauge-indicator {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: none;
}

.gauge-indicator.animated {
  transition: left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.indicator-dot {
  width: 20px;
  height: 20px;
  background: white;
  border: 3px solid var(--color-primary-500);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .sentiment-gauge {
    padding: 16px;
  }

  .gauge-container {
    gap: 12px;
  }

  .bear-icon svg,
  .bull-icon svg {
    width: 24px;
    height: 24px;
  }
}
</style>
