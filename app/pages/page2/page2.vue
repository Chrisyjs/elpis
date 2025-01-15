<template>
    <h1>page1</h1>
    <input v-model="content" />
</template>

<script setup>
import { ref } from 'vue';
const content = ref('')
console.log('page2')
</script>

<style lang="less" scoped></style>