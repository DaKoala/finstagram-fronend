<template>
    <el-menu
        mode="horizontal"
        class="nav">
        <router-link
            to="/dashboard"
            class="nav__header">Finstagram</router-link>
        <el-autocomplete
            class="nav__search"
            placeholder="Search"
            prefix-icon="el-icon-search"
            v-model="searchQuery"
            :fetch-suggestions="handleSearch"
            @select="handleSelect"
            clearable>
            <template slot-scope="{ item }">
                <img class="autocomplete__avatar" :src="item.avatar" alt="avatar"/>
                <span class="autocomplete__text" >{{ item.username }}</span>
            </template>
        </el-autocomplete>
        <div class="nav__icon-group">
            <i
                class="el-icon-circle-plus-outline icon--plus"
                title="Post Photo"
                @click="toAddPost"></i>
            <i class="el-icon-bell"
               title="Follower Requests"
               @click="handleRequestPopup"></i>
            <el-dropdown>
                <img class="nav__avatar"
                     :src="$store.state.avatar"
                     alt="Avatar"
                     @click="toUserMyself"/>
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
        <TheFollowDialog :is-visible="dialogVisible" @close="handleRequestClose"></TheFollowDialog>
    </el-menu>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { logout, searchFriend, SearchFriendUser } from '@/service/api';
import resolveImagePath from '@/utils/resolve-image-path';
import TheFollowDialog from '@/components/TheFollowDialog.vue';

@Component({
    components: {
        TheFollowDialog,
    },
})
export default class TheNav extends Vue {
    searchQuery = '';

    dialogVisible = false;

    timeout: any = null;

    toAddPost(this: TheNav) {
        this.$router.push('/add-post');
    }

    handleRequestPopup(this: TheNav) {
        this.dialogVisible = true;
    }

    handleRequestClose(this: TheNav) {
        this.dialogVisible = false;
    }

    async handleLogOut(this: TheNav) {
        const res = await logout();
        const { data } = res;
        if (data.status === 200) {
            this.$router.push('/');
        } else {
            this.$error(data);
        }
    }

    toUserMyself(this: TheNav) {
        this.$router.push({
            name: 'user',
            params: {
                username: this.$store.state.username,
            },
        });
    }

    handleSearch(this: TheNav, queryString: string, cb: (results: SearchFriendUser[]) => void) {
        clearTimeout(this.timeout);
        if (queryString === '') {
            cb([]);
        } else {
            this.timeout = setTimeout(async () => {
                const res = await searchFriend(queryString);
                const { data } = res;
                if (data.status === 200) {
                    const myName = this.$store.state.username;
                    interface UserItem {
                        avatar: string,
                        username: string,
                    }
                    const result = data.users.map((item: UserItem) => {
                        const newItem = item;
                        newItem.avatar = resolveImagePath(newItem.avatar);
                        return newItem;
                    }).filter((item: UserItem) => item.username !== myName);
                    cb(result);
                } else {
                    cb([]);
                    this.$error(data);
                }
            }, 1000);
        }
    }

    handleSelect(this: TheNav, item: { username: string, avatar: string}) {
        console.log(item);
        this.$router.push({
            name: 'user',
            params: {
                username: item.username,
            },
        });
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

    .autocomplete__avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        vertical-align: middle;
    }

    .autocomplete__text {
        text-overflow: ellipsis;
        margin-left: 5px;
        font-weight: bold;
    }
</style>
