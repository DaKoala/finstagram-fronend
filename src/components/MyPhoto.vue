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
        <div class="extension">
            <div class="extension__buttons">
                <font-awesome-icon :icon="['far', 'heart']"></font-awesome-icon>
                <font-awesome-icon
                    :icon="['fas', 'tag']"
                    :class="{active: option === 1}"
                    @click="select(1)"
                ></font-awesome-icon>
                <font-awesome-icon :icon="['fas', 'comment']"></font-awesome-icon>
            </div>
            <div class="extension__content">
                <template v-if="option === 1">
                    <el-form inline>
                        <el-form-item label="Who's in the photo?">
                            <el-input v-model="usernameToTag"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitTag">Tag</el-button>
                        </el-form-item>
                    </el-form>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { resolveImagePath } from '@/utils/resolve-image-path';
import timeAgo from '@/utils/time-format';
import { tagPhoto } from '@/service/api';

enum UserOption {
    None,
    Tag,
    Comment,
}

@Component
export default class MyPhoto extends Vue {
    @Prop() photo!: {
        photoOwner: string;
        filePath: string;
        timestamp: string;
        caption: string;
        photoID: number;
    };

    option = UserOption.None;

    usernameToTag = '';

    get imageUrl() {
        return resolveImagePath(this.photo.filePath);
    }

    get dateFormat() {
        return timeAgo(this.photo.timestamp);
    }

    select(option: UserOption) {
        if (this.option === option) {
            this.option = UserOption.None;
        } else {
            this.option = option;
        }
    }

    async submitTag() {
        if (this.usernameToTag === '') {
            this.$message({
                message: 'Target username cannot be empty!',
                type: 'error',
            });
            return;
        }
        const { data } = await tagPhoto(this.photo.photoID, this.usernameToTag);
        if (data.status === 200) {
            this.$message({
                message: data.msg,
                type: 'success',
            });
            this.usernameToTag = '';
        } else {
            this.$error(data);
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../assets/scss/main";

    .active {
        color: $brand-color;
    }

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

    .extension {
        font-size: 24px;
        padding: 10px 20px;
    }

    .extension__buttons {
        color: $regular-text-color;
    }

    .extension__buttons svg {
        margin-right: 15px;
        cursor: pointer;
    }

    .extension__content {
        margin-top: 10px;
    }
</style>
