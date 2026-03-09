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
            flex alignCenter gap10 justifyCenter
        "
    >
        <div 
            v-for="raft in rafts"
            class="
                raftCulumn
                h100
                flex column alignCenter justifyCenter gap10
            "
        >
            <template v-if="!(raft.pressure1Valid && raft.pressure2Valid)">
                <div 
                    class="
                        grow
                        flex alignCenter justifyEvenly gap20 wrap
                    "
                    :class="[
                        raftOrientation === 'west' ? 'rowReverse' : '',
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
