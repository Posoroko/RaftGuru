<script setup>
import { ref } from 'vue'
import { useModal } from '@/composables/useModal'
import { dbPatch } from '@/composables/fetch'
import Icon from '@/components/Icon/Main.vue'

const { confirm, cancel } = useModal()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

async function handleSubmit(){
    errorMessage.value = ''

    // Validation
    if (!currentPassword.value.trim()) {
        errorMessage.value = 'Mot de passe requis'
        return
    }

    if (!newPassword.value.trim()) {
        errorMessage.value = 'Nouveau mot de passe requis'
        return
    }

    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = 'Les mots de passe ne correspondent pas'
        return
    }

    if (newPassword.value.length < 8) {
        errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères'
        return
    }

    isLoading.value = true

    try {
        await dbPatch({
            endpoint: '/users/me',
            body: {
                password: newPassword.value
            }
        })

        confirm(true)
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        errorMessage.value = message
        console.error('Password update failed:', err)
        localStorage.setItem('password_error', `${new Date().toISOString()}: ${message}`)
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
                Modifier le mot de passe
            </span>

            <Icon
                @click="() => confirm()"
                class="pointer"
                size="Lg"
            >
                close
            </Icon>
        </h2>

        <form
            class="flex column gap10"
            @submit.prevent="handleSubmit"
        >
            <input
                v-model="currentPassword"
                type="password"
                placeholder="Mot de passe"
                :disabled="isLoading"
                required
            />

            <input
                v-model="newPassword"
                type="password"
                placeholder="Nouveau mot de passe"
                :disabled="isLoading"
                required
            />

            <input
                v-model="confirmPassword"
                type="password"
                placeholder="Confirmer le mot de passe"
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
    text-align: center;
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

.cancelBtn {
    background-color: rgba(255, 68, 68, 0.2);
    border: 1px solid rgba(255, 68, 68, 0.4);
}

.cancelBtn:hover:not(:disabled) {
    background-color: rgba(255, 68, 68, 0.3);
    border-color: rgba(255, 68, 68, 0.5);
}

button:hover:not(:disabled) {
    opacity: 0.9;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
