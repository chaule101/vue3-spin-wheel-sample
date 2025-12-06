# How to Use This Package

## Step 1: Build the Package

First, build the package for distribution:

```bash
npm install
npm run build
```

This will create a `dist` folder with:
- `vue3-spin-wheel.es.js` (ES module)
- `vue3-spin-wheel.umd.js` (UMD module)
- `style.css` (component styles)
- `index.d.ts` (TypeScript declarations)

## Step 2: Use Locally (Before Publishing)

### Option A: Using npm link

1. In this package directory:
```bash
npm link
```

2. In your project directory:
```bash
npm link vue3-spin-wheel
```

### Option B: Using file path

In your project's `package.json`:
```json
{
  "dependencies": {
    "vue3-spin-wheel": "file:../path/to/vue3-spin-wheel"
  }
}
```

Then run:
```bash
npm install
```

## Step 3: Use in Your Project

### Install (if published to npm)
```bash
npm install vue3-spin-wheel
```

### Import and Use

```vue
<template>
  <div>
    <SpinWheel
      ref="spinWheel"
      :items="items"
      :size="600"
      :duration="4000"
      :spins="8"
      pointerPosition="top"
      @spin-start="handleSpinStart"
      @spin-end="handleSpinEnd"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SpinWheel } from 'vue3-spin-wheel'
import 'vue3-spin-wheel/dist/style.css'

const spinWheel = ref(null)

const items = [
  { id: 1, label: 'Item 1', color: '#FF6B6B' },
  { id: 2, label: 'Item 2', color: '#4ECDC4' },
  { id: 3, label: 'Item 3', color: '#45B7D1' },
]

const handleSpinStart = async () => {
  // Call your API
  const result = await fetch('/api/spin')
  const data = await result.json()

  // Set the result
  spinWheel.value.setSpinResult(data.itemId)
}

const handleSpinEnd = (item, index) => {
  console.log('Selected:', item, index)
}
</script>
```

## Step 4: Publish to npm (Optional)

1. **Login to npm** (if not already):
```bash
npm login
```

2. **Update version** in `package.json`:
```json
{
  "version": "1.0.1"
}
```

3. **Publish**:
```bash
npm publish
```

For scoped packages:
```bash
npm publish --access public
```

## Development

- **Run demo**: `npm run dev` (uses `vite.demo.config.ts`)
- **Build package**: `npm run build` (creates dist folder)
- **Build demo**: `npm run build:demo` (builds demo app)

## Package Structure

```
vue3-spin-wheel/
├── src/
│   ├── SpinWheel.vue    # Main component
│   ├── index.ts         # Entry point
│   ├── types.ts         # TypeScript types
│   └── index.css        # Styles
├── dist/                # Built files (after npm run build)
├── demo/                # Demo app (not included in package)
└── package.json
```

## Notes

- The `demo` folder is excluded from the package (via `.npmignore`)
- CSS must be imported separately: `import 'vue3-spin-wheel/dist/style.css'`
- Vue 3.4+ is required as a peer dependency

