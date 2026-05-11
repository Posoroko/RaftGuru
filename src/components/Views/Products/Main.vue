<script setup>
import { ref, onMounted } from 'vue'
import { getProducts } from '@/composables/testProcess'

const products = ref([])
const loading = ref(true)

onMounted(async () => {
    products.value = await getProducts()
    loading.value = false
})
</script>

<template>
    <div class="full flex column pad20 overflowHidden">
        <h2 class="pad5">Produits</h2>

        <div class="header flex pad10">
            <span class="grow fS12 weight6 textColorLight">Nom</span>
            <span class="dateCol fS12 weight6 textColorLight">Exp.</span>
            <span class="batchCol fS12 weight6 textColorLight">Lot</span>
        </div>

        <div class="list grow" style="overflow-y: auto;">
            <div
                v-for="product in products"
                :key="product.id"
                class="row flex pad10 alignCenter"
            >
                <span class="grow fS14">{{ product.name }}</span>
                <span class="dateCol fS14 textColorLight">{{ product.expirationDate }}</span>
                <span class="batchCol fS14 textColorLight">{{ product.batchNumber }}</span>
            </div>

            <p v-if="!loading && !products.length" class="fS14 textColorLight pad10">
                Aucun produit
            </p>
        </div>
    </div>
</template>

<style scoped>
.header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.row {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.dateCol {
    width: 60px;
    text-align: center;
}

.batchCol {
    width: 70px;
    text-align: right;
}
</style>
