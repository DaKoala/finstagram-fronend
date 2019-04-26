<template>
    <div class="photo">
        <div class="heading">
            <div class="heading__line heading__line--one">
                <span class="heading__username">{{ photo.photoOwner }}</span>
                <span class="heading__support">{{ dateFormat }}</span>
                <span class="heading__support">PhotoID: {{ photo.photoID }}</span>
            </div>
            <div class="heading__line heading__line--two">
                <span class="heading__caption">{{ photo.caption }}</span>
            </div>
        </div>
        <img class="photo__image" alt="a photo" :src="imageUrl" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { resolveImagePath } from '@/utils/resolve-image-path';
import timeAgo from '@/utils/time-format';

@Component
export default class MyPhoto extends Vue {
    @Prop() photo!: {
        photoOwner: string;
        filePath: string;
        timestamp: string;
        caption: string;
        photoID: number;
    };

    get imageUrl() {
        return resolveImagePath(this.photo.filePath);
    }

    get dateFormat() {
        return timeAgo(this.photo.timestamp);
    }
}
</script>

<style lang="scss" scoped>
    @import "../assets/scss/main";

    .photo {
        font-size: 0;
        background-color: white;
        border: 1px solid $first-border-color;
        border-radius: 5px;
        margin-bottom: 50px;
        overflow: hidden;
    }

    .photo__image {
        width: 100%;
    }

    .heading {
        padding: 15px;
        border-bottom: 1px solid $first-border-color;
    }

    .heading__line {
        margin: 0;
    }

    .heading__line--other {
        margin-top: 5px;
    }

    .heading__username {
        font-size: 18px;
        color: $main-text-color;
        font-weight: bold;
    }

    .heading__support {
        font-size: 12px;
        color: $support-text-color;
        margin-left: 5px;
    }

    .heading__caption {
        font-size: 14px;
    }
</style>
