<template>
    <div>
        <TheNav></TheNav>
        <main class="container">
            <div class="basic">
                <img class="basic__avatar" :src="user.avatar" alt="Avatar"/>
                <div class="basic__text">
                    <div class="basic__line">
                        <span class="basic__username">{{ user.username }}</span>
                        <el-button
                            v-if="!isMyself"
                            :type="followBtnStyle"
                            :disabled="followBtnDisabled"
                            :loading="buttonLoading"
                            @click="handleClick">{{ followBtnText }}</el-button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import TheNav from '@/components/TheNav.vue';
import {
    authorizeBeforeLoad,
    fetchUserInfo,
    getFollowState,
    followRequest,
    unfollow,
} from '@/service/api';
import { resolveImagePath } from '@/utils/resolve-image-path';

enum FollowState {
    Unaccepted,
    Accepted,
    Unfollowed,
}

@Component({
    components: {
        TheNav,
    },
})
export default class User extends Vue {
    isMyself = false;

    buttonLoading = false;

    user: {
        followState: FollowState,
        avatar: string,
        [key: string]: string | boolean | number,
    } = {
        username: '',
        avatar: '',
        followState: FollowState.Accepted,
    };

    get followBtnText() {
        const state = this.user.followState;
        if (state === FollowState.Unaccepted) {
            return 'Request sent';
        }
        if (state === FollowState.Accepted) {
            return 'Following';
        }
        return 'Follow';
    }

    get followBtnDisabled() {
        const state = this.user.followState;
        return state === FollowState.Unaccepted;
    }

    get followBtnStyle() {
        const state = this.user.followState;
        if (state === FollowState.Unaccepted) {
            return 'info';
        }
        return 'primary';
    }

    @Watch('$route.params.username')
    onUsernameChanged(this: User) {
        this.loadData();
    }

    created(this: User) {
        this.loadData();
    }

    async loadData(this: User) {
        await authorizeBeforeLoad(this);
        const { data } = await fetchUserInfo(this.$route.params.username);
        if (data.status === 200 && data.user) {
            this.setUserInfo(data.user);
            this.checkMyself();
            if (this.isMyself) { return; }
        } else {
            this.$message({
                message: data.msg,
                type: 'error',
            });
            return;
        }
        const res = await getFollowState(this.$route.params.username);
        const followData = res.data;
        if (data.status === 200) {
            this.user.followState = followData.requestState;
        } else {
            this.$error(followData);
        }
    }

    checkMyself(this: User): void {
        this.isMyself = this.user.username === this.$store.state.username;
    }

    setUserInfo(this: User, user: { avatar: string, [key: string]: string | boolean }) {
        Object.keys(this.user).forEach((key) => {
            if (Object.hasOwnProperty.call(user, key)) {
                if (key === 'avatar') {
                    this.user.avatar = resolveImagePath(user.avatar);
                } else {
                    this.user[key] = user[key];
                }
            }
        });
    }

    handleClick() {
        if (this.user.followState === FollowState.Unfollowed) {
            this.handleFollow();
        } else if (this.user.followState === FollowState.Accepted) {
            this.handleUnfollow();
        }
    }

    async handleUnfollow() {
        const { username } = this.$route.params;
        // @ts-ignore
        await this.$confirm('You are unfollowing a person, continue?', 'Unfollow', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning',
        });
        const { data } = await unfollow(username);
        if (data.status === 200) {
            this.user.followState = FollowState.Unfollowed;
            this.$message({
                type: 'success',
                message: `You have unfollowed ${username}.`,
            });
        } else {
            this.$error(data);
        }
    }

    async handleFollow(this: User) {
        this.buttonLoading = true;
        const { data } = await followRequest(this.$route.params.username);
        this.buttonLoading = false;
        if (data.status === 200) {
            this.user.followState = FollowState.Unaccepted;
        } else {
            this.$error(data);
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '../assets/scss/main';

    .container {
        width: 50%;
        margin: 40px auto 0 auto;
        display: flex;
        flex-direction: column;
    }

    .basic {
        display: flex;
        justify-content: center;
    }

    .basic__avatar {
        width: 150px;
        height: 150px;
        border-radius: 50%;
    }

    .basic__text {
        margin-left: 50px;
        padding: 20px 0;
    }

    .basic__line {
        display: flex;
        align-items: center;
    }

    .basic__username {
        font-size: 30px;
        margin-right: 20px;
    }
</style>
