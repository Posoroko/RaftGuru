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

### Comment Keys

For complex logic that needs explanation (especially for AI agents), use **comment keys** to keep code clean while preserving context.

**How it works:**
1. Place a short key above the code: `// comment_theme`
2. Write the full explanation at the end of the file
3. Use the same key to link them

**Format:** `comment_theme` or `comment_theme_001` (number only if multiple same-theme keys exist)

Keys must be a single "word" (double-click selectable). Use underscores, not hyphens.

**Themes:**

| Theme | Use when... |
|-------|-------------|
| `order` | Sequence/hierarchy matters — don't reorder |
| `appMount` | Important for app loading correctly |
| `raceCondition` | Race condition or timing sensitivity |
| `realWorld` | Physical world or business constraint |
| `db` | Database structure or query consideration |
| `ux` | UX decision that needs justification |
| `edgeCase` | Edge case handling |
| `performance` | Performance optimization |
| `sync` | Sync/async coordination |
| `dependency` | External dependency behavior |

**Example in code:**

```js
// c5t_order
const checkpointStatus = computed(() => {
    // ...
})
```

**At end of file (outside main tags):**

```html
<!--
comment_order
checkpointStatus state hierarchy (order matters):
1. testComplete — must win over time-based states
2. checkpointReached — user needs to act now
3. fiveMinutesAway — heads-up, not urgent
4. null — no pending checkpoints
-->

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
