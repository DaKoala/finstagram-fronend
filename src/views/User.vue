<template>
    <div>
        <TheNav></TheNav>
        <main class="container">
            <div class="basic">
                <img class="basic__avatar" :src="user.avatar" alt="Avatar"/>
                <div class="basic__text">
                    <div class="basic__line">
                        <span class="basic__username">{{ user.username }}</span>
                        <el-button>Follow</el-button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TheNav from '@/components/TheNav.vue';
import { authorizeBeforeLoad, fetchUserInfo, getFollowState } from '@/service/api';
import resolveImagePath from '@/utils/resolve-image-path';

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

    user: {
        followState: FollowState,
        avatar: string,
        [key: string]: string | boolean | number,
    } = {
        username: '',
        avatar: '',
        followState: FollowState.Accepted,
    };

    async created(this: User) {
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
            this.$message({
                message: followData.msg,
                type: 'error',
            });
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
