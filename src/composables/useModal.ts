/**
 * Modal.ts
 * 
 * Simple modal composable for displaying components as modals.
 * Components handle their own content, styling, and logic.
 * 
 * Usage:
 * const { showModal, showConfirmationModal } = useModal()
 * 
 * const result = await showModal(MyComponent)
 * const confirmed = await showConfirmationModal({ title: 'Delete?', message: 'Sure?' })
 */

import { ref } from 'vue'

export { useModal }

interface ConfirmationModalProps {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
}

type RaftSetupProps = {
    mode: 'create' | 'reset'
    resetRaftId?: string
    tileId?: string
}

interface ModalState {
    visible: boolean
    modal: any
    data: {
        tileId?: string
        tileRef?: string
        raftId?: string
        confirmationProps?: ConfirmationModalProps
        raftSetup?: RaftSetupProps
    }
    confirmationProps?: ConfirmationModalProps
    resolveFn?: (value: any) => void
    rejectFn?: (reason?: any) => void
}

const modalState = ref<ModalState>({
    visible: false,
    modal: undefined,
    data: {
        tileId: undefined,
        tileRef: undefined,
        raftId: undefined,
        confirmationProps: undefined
    },
    resolveFn: undefined,
    rejectFn: undefined
})

function useModal() {
    /**
     * Show a modal component and return a promise
     * @param modal - Vue component to display
     * @returns Promise that resolves when confirm() is called
     */
    const showModal = (
        modal: any,
        data?: {
            tileId?: string
            tileRef?: string
            raftId?: string
            confirmationProps?: ConfirmationModalProps
            raftSetup?: RaftSetupProps
        }
    ) => {
        modalState.value.modal = modal
        modalState.value.data = { 
            ...modalState.value.data,
            ...data 
        }
        modalState.value.visible = true

        return new Promise((resolve, reject) => {
            modalState.value.resolveFn = resolve
            modalState.value.rejectFn = reject
        })
    }

    const confirm = (data?: any) => {
        modalState.value.visible = false

        if (modalState.value.resolveFn) {
            modalState.value.resolveFn(data !== undefined ? data : true)
        }

        resetModalState()
    }

    /**
     * Cancel and close the modal
     * @param reason - Optional rejection reason
     */
    const cancel = (reason?: any) => {
        modalState.value.visible = false

        if (modalState.value.rejectFn) {
            modalState.value.rejectFn(reason !== undefined ? reason : false)
        }

        resetModalState()
    }

    /**
     * Reset modal state after closing
     */
    const resetModalState = () => {
        setTimeout(() => {
            modalState.value.modal = undefined
            modalState.value.confirmationProps = undefined
            modalState.value.resolveFn = undefined
            modalState.value.rejectFn = undefined
        }, 300)
    }

    return {
        modalState,
        showModal,
        confirm,
        cancel
    }
}