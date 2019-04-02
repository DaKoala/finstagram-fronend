<template>
    <el-menu
        mode="horizontal"
        class="nav">
        <router-link
            to="/dashboard"
            class="nav__header">Finstagram</router-link>
        <el-input
            class="nav__search"
            placeholder="Search"
            prefix-icon="el-icon-search"
            v-model="search"
            clearable></el-input>
        <div class="nav__icon-group">
            <i
                class="el-icon-circle-plus-outline icon--plus"
                title="Post Photo"
                @click="toAddPost"></i>
            <i class="el-icon-bell" title="Follower Requests"></i>
        </div>
    </el-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TheNav extends Vue {
    search = '';

    toAddPost(this: TheNav) {
        this.$router.push('/add-post');
    }
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
        text-decoration: none;
        font-size: 2rem;
        font-weight: bold;
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
        display: flex;
        align-items: center;
    }

    .nav__icon-group > i {
        cursor: pointer;
        margin: 0 10px;
        &:hover {
            color: $brand-color;
        }
    }

    .nav__icon-group > .icon--plus {
        font-size: 2.5rem;
    }
</style>
