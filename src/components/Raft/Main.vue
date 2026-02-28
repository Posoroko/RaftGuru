<script setup>
const props = defineProps({
    standup: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div 
        class="
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
.raft {
    background-color: #f7d519;
    overflow: hidden;
}
.raft.laydown {
    width: 32px;
    aspect-ratio: 1;
    border-radius: 6px;
    box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.456);
}
.raft.standup {
    width: 8px;
    height: 32px;
    border-radius: 3px;
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