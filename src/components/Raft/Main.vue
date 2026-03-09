<script setup lang="ts">
const props = withDefaults(defineProps<{
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
            box
            relative
        "
    >
        <div
            v-if="!standup"
            class="
                raft laydown
                relative
                pad5
            "
            :class="[raftOrientation]"
        >
            <div class="floor full">

            </div>

            <div 
                class="
                    tent
                    w100 h50 
                    absolute top0 left0
                "
            >

            </div>
        </div>

        <div
            v-else
            class="flex"
        >
            <div class="raft standup">

            </div>
            <div class="raft standup">

            </div>
        </div>
    </div>
</template>

<style scoped>
.box {
    border-radius: 3px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.84);
    overflow: hidden;
}
.raft {
    background-color: #f7d519;
    overflow: hidden;
    box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.566);
}
.west {
    rotate: 90deg;
}
.east {
    rotate: -90deg;
}
.raft.laydown {
    width: 40px;
    aspect-ratio: 1;
    border-radius: 6px;
    
}
.raft.standup {
    width: 8px;
    height: 32px;
    
    box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.456);

}
.floor {
    background-color: black;
    border-radius: 4px;
}
.tent {
    background-color: orange;
    box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.456);
}
</style>