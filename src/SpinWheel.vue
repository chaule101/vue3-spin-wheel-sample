<template>
  <div class="spin-wheel-container relative inline-block rounded-full bg-[#fbbf24]" :style="{ '--wheel-size': size + 'px' }">
    <svg
      :viewBox="`0 0 ${size} ${size}`"
      class="spin-wheel-svg block select-none w-full h-full"
      :class="{ spinning: isSpinning }"
      :style="{
        transform: `rotate(${rotation}deg)`,
        transition: (isSpinning || isFinalizing) ? 'none' : 'transform 0.3s ease-out'
      }"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <!-- <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3" />
        </filter> -->
        <pattern id="borderPattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 0 15 L 7.5 15 L 7.5 7.5 L 15 7.5 L 15 0 L 22.5 0 L 22.5 7.5 L 30 7.5 L 30 15 L 22.5 15 L 22.5 22.5 L 15 22.5 L 15 30 L 7.5 30 L 7.5 22.5 L 0 22.5 Z"
            fill="#4a9b8e" opacity="0.8"/>
          <path d="M 7.5 7.5 L 15 7.5 L 15 15 L 7.5 15 Z" fill="#6bb3a6" opacity="0.6"/>
          <path d="M 15 15 L 22.5 15 L 22.5 22.5 L 15 22.5 Z" fill="#6bb3a6" opacity="0.6"/>
        </pattern>
				<pattern id="goldPattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">

				<!-- Vàng nền -->
				<rect width="30" height="30" fill="#eacb64" />

				<!-- Ô vàng đậm -->
				<rect x="0" y="0" width="15" height="15" fill="#d4a93a" />
				<rect x="15" y="15" width="15" height="15" fill="#d4a93a" />

				<!-- Ô vàng sáng -->
				<rect x="7.5" y="7.5" width="15" height="15" fill="#f8e29c" />

				<!-- Ô trung gian -->
				<rect x="0" y="15" width="15" height="15" fill="#e8c45b" />
				<rect x="15" y="0" width="15" height="15" fill="#e8c45b" />

				</pattern>
      </defs>
      <g :transform="`translate(${size / 2}, ${size / 2})`">
        <g v-for="(item, index) in items" :key="index">
          <path
            :d="getSectorPath(index)"
            :fill="item.color || segmentColor"
            :stroke="borderColor"
            :stroke-width="borderWidth"
            filter="url(#shadow)"
            class="sector"
          />
          <!-- hình trong item -->
          <g v-if="item.image" :transform="getImageTransform(index)">
            <image
              :href="item.image"
              :x="-(item.imageSize || 60) / 2"
              :y="-(item.imageSize || 60) / 2"
              :width="item.imageSize || 60"
              :height="item.imageSize || 60"
              class="sector-image select-none pointer-events-none"
            />
          </g>
          <!-- text trong item -->
          <text
            text-anchor="middle"
            :transform="getTextTransform(index)"
            class="sector-text select-none pointer-events-none"
            :fill="item.textColor || textColor"
            :font-size="fontSize"
            :font-weight="fontWeight"
          >
            {{ item.label }}
          </text>
        </g>
      </g>
    </svg>
    <div class="spin-wheel-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-[#feebc2] border-2 border-[#cec19a] rounded-full p-2.5 transition-all duration-300" :style="{ padding: (size * 0.025) + 'px', '--button-size': centerButtonSize + 'px', '--button-font-size': centerButtonFontSize + 'px' }">
      <svg class="pointer arrow-up select-none pointer-events-none" viewBox="0 0 40 20" :style="{ width: (size * 0.133) + 'px', height: (size * 0.05) + 'px', maxWidth: '80px', maxHeight: '30px' }">
        <path d="M 0 20 Q 20 10, 40 20 L 20 0 Z" fill="#f00" />
      </svg>
      <button
        class="spin-button"
        @click="spin"
        :disabled="isSpinning"
      >
        <span class="spin-button-text">
          <span v-for="(line, index) in buttonTextLines" :key="index" class="spin-button-line">
            {{ line }}
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpinWheel',
  props: {
    items: {
      type: Array,
      required: true
    },
    segmentColor: {
      type: String,
      default: '#fee4a7'
    },
    size: {
      type: Number,
      default: 400
    },
    borderWidth: {
      type: Number,
      default: 1
    },
    borderColor: {
      type: String,
      default: '#d7c078'
    },
    textColor: {
      type: String,
      default: '#a88a43'
    },
    fontSize: {
      type: Number,
      default: 18
    },
    fontWeight: {
      type: [String, Number],
      default: 'bold'
    },
    spinButtonText: {
      type: String,
      default: 'SPIN'
    },
    centerButtonSize: {
      type: Number,
      default: 80
    },
    centerButtonFontSize: {
      type: Number,
      default: 16
    },
    pointerPosition: {
      type: String,
      default: 'top',
      validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
    },
    pointerColor: {
      type: String,
      default: '#ff4444'
    },
    pointerSize: {
      type: Number,
      default: 20
    },
    duration: {
      type: Number,
      default: 3000
    },
    spins: {
      type: Number,
      default: 5
    }
  },
  emits: ['spinStart', 'spinEnd'],
  data() {
    return {
      rotation: 0,
      isSpinning: false,
      serverResultId: null,
      minSpinTime: 2000,
      isFinalizing: false,
      spinningAnimationId: null,
      finalizeAnimationId: null,
      shouldStopSpinning: false
    }
  },
  computed: {
    radius() {
      return this.size / 2 - this.borderWidth
    },
    anglePerItem() {
      return 360 / this.items.length
    },
    buttonTextLines() {
      // Split by space or newline, or use the text as-is if no space
      if (this.spinButtonText.includes(' ')) {
        return this.spinButtonText.split(' ')
      } else if (this.spinButtonText.includes('\n')) {
        return this.spinButtonText.split('\n')
      }
      return [this.spinButtonText]
    },
  },
  methods: {

    getSectorPath(index) {
      const startAngle = (index * this.anglePerItem - 90) * (Math.PI / 180)
      const endAngle = ((index + 1) * this.anglePerItem - 90) * (Math.PI / 180)

      const x1 = this.radius * Math.cos(startAngle)
      const y1 = this.radius * Math.sin(startAngle)
      const x2 = this.radius * Math.cos(endAngle)
      const y2 = this.radius * Math.sin(endAngle)

      const largeArc = this.anglePerItem > 180 ? 1 : 0

      return `M 0 0 L ${x1} ${y1} A ${this.radius} ${this.radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    },

    // điều chỉnh hướng của text trong item
    getTextTransform(index) {
      const angle = (index * this.anglePerItem + this.anglePerItem / 2 - 90) * (Math.PI / 180)
      const textRadius = this.radius * 0.85
      const x = textRadius * Math.cos(angle)
      const y = textRadius * Math.sin(angle)
      const rotationAngle = index * this.anglePerItem + this.anglePerItem / 2

      return `translate(${x}, ${y}) rotate(${rotationAngle})`

      // return `translate(${x}, ${y}) rotate(${rotationAngle > 90 && rotationAngle < 270 ? rotationAngle + 180 : rotationAngle})`
    },

    // điều chỉnh hướng của hình trong item
    getImageTransform(index) {
      const angle = (index * this.anglePerItem + this.anglePerItem / 2 - 90) * (Math.PI / 180)
      const imageRadius = this.radius * 0.5
      const x = imageRadius * Math.cos(angle)
      const y = imageRadius * Math.sin(angle)
      const rotationAngle = index * this.anglePerItem + this.anglePerItem / 2
      return `translate(${x}, ${y}) rotate(${rotationAngle})`
      // return `translate(${x}, ${y}) rotate(${rotationAngle > 90 && rotationAngle < 270 ? rotationAngle + 180 : rotationAngle})`
    },

    // action bấm quay
    async spin() {
      if (this.isSpinning || this.items.length === 0) return

      // Clean up any existing animations
      if (this.spinningAnimationId) {
        cancelAnimationFrame(this.spinningAnimationId)
        this.spinningAnimationId = null
      }
      if (this.finalizeAnimationId) {
        cancelAnimationFrame(this.finalizeAnimationId)
        this.finalizeAnimationId = null
      }

      this.isSpinning = true
      this.serverResultId = null
      this.isFinalizing = false
      this.shouldStopSpinning = false

      const startTime = Date.now()
      let lastTime = startTime

      // Speed configuration - constant smooth speed
      const constantSpeed = 360 // degrees per second - constant moderate speed

      const spinningAnimation = () => {
        // Stop immediately if flagged
        if (this.shouldStopSpinning || this.isFinalizing) {
          this.spinningAnimationId = null
          return
        }

        const now = Date.now()
        const deltaTime = now - lastTime
        lastTime = now

        // Use constant speed for smooth, consistent spinning
        const rotationIncrement = (constantSpeed * deltaTime) / 1000
        this.rotation += rotationIncrement

        const elapsed = now - startTime

        // Continue spinning if no result yet or minimum time not reached
        if (!this.serverResultId || elapsed < this.minSpinTime) {
          if (!this.shouldStopSpinning && !this.isFinalizing) {
            this.spinningAnimationId = requestAnimationFrame(spinningAnimation)
          }
        } else {
          // Stop the spinning animation and start finalizing
          this.shouldStopSpinning = true
          this.spinningAnimationId = null
          // Use next frame to ensure spinning has stopped
          this.finalizeAnimationId = requestAnimationFrame(() => {
            this.finalizeSpinToResult()
          })
        }
      }

      this.spinningAnimationId = requestAnimationFrame(spinningAnimation)
      this.$emit('spinStart')
    },

    setSpinResult(itemId) {
      const resultIndex = this.items.findIndex(item => item.id === itemId)
      if (resultIndex !== -1) {
        this.serverResultId = itemId
      }
    },

    finalizeSpinToResult() {
      // prevent calling multiple times
      if (this.isFinalizing) {
        return
      }

      const resultIndex = this.items.findIndex(item => item.id === this.serverResultId)
      if (resultIndex === -1) {
        this.isSpinning = false
        this.isFinalizing = false
        return
      }

      // Mark as finalizing to prevent re-entry
      this.isFinalizing = true
      this.shouldStopSpinning = true

      // Ensure all animations are stopped
      if (this.spinningAnimationId) {
        cancelAnimationFrame(this.spinningAnimationId)
        this.spinningAnimationId = null
      }
      if (this.finalizeAnimationId) {
        cancelAnimationFrame(this.finalizeAnimationId)
        this.finalizeAnimationId = null
      }

      // Get the current rotation value (may be very large due to continuous spinning)
      const currentRotation = this.rotation

      // Calculate pointer offset based on pointer position
      // Items are measured from top (0 degrees) going clockwise
      let pointerOffset = 0
      switch (this.pointerPosition) {
        case 'top':
          pointerOffset = 0
          break
        case 'right':
          pointerOffset = 90
          break
        case 'bottom':
          pointerOffset = 180
          break
        case 'left':
          pointerOffset = 270
          break
      }

      // Calculate the target angle for the item (where the pointer should point)
      // Item at index i has center at: i * anglePerItem + anglePerItem / 2 (measured from top, clockwise)
      // To align item center with pointer, we need: (pointerOffset - itemCenterAngle) mod 360
      const itemCenterAngle = resultIndex * this.anglePerItem + this.anglePerItem / 2
      const targetAngleNormalized = ((pointerOffset - itemCenterAngle) % 360 + 360) % 360

      // Normalize current rotation to 0-360 range to calculate difference
      const currentRotationNormalized = ((currentRotation % 360) + 360) % 360

      // Calculate the difference between current and target
      let angleDifference = targetAngleNormalized - currentRotationNormalized

      // Always spin forward (positive direction)
      // If the difference is negative, add 360 to make it positive
      if (angleDifference < 0) {
        angleDifference += 360
      }

      // Add extra full rotations for natural spinning effect
      // Ensure at least 'spins' number of full rotations
      const extraRounds = this.spins
      const totalAdditionalRotation = extraRounds * 360 + angleDifference

      // Start the smooth animation to the target
      const startRotation = currentRotation
      const endRotation = startRotation + totalAdditionalRotation

      const startTime = Date.now()
      const duration = this.duration

      const animate = () => {
        // Check if we should continue (prevent race conditions)
        if (!this.isFinalizing) {
          return
        }

        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease-out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3)
        this.rotation = startRotation + (totalAdditionalRotation * easeOut)

        if (progress < 1) {
          this.finalizeAnimationId = requestAnimationFrame(animate)
        } else {
          // Animation complete
          this.rotation = endRotation
          this.isSpinning = false
          this.isFinalizing = false
          this.finalizeAnimationId = null
          this.$emit('spinEnd', this.items[resultIndex], resultIndex)
          this.serverResultId = null
        }
      }

      this.finalizeAnimationId = requestAnimationFrame(animate)
    }
  }
}
</script>

<style scoped>
.spin-wheel-container {
  /* 3 vòng bo tròn */
  box-shadow:
    0 0 0 10px #fdf3bf,
    0 0 0px 20px #01aa8d,
    0 0 0 30px #053b2b;
  /* Responsive sizing - maintain perfect circle */
  width: 100%;
  max-width: var(--wheel-size, 400px);
  aspect-ratio: 1 / 1;
  height: auto;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 768px) {
  .spin-wheel-container {
    box-shadow:
      0 0 0 5px #fdf3bf,
      0 0 0px 10px #01aa8d,
      0 0 0 15px #053b2b;
  }
}

@media (max-width: 480px) {
  .spin-wheel-container {
    box-shadow:
      0 0 0 3px #fdf3bf,
      0 0 0px 6px #01aa8d,
      0 0 0 9px #053b2b;
  }
}

.sector {
  cursor: pointer;
  transition: opacity 0.2s;
}

.spin-wheel-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.spin-button {
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  overflow: hidden;
  width: var(--button-size, 80px);
  height: var(--button-size, 80px);
  font-size: var(--button-font-size, 16px);
  min-width: 50px;
  min-height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fadd4c 0%, #fae160 50%, #fbe474 100%);
  color: #8b4513;
  cursor: pointer;
  font-weight: bold;
  border: 2px solid rgba(212, 169, 58, 0.7);
  box-shadow:
    0 4px 20px rgba(255, 215, 0, 0.5),
    inset 0 2px 10px rgba(255, 255, 255, 0.3),
    inset 0 -2px 8px rgba(212, 169, 58, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.spin-button:active {
  transform: scale(0.95);
  box-shadow:
    inset 0 2px 8px rgba(212, 169, 58, 0.3),
    inset 0 -2px 6px rgba(212, 169, 58, 0.2);
}

.spin-button:disabled {
  cursor: not-allowed;
}

.arrow-up {
  position: absolute;
  bottom: calc(100% - 6px);
  left: 50%;
  transform: translateX(-50%);
}

/* Responsive font sizes for text and button */
@media (max-width: 768px) {
  .sector-text {
    font-size: 0.9em !important;
  }

  .spin-button {
    font-size: 0.9em !important;
  }
}

@media (max-width: 480px) {
  .sector-text {
    font-size: 0.75em !important;
  }

  .spin-button {
    font-size: 0.8em !important;
  }

  .spin-wheel-center {
    padding: 8px !important;
  }
}
</style>

