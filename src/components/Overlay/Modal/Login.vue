<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useUser } from '@/composables/useUser'

const { login } = useAuth()
const { getUserData } = useUser()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
    isLoading.value = true

    try {
        await login(email.value, password.value)
        await getUserData()
        email.value = ''
        password.value = ''
    } catch (err) {
        console.error('Login failed:', err)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div>
        <h2
            class="textColorLight"
        >
            Connexion
        </h2>

        <form
            class="
                flex
                column
                gap10
            "
            @submit.prevent="handleSubmit"
        >
            <input
                v-model="email"
                type="email"
                placeholder="Email"
                :disabled="isLoading"
                required
            />

            <input
                v-model="password"
                type="password"
                placeholder="Password"
                :disabled="isLoading"
                required
            />

            <div class="centered">
                <button 
                    class="textColorLight"
                    type="submit" 
                    :disabled="isLoading"
                >
                    {{ isLoading ? 'Loading...' : 'Login' }}
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

button {
    padding: 10px 20px;
    background-color: var(--color-btn);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
}

button:hover:not(:disabled) {
    opacity: 0.9;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
