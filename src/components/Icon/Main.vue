<script setup lang="ts">
/**
 * Icon component
 * Renders Material Symbols icons using font ligatures
 * 
 * Usage:
 *   <icon key="edit" />
 *   <icon key="delete" size="lg" />
 *   <icon key="heartFull" />
 */

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const props = withDefaults(defineProps<{
    size?: IconSize,
    color?: 'green' | 'beige'
}>(), {
    size: 'md',
    color: 'beige'
})

</script>

<template>
    <span
        class="material-symbols-outlined"
        :class="[
            `sizeIcon${size.toUpperCase()}`,
            color
        ]"
    >
        <slot />
    </span>
</template>

<style scoped>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
}

/* Size classes */
.sizeIconXS {
  font-size: 16px;
}

.sizeIconSM {
  font-size: 20px;
}

.sizeIconMD {
  font-size: 24px;
}

.sizeIconLG {
  font-size: 32px;
}

.sizeIconXL {
  font-size: 40px;
}

.sizeIcon2XL {
  font-size: 48px;
}
.green {
    color: var(--green);
}
.beige {
    color: var(--beige);
}
</style>
