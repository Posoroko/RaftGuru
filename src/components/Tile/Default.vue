<script setup lang="ts">
import Icon from '@/components/Icon/Main.vue'
import Raft from '@/components/Raft/Main.vue'
import TimeParser from '@/components/Widgets/TimeParser.vue'

const props = withDefaults(defineProps<{
    rafts: any[]
    standup?: boolean
    raftOrientation: 'west' | 'south' | 'east'
}>(), {
    standup: false
})
</script>

<template>
    <div 
        class="
            full
            rafts
            flex alignCenter justifyCenter
        "
    >
        <div 
            v-for="raft in rafts"
            class="
                h100
                flex column alignCenter justifyCenter
            "
        >
            <template v-if="!(raft.pressure1Valid && raft.pressure2Valid)">
                <div 
                    class="
                        grow
                        flex alignCenter justifyEvenly  wrap
                    "
                    :class="[
                        raftOrientation === 'east' ? 'row gap20' : '',
                        raftOrientation === 'west' ? 'rowReverse gap20' : '',
                        raftOrientation === 'south' ? 'column' : '',
                    ]"
                >
                    <div>
                        <Raft
                            :standup="standup"
                            :raftOrientation="raftOrientation"
                        />
                    </div>

                    <div
                        class="
                            flex alignCenter gap5
                        "
                    >
                        <Icon>speed</Icon>
                        <span
                            class="text2xl fontWeightBold"
                        >
                            {{ raft.pressure1Valid ? 2 : 1 }}
                        </span>
                    </div>
                </div>

                <div 
                    class="
                        grow
                        flex column alignCenter justifyEvenly
                    "
                >
                    <TimeParser
                        :timestamp="raft.pressure1Valid ? raft.time_pressure2 : raft.time_pressure1"
                        flashing
                        class="textXl fontWeightBold"
                    />
                </div>
            </template>

            <div
                v-else
                class="
                    grow
                    flex column alignCenter justifyCenter
                "
            >
                <Icon
                    size="xl"
                >
                    check_circle
                </Icon>
            </div>
        </div>
    </div>
</template>
