<script setup>
import { ref } from 'vue'
import Icon from '@/components/Icon/Main.vue'
import { useModal } from '@/composables/useModal'
import { useUser } from '@/composables/useUser'
import { dbPatch } from '@/composables/fetch'

const { confirm, cancel } = useModal()
const { userState } = useUser()

const firstName = ref(userState.value.first_name)
const isLoading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
    errorMessage.value = ''

    // Validation
    if (!firstName.value.trim()) {
        errorMessage.value = 'Le prénom est requis'
        return
    }

    if (firstName.value === userState.value.first_name) {
        errorMessage.value = 'Veuillez modifier le prénom'
        return
    }

    isLoading.value = true

    try {
        const result = await dbPatch({
            endpoint: '/users/me',
            body: {
                first_name: firstName.value
            }
        })

        if (result?.first_name) {
            userState.value.first_name = result.first_name
            confirm(result.first_name)
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        errorMessage.value = message
        console.error('First name update failed:', err)
        localStorage.setItem('firstName_error', `${new Date().toISOString()}: ${message}`)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div>
        <h2 
            class="
                textColorLight
                flex justifyBetween alignCenter
            "
        >
            <span>
                Modifier le prénom
            </span>

            <Icon
                @click="() => confirm()"
                class="pointer"
                size="Lg"
            >
                close
            </Icon>
        </h2>

        <div class="currentFirstName flex">
            <span class="label">nom: {{ userState.first_name }}</span>
            <span class="value"></span>
        </div>

        <form
            class="
                marTop20 
                flex column gap10
            "
            @submit.prevent="handleSubmit"
        >
            <input
                v-model="firstName"
                type="text"
                placeholder="Nouveau prénom"
                :disabled="isLoading"
                required
            />

            <div v-if="errorMessage" class="errorMessage">
                {{ errorMessage }}
            </div>

            <div class="buttonContainer">
                <button 
                    class="textColorLight cancelBtn"
                    type="button"
                    @click="cancel"
                    :disabled="isLoading"
                >
                    Annuler
                </button>

                <button 
                    class="textColorLight"
                    type="submit" 
                    :disabled="isLoading"
                >
                    {{ isLoading ? 'Sauvegarde...' : 'Sauvegarder' }}
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
h2 {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.flex {
    display: flex;
}

.column {
    flex-direction: column;
}

.gap10 {
    gap: 10px;
}

.justifyBetween {
    justify-content: space-between;
}

.alignCenter {
    align-items: center;
}

input {
    padding: 10px;
    border: 1px solid var(--color-accent);
    background-color: rgba(0, 217, 255, 0.05);
    color: var(--color-text);
    border-radius: 4px;
}

input:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 8px rgba(0, 217, 255, 0.3);
}

.errorMessage {
    padding: 10px;
    background-color: rgba(255, 68, 68, 0.1);
    border: 1px solid rgba(255, 68, 68, 0.3);
    border-radius: 4px;
    color: #ff4444;
    font-size: 14px;
    text-align: center;
}

.buttonContainer {
    display: flex;
    gap: 10px;
    justify-content: center;
}

button {
    padding: 10px 20px;
    background-color: var(--color-btn);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: opacity 0.2s;
}

button:hover:not(:disabled) {
    opacity: 0.9;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.cancelBtn {
    background-color: rgba(255, 68, 68, 0.2);
    border: 1px solid rgba(255, 68, 68, 0.4);
}

.cancelBtn:hover:not(:disabled) {
    background-color: rgba(255, 68, 68, 0.3);
    border-color: rgba(255, 68, 68, 0.5);
}

.pointer {
    cursor: pointer;
}
</style>
