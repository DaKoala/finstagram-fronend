<template>
    <div>
        <TheNav></TheNav>
        <main class="container">
            <div class="basic">
                <img class="basic__avatar" :src="user.avatar" alt="Avatar"/>
                <div class="basic__text">
                    <span class="basic__username">{{ user.username }}</span>
                    <el-button>Follow</el-button>
                </div>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TheNav from '@/components/TheNav.vue';
import { authorizeBeforeLoad, fetchUserInfo } from '@/service/api';
import resolveImagePath from '@/utils/resolve-image-path';

@Component({
    components: {
        TheNav,
    },
})
export default class User extends Vue {
    user: {
        avatar: string,
        [key: string]: string | boolean,
    } = {
        username: '',
        avatar: '',
    };

    async created(this: User) {
        await authorizeBeforeLoad(this);
        const { data } = await fetchUserInfo(this.$route.params.username);
        if (data.status === 200 && data.user) {
            this.setUserInfo(data.user);
        } else {
            this.$message({
                message: data.msg,
                type: 'error',
            });
        }
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
        width: 200px;
        height: 200px;
        border-radius: 50%;
    }

    .basic__text {
        margin-left: 50px;
        padding: 20px 0;
    }

    .basic__username {
        font-size: 30px;
    }
</style>
