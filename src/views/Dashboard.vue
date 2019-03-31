<template>
    <TheNav/>
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
        authorizeBeforeLoad(this);
    }
}
</script>

<style scoped>

</style>
