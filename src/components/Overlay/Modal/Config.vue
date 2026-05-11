<script setup>
import { ref, onMounted, computed } from 'vue'
import Icon from '@/components/Icon/Main.vue'
import { getConfig, updateConfig } from '@/composables/testProcess'
import { useModal } from '@/composables/useModal'

const { confirm } = useModal()

const weekHourCount = ref(35)
const technicianCount = ref(2)
const loading = ref(true)

onMounted(async () => {
    const config = await getConfig()
    if (config) {
        weekHourCount.value = config.weekHourCount ?? 35
        technicianCount.value = config.technicianCount ?? 2
    }
    loading.value = false
})

function decrement() {
    if (technicianCount.value > 1) technicianCount.value--
}
function increment() {
    technicianCount.value++
}

const dayHours = computed(() => weekHourCount.value === 35 ? 7.5 : 8.5)
const dailyObjective = computed(() => Math.floor(technicianCount.value * dayHours.value / 2))

async function handleSave() {
    await updateConfig({
        weekHourCount: weekHourCount.value,
        technicianCount: technicianCount.value
    })
    confirm()
}
</script>

<template>
    <div class="flex column gap25">
        <h2 class="fS18 weight6">Configuration</h2>

        <!-- Week hours -->
        <div class="flex justifyCenter alignCenter gap10">
            <Icon
                size="xl"
            >
                schedule
            </Icon>

            <div class="flex gap20">
                <button
                    class="hourBtn pointer pad10 fS16 weight6"
                    :class="{ active: weekHourCount === 35 }"
                    @click="weekHourCount = 35"
                >
                    35h
                </button>
                <button
                    class="hourBtn pointer pad10 fS16 weight6"
                    :class="{ active: weekHourCount === 39 }"
                    @click="weekHourCount = 39"
                >
                    39h
                </button>
            </div>
        </div>

        <!-- Technician count -->
        <div class="flex marTop20 justifyCenter alignCenter gap10">
            <Icon 
                size="xl"
                class="textColorLight"
            >
                person
            </Icon>
            <div class="flex alignCenter gap15">
                <button
                    class="counterBtn pointer centered"
                    @click="decrement"
                >
                    <Icon size="md">remove</Icon>
                </button>

                <span class="fS28 weight7">{{ technicianCount }}</span>

                <button
                    class="counterBtn pointer centered"
                    @click="increment"
                >
                    <Icon size="md">add</Icon>
                </button>
            </div>
        </div>

        <!-- Daily objective -->
        <div class="flex column alignCenter gap5 marTop20">
            <span class="fS14 textColorLight">Objectif journalier</span>
            <div class="flex alignCenter gap15">
                <span class="fS22 weight6">{{ dailyObjective }}</span>
                <Icon size="md">houseboat</Icon>
            </div>
        </div>

        <!-- Save -->
        <button
            class="saveBtn pointer pad10 centered"
            @click="handleSave"
        >
            Enregistrer
        </button>
    </div>
</template>

<style scoped>
.hourBtn {
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: transparent;
    transition: all 0.15s;
}

.hourBtn.active {
    background: var(--color-accent);
    border-color: rgba(0, 217, 255, 0.4);
}

.counterBtn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: transparent;
    transition: all 0.15s;
}

.counterBtn:hover {
    background: rgba(255, 255, 255, 0.08);
}

.saveBtn {
    border-radius: 6px;
    background-color: var(--color-btn);
    border: none;
}

.saveBtn:hover {
    opacity: 0.9;
}
</style>
