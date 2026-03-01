<script setup>
import Icon from '@/components/Icon/Main.vue'
import { useModal } from '@/composables/useModal'
import { useUser } from '@/composables/useUser'
import FirstName from './FirstName.vue'
import Email from './Email.vue'
import Password from './Password.vue'

const { showModal, confirm } = useModal()
const { userState } = useUser()

const openFirstNameModal = async () => {
    const result = await showModal(FirstName)
    if (result) {
        // Result will be the updated first name
        userState.value.first_name = result
    }
}

const openEmailModal = async () => {
    const result = await showModal(Email)
    if (result) {
        // Result will be the updated email
        userState.email = result
    }
}

const openPasswordModal = async () => {
    await showModal(Password)
}
</script>

<template>
    <div class="container">
        <h2 
            class="
                textColorLight
                flex justifyBetween alignCenter
            "
        >
            <span>
                Mon Compte
            </span>

            <Icon
                @click="() => confirm()"
                class="pointer"
                size="Lg"
            >
                close
            </Icon>
        </h2>

        <div 
            class="
                userInfo
                flex column gap10
            "
        >
            <div class="infoField">
                <div class="label">Nom</div>
                <div 
                    class="
                        value
                        flex alignCenter gap20
                    "
                >
                    <span
                        class="textLg"
                    >
                        {{ userState.first_name }}
                    </span>

                    <Icon
                         @click="openFirstNameModal"
                        class="pointer"
                        size="md"
                    >
                        edit
                    </Icon>
                </div>
            </div>

            <div class="infoField">
                <div class="label">
                    Email
                </div>
                
                <div
                    class="
                        value
                        flex alignCenter gap20
                    "
                >
                    <span>
                        {{ userState.email }}
                    </span>

                    <Icon
                        @click="openEmailModal"
                        class="pointer"
                        size="md"
                    >
                        edit
                    </Icon>
                </div>
            </div>

            <div class="infoField">
                <div class="label">Mot de passe</div>
                <div
                    class="
                        value
                        flex alignCenter gap20
                    "
                >
                    <span>
                        *******
                    </span>

                    <Icon
                        @click="openPasswordModal"
                        class="pointer"
                        size="md"
                    >
                        edit
                    </Icon>
                </div>
            </div>
        </div>

        <!-- <div class="buttonContainer marTop20">
            <button class="textColorLight">
                Modifier l'email
            </button>

            <button class="textColorLight">
                Modifier le mot de passe
            </button>
        </div> -->
    </div>
</template>

<style scoped>
.container {
    position: relative;
}

h2 {
    margin-bottom: 30px;
    text-align: center;
}

.infoField {
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.infoField:last-child {
    margin-bottom: 0;
}


.buttonContainer {
    display: flex;
    flex-direction: column;
    gap: 10px;
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
</style>
