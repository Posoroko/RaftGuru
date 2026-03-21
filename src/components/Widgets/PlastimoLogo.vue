<script setup lang="ts">
interface Props {
    layout: "default" | 'logo' | 'text'
    color: 'blue' | 'white'
}

const props = withDefaults(
    defineProps<Props>(), 
    {
        layout: 'default',
        color: 'white'
    }
)


</script>

<template>
    <svg 
        v-if="layout === 'logo'"
        id="logo" 
        viewBox="0 0 90.22 61.18"
        class="path h100"
        :class="[
            color
        ]"
    >
        <path 
            id="path20" 
            class="cls-1" 
            d="M1,62.18,16,7.48h7.1c5.6-1.9,15.5-2.4,29.8,0A60.69,60.69,0,0,0,89,1.38s2.5-1.4,2.2,1.2L79.4,45.08s-2.5,10.4-17,10.5c0,0-11-1.6-22.3-2.2A67.58,67.58,0,0,0,22,55.28a5,5,0,0,1-1.2.2l8.1-30.6s.8-2.4,15.4-1.1c3.6.3,15.9.3,17.3.3,3.7,0,4.8,2.4,3.4,5.6-1.7,4-2.2,3.8-6.2,3.6,0,0-7.4-.3-10.4-.3s-7.6-.1-7.6-.1c-3.9.1-11.3,1.7-13.1,10.3a75.24,75.24,0,0,1,11.4-1.7c4.9-.2,10.3.3,17.8.9,10,.8,14.9-2.3,17.7-13.7,1.1-4.3.7-8.4-1.3-11.1s-6.2-2.7-9.5-2.6c-1.8,0-6.2-.1-10.9-.1s-11.5-1.2-17.4-1.3c-8.8-.2-14.6,2.9-14.6,3.1,0,.7-11.1,41.6-12.1,45.4H1Z"
        />
    </svg>
</template>

<style scoped>
.path.white {
    fill: white;
}
.path.blue {
    fill: var(--color-plastimo-blue);
}
</style>