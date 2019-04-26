<template>
    <div class="photo">
        <div class="heading">
            <p>
                <span>{{ username }}</span>
                <span>{{ dateFormat }}</span>
            </p>
            <p>{{ caption }}</p>
        </div>
        <img class="photo__image" alt="a photo" :src="imageUrl" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { resolveImagePath } from '@/utils/resolve-image-path';
import { timeAgo } from '@/utils/time-format';

@Component
export default class MyPhoto extends Vue {
    @Prop() username: string = 'billyzou';

    @Prop() filePath: string = '7fffffffef24f5a1.jpg';

    @Prop() timestamp: string = 'Thu, 04 Apr 2019 21:16:01 GMT';

    @Prop() caption: string = 'My avatar';

    get imageUrl() {
        return resolveImagePath(this.filePath);
    }

    get dateFormat() {
        return timeAgo(this.timestamp);
    }
}
</script>

<style lang="scss" scoped>
    @import "../assets/scss/main";

    .photo {
        background-color: white;
        border: 1px solid $first-border-color;
        border-radius: 5px;
    }
    .photo__image {
        width: 100%;
    }
</style>
