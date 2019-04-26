<template>
    <div>
        <TheNav/>
        <main class="photo-container">
            <MyPhoto></MyPhoto>
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TheNav from '@/components/TheNav.vue';
import MyPhoto from '@/components/MyPhoto.vue';
import { Photo, authorizeBeforeLoad, showPhoto } from '@/service/api';

@Component({
    components: {
        TheNav,
        MyPhoto,
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
    .photo-container {
        margin: 50px auto 0 auto;
        width: 100%;
        max-width: 700px;
    }
</style>
