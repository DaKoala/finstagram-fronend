<template>
  <div class="home">
      <TheLogin/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TheLogin from '@/components/TheLogin.vue';
import { authorize } from '@/service/api';

@Component({
    components: {
        TheLogin,
    },
})
export default class Home extends Vue {
    async created(this: Home) {
        const res = await authorize();
        const { data } = res;
        if (data.status === 200) {
            this.$router.push('/dashboard');
        }
    }
}
</script>

<style lang="scss" scoped>
    .home {
        display: flex;
        justify-content: center;
        margin-top: 20vh;
    }
</style>
