<script setup>
import { ref, computed, onMounted } from 'vue'
import Icon from '@/components/Icon/Main.vue'
import { getProducts } from '@/composables/testProcess'

const products = ref([])
const loading = ref(true)

const categories = [
    { key: 'food',  label: 'Alimentation',  icon: 'restaurant' },
    { key: 'tools', label: 'Accastillage',      icon: 'construction' },
    { key: 'pyro',  label: 'Pyrotechnie',    icon: 'local_fire_department' },
    { key: 'lamps', label: 'Éclairage',      icon: 'flashlight_on' },
]

function productsForCategory(key) {
    return products.value.filter(p => p.category === key)
}

onMounted(async () => {
    products.value = await getProducts()
    loading.value = false
})
</script>

<template>
    <div class="full flex column pad20 overflowHidden">
        <h2 class="pad5">Produits</h2>

        <div class="list grow" style="overflow-y: auto;">
            <template v-for="cat in categories" :key="cat.key">
                <template v-if="productsForCategory(cat.key).length">
                    <div class="catHeader flex alignCenter gap10 pad10">
                        <Icon>{{ cat.icon }}</Icon>
                        <span class="fS13 weight6 textColorLight grow">{{ cat.label }}</span>
                        <span class="dateCol fS12 weight6 textColorLight">Exp.</span>
                        <span class="batchCol fS12 weight6 textColorLight">Lot</span>
                    </div>

                    <div
                        v-for="product in productsForCategory(cat.key)"
                        :key="product.id"
                        class="row flex pad10 alignCenter"
                    >
                        <span class="grow fS14">{{ product.name }}</span>
                        <span class="dateCol fS14 textColorLight">{{ product.expirationDate }}</span>
                        <span class="batchCol fS14 textColorLight">{{ product.batchNumber }}</span>
                    </div>
                </template>
            </template>

            <p v-if="!loading && !products.length" class="fS14 textColorLight pad10">
                Aucun produit
            </p>
        </div>
    </div>
</template>

<style scoped>
.catHeader {
    margin-top: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    padding-bottom: 6px;
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
