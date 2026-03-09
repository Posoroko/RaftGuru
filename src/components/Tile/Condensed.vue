<script setup lang="ts">
import Icon from '@/components/Icon/Main.vue'
import Raft from '@/components/Raft/Main.vue'
import TimeParser from '@/components/Widgets/TimeParser.vue'

const props = withDefaults(defineProps<{
    rafts: any[]
    standup?: boolean
    raftOrientation?: 'west' | 'south' | 'east'
}>(), {
    standup: false,
    raftOrientation: 'south'
})
</script>

<template>
    <div 
        class="
            full
            rafts
            flex column alignCenter gap5 justifyCenter
        "
    >
        <div 
            v-for="raft in rafts"
            class="
                raftRow
                w100
                flex alignCenter justifyEvenly
            "
            :class="raftOrientation === 'west' ? 'rowReverse' : 'row'"
        >
            <template v-if="!(raft.pressure1Valid && raft.pressure2Valid)">
                <div 
                    class="flex alignCenter gap5"
                    :class="raftOrientation === 'west' ? 'rowReverse' : 'row'"
                >
                    <div class="raftSmall">
                        <Raft
                            :standup="standup"
                            :raftOrientation="raftOrientation"
                        />
                    </div>
                    <div
                        class="flex alignCenter gap2"
                    >
                        <Icon size="sm">speed</Icon>
                        <span class="textMd fontWeightBold">{{ raft.pressure1Valid ? 2 : 1 }}</span>
                    </div>
                </div>

                <TimeParser
                    :timestamp="raft.pressure1Valid ? raft.time_pressure2 : raft.time_pressure1"
                    flashing
                    class="textLg fontWeightBold"
                />
            </template>

            <div
                v-else
                class="
                    flex alignCenter justifyCenter
                "
            >
                <Icon>check_circle</Icon>
            </div>
        </div>
    </div>
</template>

<style scoped>
.raftSmall {
    transform: scale(0.8);
}
</style>
