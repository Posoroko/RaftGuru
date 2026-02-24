import { ref } from 'vue'

export {
    useAppState
}

let appState = ref({
    initialized: false,
    activeBatch: null
})

const useAppState = () => {
    return appState
}
