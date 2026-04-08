<script setup>
import Tile from '../../Tile/Main.vue'
</script>

<template>
    <div 
        class="
            gridBox full
            flex column gap5
        "
    >
        <!-- Row A: 3 equal cells -->
        <div 
            class="
                gridRow equalCells
                flex
            "
        >
            <div 
                class="cell"
            >
                <Tile 
                    tileRef="A-0" 
                    raftOrientation="east"
                />
            </div>
            
            <div class="cell">
                <Tile
                    tileRef="A-1"
                    raftOrientation="south"
                />
            </div>

            <div 
                class="cell "
            >
                <Tile
                    tileRef="A-2"
                    raftOrientation="south"
                />
            </div>
        </div>

        <!-- Row B: wide - narrow - wide -->
        <div 
            class="
                gridRow withWalkway
                flex 
            "
        >
            <div 
                class="cell"
            >
                <Tile
                    tileRef="B-0"
                    raftOrientation="east"
                />
            </div>

            <div 
                class="cell walkway"
            >
                <Tile
                    tileRef="B-1"
                    raftOrientation="south"
                />
            </div>

            <div 
                class="cell"
            >
                <Tile
                    tileRef="B-2"
                    raftOrientation="west"
                />
            </div>
        </div>

        <!-- Row C: wide - narrow - wide -->
        <div 
            class="
                gridRow withWalkway
                flex 
            "
        >
            <div 
                class="cell"
            >
                <Tile
                    tileRef="C-0"
                    raftOrientation="east"
                />
            </div>

            <div 
                class="cell walkway"
            >
                <Tile
                    tileRef="C-1"
                    raftOrientation="south"
                />
            </div>

            <div 
                class="cell"
            >
                <Tile
                    tileRef="C-2"
                    raftOrientation="west"
                />
            </div>
        </div>

        <!-- Row D: wide - narrow - wide -->
        <div 
            class="
                gridRow withWalkway
                flex
            "
        >
            <div 
                class="cell"
            >
                <Tile
                    tileRef="D-0"
                    raftOrientation="east"
                />
            </div>

            <div 
                class="cell walkway"
            >
                <Tile
                    tileRef="D-1"
                    raftOrientation="south"
                />
            </div>

            <div 
                class="cell"
            >
                <Tile
                    tileRef="D-2"
                    raftOrientation="west"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.gridBox {
    /* background-color: black; */
    padding: 5px;
    overflow: hidden;
}
.gridRow {
    height: 25%;
    gap: 5px;
}
.cell {
    overflow: hidden;
    background-color: #ffffff08;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.04);
}
/* Row A: equal width cells */
.equalCells .cell {
    flex: 1;
}

/* Rows B-E: wide + narrow + wide */
.withWalkway .cell {
    flex: 1;
}

.withWalkway .cell.walkway {
    width: 70px;
    flex-shrink: 0;
    flex: none;
}

.cell.walkway.active {
    flex: 1;
    width: auto;
}
</style>