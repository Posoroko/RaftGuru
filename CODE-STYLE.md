# RaftGuru Code Style Guide

## Formatting

- **Indentation**: 4 spaces (use tabs, not spaces)
- **Line length**: Keep reasonable
- **File structure**: `<script setup>` at top, then `<template>`, then `<style scoped>`

## CSS

- **Always use** `posoroko.css` utility classes first
- **Only use** `<style scoped>` for:
  - Colors
  - Borders
  - Custom spacing that doesn't exist in utilities
  - Hover/active states
- **Never** define `display: flex`, layout direction, gaps, alignment in CSS when utility classes exist
- **CSS variable naming**: Use `--camelCase` format
  - Good: `--color-background`, `--color-primary`
  - Bad: `--color_background`, `--colorBackground`
  -dont add hover and animation unless it was requested

## HTML Elements

### Formatting

One property per line in multi-line elements:

```vue
<button
    @click.prevent.stop="handleClick"
    class="
        grow
        primaryBtn
        flex justifyCenter alignCenter
    "
    :class="{ active: isActive }"
    :disabled="isLoading"
>
    Click Me
</button>
```

### Class Names

- **Always camelCase**: `primaryBtn`, `modalHeader`, `tileCard`
- **Never kebab-case**: ❌ `primary-btn`, ❌ `modal-header`
- **Rely on utility classes**: `flex`, `column`, `gap10`, `justifyCenter`, `alignCenter`, `grow`, `shrink0`
- **Format multi-class**: Put each on new line for clarity

### Event Handlers

- Always use `.prevent.stop` modifiers on buttons and clickable elements
- Never skip modifiers:
  - Good: `@click.prevent.stop="handleDelete"`
  - Bad: `@click="handleDelete"`

### Icon Component

- Use text content, not attribute:
  - Good: `<Icon>houseboat</Icon>`
  - Bad: `<Icon name="houseboat" />`

### Conditionals

- Use `v-if` directly on elements (no lexical HTML wrappers):
  ```vue
  <div v-if="isVisible" class="content">...</div>
  <div v-else class="empty">No data</div>
  ```

## JavaScript

### Functions

- **Never use arrow functions** in scripts (except for callbacks in array methods)
- Always use `function` syntax or named functions:
  ```typescript
  async function handleClick() {
      // code
  }
  
  function toggleFlag() {
      // code
  }
  ```

- **Exception**: Array methods (map, filter, forEach) can use arrows:
  ```typescript
  const items = data.map(item => ({...item}))
  ```

### Imports

- Keep imports organized: Vue API, then local components, then composables, then utilities

### Comments

- Keep comments minimal and functional
- No over-documentation
- Only explain *why*, not *what* the code does

## Component Structure Example

```vue
<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/Icon/Main.vue'
import { useModal } from '@/composables/useModal'
import { tiles } from '@/composables/testProcess'

const { cancel } = useModal()

const tile = computed(() => {
    return tiles.value['A-0']
})

async function handleAction() {
    // do something
}
</script>

<template>
    <div class="tileModal flex column gap20">
        <h2>Tile</h2>
        <button
            @click.prevent.stop="handleAction"
            class="
                grow
                primaryBtn
                flex justifyCenter
            "
        >
            Action
        </button>
    </div>
</template>

<style scoped>
.tileModal {
    padding: 1.5rem;
    background: var(--color-background);
    border-radius: 8px;
}

.primaryBtn {
    background: var(--color-primary);
    color: white;
    border: none;
}

.primaryBtn:hover {
    background: var(--color-primary-dark);
}
</style>
```

## Summary Checklist

- [ ] 4-space indentation
- [ ] `<script>` first, then `<template>`, then `<style>`
- [ ] Use posoroko.css utilities
- [ ] camelCase for class names
- [ ] One property per line on multi-line elements
- [ ] `.prevent.stop` on all clicks
- [ ] No arrow functions (except array methods)
- [ ] `<Icon>name</Icon>` syntax
- [ ] CSS only for colors, borders, custom spacing
- [ ] `--camelCase` for CSS variables
- [ ] No lexical HTML (use v-if directly)
