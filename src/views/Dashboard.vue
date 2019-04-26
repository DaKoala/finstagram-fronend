<template>
    <div>
        <TheNav/>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TheNav from '@/components/TheNav.vue';
import { Photo, authorizeBeforeLoad, showPhoto } from '@/service/api';

@Component({
    components: {
        TheNav,
    },
})
export default class Dashboard extends Vue {
    photos: Photo[] = [];

    async created(this: Dashboard) {
        await authorizeBeforeLoad(this);
        const { data } = await showPhoto();
        if (data.status === 200) {
            this.photos = data.photos;
        } else {
            this.$error(data);
        }
    }
}
</script>

<style scoped>

</style>
