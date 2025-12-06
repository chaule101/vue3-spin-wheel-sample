# Usage Guide - Like vue3-easy-data-table

## Installation

```bash
npm install vue3-spin-wheel
```

## Quick Start

### 1. Import the Component

```vue
<script setup>
import { SpinWheel } from 'vue3-spin-wheel'
import 'vue3-spin-wheel/dist/style.css'
</script>
```

### 2. Use in Template

```vue
<template>
  <SpinWheel
    ref="spinWheel"
    :items="items"
    :size="600"
    @spin-start="handleSpinStart"
    @spin-end="handleSpinEnd"
  />
</template>
```

### 3. Complete Example

```vue
<template>
  <div class="container">
    <SpinWheel
      ref="spinWheel"
      :items="wheelItems"
      :size="600"
      :duration="4000"
      :spins="8"
      pointerPosition="top"
      :pointerColor="'#ff0000'"
      :showCenterButton="true"
      spinButtonText="SPIN"
      @spin-start="onSpinStart"
      @spin-end="onSpinEnd"
    />

    <div v-if="selectedItem && !isSpinning" class="result">
      🎉 Winner: {{ selectedItem.label }} 🎉
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SpinWheel } from 'vue3-spin-wheel'
import 'vue3-spin-wheel/dist/style.css'

const spinWheel = ref(null)
const isSpinning = ref(false)
const selectedItem = ref(null)

const wheelItems = [
  { id: 1, label: 'Prize 1', color: '#FF6B6B' },
  { id: 2, label: 'Prize 2', color: '#4ECDC4' },
  { id: 3, label: 'Prize 3', color: '#45B7D1' },
  { id: 4, label: 'Prize 4', color: '#FFA07A' },
  { id: 5, label: 'Prize 5', color: '#98D8C8' },
  { id: 6, label: 'Prize 6', color: '#F7DC6F' },
]

const onSpinStart = async () => {
  isSpinning.value = true
  selectedItem.value = null

  // Simulate API call
  try {
    const response = await fetch('/api/spin')
    const data = await response.json()

    // Set the result - wheel will spin to this item
    spinWheel.value.setSpinResult(data.itemId)
  } catch (error) {
    console.error('Error:', error)
    isSpinning.value = false
  }
}

const onSpinEnd = (item, index) => {
  isSpinning.value = false
  selectedItem.value = item
  console.log('Selected item:', item, 'at index:', index)
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.result {
  margin-top: 20px;
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  font-size: 24px;
  font-weight: bold;
}
</style>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | Array | required | Array of items to display on wheel |
| `size` | Number | 400 | Size of wheel in pixels |
| `duration` | Number | 3000 | Animation duration (ms) |
| `spins` | Number | 5 | Number of extra rotations |
| `pointerPosition` | String | 'top' | Pointer position: 'top', 'bottom', 'left', 'right' |
| `pointerColor` | String | '#ff4444' | Color of pointer |
| `pointerSize` | Number | 20 | Size of pointer |
| `showCenterButton` | Boolean | true | Show center spin button |
| `spinButtonText` | String | 'SPIN' | Text on spin button |
| `centerButtonSize` | Number | 80 | Size of center button |
| `borderWidth` | Number | 2 | Border width |
| `borderColor` | String | '#ffffff' | Border color |
| `textColor` | String | '#000000' | Text color |
| `fontSize` | Number | 14 | Font size |

## Events

- `@spin-start`: Emitted when spin starts
- `@spin-end(item, index)`: Emitted when spin ends with selected item and index

## Methods

- `spin()`: Start spinning programmatically
- `setSpinResult(itemId)`: Set the result from API/server

## Item Format

```typescript
interface SpinWheelItem {
  id: number | string      // Required: unique identifier
  label: string            // Required: text to display
  color?: string           // Optional: background color
  textColor?: string       // Optional: text color
  image?: string           // Optional: image URL
  imageSize?: number       // Optional: image size
  value?: any              // Optional: custom value
}
```

## Notes

- Always import the CSS: `import 'vue3-spin-wheel/dist/style.css'`
- Use `ref` to access component methods
- Call `setSpinResult(itemId)` when your API returns the result
- The wheel will automatically spin to the correct item

