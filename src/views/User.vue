<template>
    <div>
        <TheNav></TheNav>

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
        if (data.status === 200) {
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

</style>
