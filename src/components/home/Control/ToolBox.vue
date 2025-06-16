<template>
    <div class="tool-box">
        <button class="reset-button" @click="resetCenter(map)">复位</button>

    </div>
</template>

<script setup>

import { resetCenter } from './ResetCenter';


const props = defineProps({
    map: {
        type: Object,
        required: true
    }
});

</script>

<style scoped>
/* .tool-box {
    width: 200px;
    height: 150px;
    position: absolute;
    bottom: 100px;
    right: 50px;
    background-color: pink;
} */

button {
    cursor: pointer;
}
.reset-button{
    position: absolute;
    bottom: 100px;
    right: 70px;
    background-color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);

}
</style>