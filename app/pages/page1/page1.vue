<template>
    <h1>page1 --罗鹏</h1>
    <input v-model="content" />
    <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="name" label="name" width="180"></el-table-column>
        <el-table-column prop="desc" label="desc"></el-table-column>
    </el-table>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import curl from '$common/curl';

const content = ref('')
const tableData = ref([
    { name: 'aaa', desc: 'aaa' },
    { name: 'bbb', desc: 'bbb' },
    { name: 'ccc', desc: 'ccc' },
    { name: 'ddd', desc: 'ddd' },
    { name: 'eee', desc: 'eee' },
])
onMounted(async ()=>{
    const res = await curl({
        method:'get',
        url:'/api/project/list',
        query:{
            proj_key:'111'
        }
    })
    console.log( res.data)
    tableData.value = res.data
})
</script>

<style lang="less" scoped></style>