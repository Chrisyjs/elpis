<template>

<h1>page1</h1>
<input v-model="content" />
</template>

<script setup>
import {ref} from 'vue';
const content = ref('')
console.log('page1')
</script>

<style lane="less" scoped></style>