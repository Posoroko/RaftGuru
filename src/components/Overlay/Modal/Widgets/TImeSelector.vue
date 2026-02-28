<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import Icon from '@/components/Icon/Main.vue'

const emit = defineEmits(['timeChange'])

function roundToNearestTen(date: Date): Date {
    const minutes = Math.round(date.getMinutes() / 10) * 10
    const rounded = new Date(date)
    rounded.setMinutes(minutes)
    rounded.setSeconds(0)
    rounded.setMilliseconds(0)
    return rounded
}

const now = computed(() => roundToNearestTen(new Date()))

const currentHour = computed(() => now.value.getHours())
const currentMinuteTen = computed(() => now.value.getMinutes())

const selectedHour = ref<number>(now.value.getHours())
const selectedMinuteTen = ref<number>(now.value.getMinutes())
const addFiveMin = ref<boolean>(false)

const selectedTime = computed(() => {
    const date = new Date()
    date.setHours(selectedHour.value)
    date.setMinutes(selectedMinuteTen.value + (addFiveMin.value ? 5 : 0))
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
})

const hours = computed(() => [
    currentHour.value,
    currentHour.value - 1 < 0 ? 23 : currentHour.value - 1,
    currentHour.value - 2 < 0 ? 22 + currentHour.value : currentHour.value - 2
].reverse())

const minutesTen = computed(() => [0, 10, 20, 30, 40, 50])

function selectHour(hour: number) {
    selectedHour.value = hour
    emit('timeChange', selectedTime.value)
}

function selectMinuteTen(mins: number) {
    selectedMinuteTen.value = mins
    emit('timeChange', selectedTime.value)
}

function toggleAddFiveMin() {
    addFiveMin.value = !addFiveMin.value
    emit('timeChange', selectedTime.value)
}

function formatTime(date: Date): string {
    const h = String(date.getHours()).padStart(2, '0')
    const m = String(date.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
}

onMounted(() => {
    emit('timeChange', selectedTime.value)
})
</script>

<template>
    <div class="timeSelector flex column gap20">
        

        <div
            class="
                selectorBox
                flex column gap20
            "
        >
            <div class="hoursRow flex justifyCenter gap10">
                <button
                    v-for="hour in hours"
                    :key="hour"
                    @click.prevent.stop="selectHour(hour)"
                    class="hourTile"
                    :class="{
                        activeSurface: selectedHour === hour
                    }"
                >
                    {{ String(hour).padStart(2, '0') }}h
                </button>
            </div>

            <div 
                class="
                    minutesRow
                    flex justifyCenter gap10
                "
            >
                <button
                    v-for="min in minutesTen"
                    :key="min"
                    @click.prevent.stop="selectMinuteTen(min)"
                    class="minuteTile"
                    :class="{
                        activeSurface: selectedMinuteTen === min
                    }"
                >
                    :{{ String(min).padStart(2, '0') }}
                </button>
            </div>

                   <div class="timeHeader flex justifyCenter alignCenter gap10">

            <button
                @click.prevent.stop="toggleAddFiveMin"
                class="fiveMinBtn"
                :class="{
                    activeSurface: addFiveMin
                }"
            >
                +05
            </button>
        </div>
        </div>

 
    </div>
</template>

<style scoped>
.selectorBox {
    padding: 10px 10px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.501);
}

.hoursRow,
.minutesRow {
    flex-wrap: wrap;
}

.hourTile,
.minuteTile,
.fiveMinBtn {
    background-color: #2a4b502d;
    padding: 0.75rem;
    border-width: 1px;
    border-style: solid;
    border-color: transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
}

</style>
