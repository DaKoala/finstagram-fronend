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
            <el-dropdown>
                <img class="nav__avatar" :src="$store.state.avatar" alt="Avatar">
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item disabled>
                        <span class="nav__username">
                            Signed in as
                            <span class="nav__username--strong">{{$store.state.username}}</span>
                        </span>
                    </el-dropdown-item>
                    <el-dropdown-item
                        @click.native="handleLogOut"
                        divided>Log out</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </el-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { logout } from '@/service/api';

@Component
export default class TheNav extends Vue {
    search = '';

    toAddPost(this: TheNav) {
        this.$router.push('/add-post');
    }

    async handleLogOut(this: TheNav) {
        const res = await logout();
        const { data } = res;
        if (data.status === 200) {
            this.$router.push('/');
        } else {
            this.$message({
                message: data.msg,
                type: 'error',
            });
        }
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

    .nav__avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin: 0 10px;
        cursor: pointer;
    }

    .nav__icon-group {
        outline: none;
        position: absolute;
        right: 15%;
        display: flex;
        align-items: center;
    }

    .nav__username {
        color: $main-text-color;
    }

    .nav__username--strong {
        color: black;
        font-weight: bold;
    }

    .nav__icon-group i {
        font-size: 2rem;
        cursor: pointer;
        margin: 0 10px;
        &:hover {
            color: $brand-color;
        }
    }
</style>
