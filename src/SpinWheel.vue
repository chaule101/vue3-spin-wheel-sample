<template>
  <div class="spin-wheel-container" :style="{ width: size + 'px', height: size + 'px' }">
    <svg
      :width="size"
      :height="size"
      class="spin-wheel-svg"
      :class="{ spinning: isSpinning }"
      :style="{
        transform: `rotate(${rotation}deg)`,
        transition: (isSpinning || isFinalizing) ? 'none' : 'transform 0.3s ease-out'
      }"
    >
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3" />
        </filter>
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
            :fill="item.color || getDefaultColor(index)"
            :stroke="borderColor"
            :stroke-width="borderWidth"
            filter="url(#shadow)"
            class="sector"
          />
          <!-- Image in sector -->
          <g v-if="item.image" :transform="getImageTransform(index)">
            <image
              :href="item.image"
              :x="-(item.imageSize || 60) / 2"
              :y="-(item.imageSize || 60) / 2"
              :width="item.imageSize || 60"
              :height="item.imageSize || 60"
              class="sector-image"
            />
          </g>
          <!-- Text label -->
          <text
            text-anchor="middle"
            :transform="getTextTransform(index)"
            class="sector-text"
            :fill="item.textColor || textColor"
            :font-size="fontSize"
            :font-weight="fontWeight"
          >
            {{ item.label }}
          </text>
        </g>
      </g>
    </svg>
    <div class="spin-wheel-center" v-if="showCenterButton">
      <button
        class="spin-button"
        @click="spin"
        :disabled="isSpinning"
        :style="{
          width: centerButtonSize + 'px',
          height: centerButtonSize + 'px',
          fontSize: centerButtonFontSize + 'px'
        }"
      >
        {{ spinButtonText }}
      </button>
    </div>
    <div class="pointer" :style="pointerStyle"></div>
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
    size: {
      type: Number,
      default: 400
    },
    borderWidth: {
      type: Number,
      default: 2
    },
    borderColor: {
      type: String,
      default: '#ffffff'
    },
    textColor: {
      type: String,
      default: '#000000'
    },
    fontSize: {
      type: Number,
      default: 14
    },
    fontWeight: {
      type: [String, Number],
      default: 'bold'
    },
    showCenterButton: {
      type: Boolean,
      default: true
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
    pointerStyle() {
      const position = this.pointerPosition
      const size = this.pointerSize
      const color = this.pointerColor
      const center = this.size / 2

      let style = {
        position: 'absolute',
        width: '0',
        height: '0',
        borderStyle: 'solid',
        zIndex: '10'
      }

      switch (position) {
        case 'top':
          style.left = center - size + 'px'
          style.top = '0px'
          style.borderWidth = `0 ${size}px ${size * 1.5}px ${size}px`
          style.borderColor = `transparent transparent ${color} transparent`
          break
        case 'bottom':
          style.left = center - size + 'px'
          style.bottom = '0px'
          style.borderWidth = `${size * 1.5}px ${size}px 0 ${size}px`
          style.borderColor = `${color} transparent transparent transparent`
          break
        case 'left':
          style.left = '0px'
          style.top = center - size + 'px'
          style.borderWidth = `${size}px ${size * 1.5}px ${size}px 0`
          style.borderColor = `transparent ${color} transparent transparent`
          break
        case 'right':
          style.right = '0px'
          style.top = center - size + 'px'
          style.borderWidth = `${size}px 0 ${size}px ${size * 1.5}px`
          style.borderColor = `transparent transparent transparent ${color}`
          break
      }

      return style
    }
  },
  methods: {
    getDefaultColor(index) {
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#F8B739', '#95A5A6', '#E74C3C', '#3498DB'
      ]
      return colors[index % colors.length]
    },
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
    getTextTransform(index) {
      const angle = (index * this.anglePerItem + this.anglePerItem / 2 - 90) * (Math.PI / 180)
      const textRadius = this.radius * 0.85
      const x = textRadius * Math.cos(angle)
      const y = textRadius * Math.sin(angle)
      const rotationAngle = index * this.anglePerItem + this.anglePerItem / 2

      return `translate(${x}, ${y}) rotate(${rotationAngle > 90 && rotationAngle < 270 ? rotationAngle + 180 : rotationAngle})`
    },
    getImageTransform(index) {
      const angle = (index * this.anglePerItem + this.anglePerItem / 2 - 90) * (Math.PI / 180)
      const imageRadius = this.radius * 0.5
      const x = imageRadius * Math.cos(angle)
      const y = imageRadius * Math.sin(angle)
      const rotationAngle = index * this.anglePerItem + this.anglePerItem / 2

      return `translate(${x}, ${y}) rotate(${rotationAngle > 90 && rotationAngle < 270 ? rotationAngle + 180 : rotationAngle})`
    },
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
  position: relative;
  display: inline-block;
  width: 350px;
  height: 350px;
  border-radius: 50%;
  background-color: #fbbf24; /* Match the yellow border to fill any gaps */

  /* Three circular borders: black (outer), green (middle), yellow (inner) */
  box-shadow:
    0 0 0 10px #fbbf24,       /* Black border - outermost */
    0 0 0 20px #335D6B,       /* Green border - middle */
    0 0 0 30px #2C434D;       /* Yellow border - innermost */
}

.spin-wheel-svg {
  display: block;
  user-select: none;
}

.sector {
  cursor: pointer;
  transition: opacity 0.2s;
}

.sector:hover {
  opacity: 0.8;
}

.sector-text {
  pointer-events: none;
  user-select: none;
}

.sector-image {
  pointer-events: none;
  user-select: none;
}

.decorative-border {
  pointer-events: none;
}

.spin-wheel-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.spin-button {
  border-radius: 50%;
  border: 4px solid #ffffff;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  color: #8b4513;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.spin-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.spin-button:active:not(:disabled) {
  transform: scale(0.95);
}

.spin-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pointer {
  pointer-events: none;
}
</style>

