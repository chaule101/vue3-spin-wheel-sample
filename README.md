# vue3-spin-wheel-sample

A customizable spin wheel component for Vue 3.

## Installation

```bash
npm install vue3-spin-wheel
```

## Usage

### Basic Usage

```vue
<template>
  <SpinWheel
    :items="items"
    :size="600"
    @spin-start="handleSpinStart"
    @spin-end="handleSpinEnd"
  />
</template>

<script setup>
import { SpinWheel } from 'vue3-spin-wheel'
import 'vue3-spin-wheel/dist/style.css'

const items = [
  { id: 1, label: 'Item 1', color: '#FF6B6B' },
  { id: 2, label: 'Item 2', color: '#4ECDC4' },
  // ... more items
]

const handleSpinStart = () => {
  console.log('Spin started!')
}

const handleSpinEnd = (item, index) => {
  console.log('Selected:', item, index)
}
</script>
```

### With API Integration

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

<script setup>
import { ref } from 'vue'
import { SpinWheel } from 'vue3-spin-wheel'
import 'vue3-spin-wheel/dist/style.css'

const spinWheel = ref(null)
const items = [
  { id: 1, label: 'Item 1', color: '#FF6B6B' },
  { id: 2, label: 'Item 2', color: '#4ECDC4' },
]

const handleSpinStart = async () => {
  // Call your API
  const response = await fetch('/api/spin')
  const data = await response.json()

  // Set the result when API returns
  spinWheel.value.setSpinResult(data.itemId)
}

const handleSpinEnd = (item, index) => {
  console.log('Selected:', item, index)
}
</script>
```

## Props

- `items` (Array, required): Array of items to display on the wheel
- `size` (Number, default: 400): Size of the wheel in pixels
- `duration` (Number, default: 3000): Animation duration in milliseconds
- `spins` (Number, default: 5): Number of extra rotations before stopping
- `pointerPosition` (String, default: 'top'): Position of pointer ('top', 'bottom', 'left', 'right')
- And more...

## Events

- `@spin-start`: Emitted when spin starts
- `@spin-end`: Emitted when spin ends with selected item and index

## Methods

- `spin()`: Start spinning
- `setSpinResult(itemId)`: Set the result from API/server

## License

