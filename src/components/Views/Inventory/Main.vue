<script setup>
import { ref, computed } from 'vue'
import { checklistOptions } from '@/lib/raftModels'
import { checklists } from '@/lib/checklists'
import { inventoryItems } from '@/lib/inventoryItems'
import Icon from '@/components/Icon/Main.vue'

const activeChecklist = ref(null)
const checked = ref(new Set())

function openChecklist(option) {
    activeChecklist.value = option
    checked.value = new Set()
}

function goBack() {
    activeChecklist.value = null
}

function toggleItem(itemId) {
    if (checked.value.has(itemId)) {
        checked.value.delete(itemId)
    } else {
        checked.value.add(itemId)
    }
}

const activeItems = computed(() => {
    if (!activeChecklist.value) return []
    const list = checklists[activeChecklist.value.id]
    return list.map(entry => {
        const item = inventoryItems.find(i => i.id === entry.itemId)
        return {
            ...entry,
            name: item?.name ?? entry.itemId,
            icon: item?.icon ?? 'help'
        }
    })
})
</script>

<template>
    <div 
        class="
            full
            flex column gap10
            pad20 overflowHidden
        "
    >
        <!-- Checklist selection -->
        <template v-if="!activeChecklist">
            <h2 class="pad5">Checklists Accastillage</h2>

            <div
                v-for="option in checklistOptions"
                :key="option.id"
                class="
                    checklistButton
                    pad10
                    pointer grow flex alignCenter textXl fontWeightBold
                "
                @click="openChecklist(option)"
            >
                {{ option.label }}
            </div>
        </template>

        <!-- Active checklist -->
        <template v-else>
            <div class="flex alignCenter gap10">
                <div class="pointer flex alignCenter pad5" @click="goBack">
                    <Icon>arrow_back</Icon>
                </div>
                <h2>{{ activeChecklist.label }}</h2>
            </div>

            <div 
                class="
                    scrollableList
                    flex column
                "
            >
                <div
                    v-for="entry in activeItems"
                    :key="entry.itemId"
                    class="
                        checklistRow
                        flex alignCenter gap10
                        pad10
                        pointer
                    "
                    @click="toggleItem(entry.itemId)"
                >
                    <Icon size="sm">{{ entry.icon }}</Icon>
                    <span class="grow textLg">{{ entry.name }}</span>
                    <span class="qty textLg">{{ entry.qty }}</span>
                    <Icon>{{ checked.has(entry.itemId) ? 'check_box' : 'check_box_outline_blank' }}</Icon>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.checklistButton {
    background-color: var(--color-accent);
    border-radius: 4px;
    padding-left: 30px;
}
.checklistRow {
    border-bottom: 1px solid var(--color-accent);
}
.qty {
    opacity: 0.6;
}

.scrollableList {
    overflow: scroll;
}
</style>
