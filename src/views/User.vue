<template>
    <div>
        <TheNav></TheNav>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TheNav from '@/components/TheNav.vue';
import { authorizeBeforeLoad } from '@/service/api';

@Component({
    components: {
        TheNav,
    },
})
export default class Dashboard extends Vue {
    async created(this: Dashboard) {
        await authorizeBeforeLoad(this);
        console.log(this.$route.params.username);
    }
}
</script>

<style scoped>

</style>
