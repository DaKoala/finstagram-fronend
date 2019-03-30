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
        <div class="nav__icon-group">
            <i class="el-icon-bell"></i>
        </div>
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
        align-items: center;
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

    .nav__icon-group {
        outline: none;
        font-size: 1.5rem;
        position: absolute;
        right: 15%;
    }

    .nav__icon-group > i {
        cursor: pointer;
        &:hover {
            color: $brand-color;
        }
    }
</style>
