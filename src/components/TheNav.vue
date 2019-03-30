<template>
    <el-menu
        mode="horizontal"
        class="nav">
        <h1 class="nav__header">Finstagram</h1>
        <el-input
            class="nav__search"
            placeholder="Search"
            prefix-icon="el-icon-search"
            v-model="search"
            clearable></el-input>
    </el-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TheNav extends Vue {
    search = '';
}
</script>

<style lang="scss" scoped>
    @import "../assets/scss/main";

    .nav {
        display: flex;
        align-items: baseline;
        padding: 10px 0;
        position: relative;
    }

    .nav * {
        margin: 0;
    }

    .nav__header {
        @include finstagram;
        margin-left: 10%;
    }

    .nav__search {
        width: 300px;
        outline: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
