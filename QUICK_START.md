# Quick Start - Use Like vue3-easy-data-table

## Step 1: Build the Package

```bash
npm install
npm run build
```

This creates the `dist` folder ready for publishing.

## Step 2: Publish to npm (or use locally)

### Option A: Publish to npm
```bash
npm login
npm publish
```

### Option B: Use locally with npm link
```bash
# In this package directory
npm link

# In your project directory
npm link vue3-spin-wheel
```

## Step 3: Install in Your Project

```bash
npm install vue3-spin-wheel
```

## Step 4: Use in Your Vue 3 Project

```vue
<template>
  <SpinWheel
    ref="spinWheel"
    :items="items"
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
  const result = await fetch('/api/spin')
  const data = await result.json()
  spinWheel.value.setSpinResult(data.itemId)
}

const handleSpinEnd = (item, index) => {
  console.log('Selected:', item)
}
</script>
```

That's it! Just like using `vue3-easy-data-table` - install, import, use.

