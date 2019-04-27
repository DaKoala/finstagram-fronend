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
                <font-awesome-icon
                    v-if="liked"
                    class="like"
                    :icon="['fas', 'heart']"></font-awesome-icon>
                <font-awesome-icon
                    v-else
                    @click="handleLikePhoto"
                    :icon="['far', 'heart']"></font-awesome-icon>
                <font-awesome-icon
                    :icon="['fas', 'tag']"
                    :class="{active: option === 1}"
                    @click="select(1)"
                ></font-awesome-icon>
                <font-awesome-icon
                    :icon="['fas', 'comment']"
                    :class="{active: option === 2}"
                    @click="select(2)"></font-awesome-icon>
            </div>
            <div class="extension__content">
                <template v-if="option === 1">
                    <font-awesome-icon
                        v-if="people.length > 0"
                        :icon="['fas', 'tags']"
                        class="extension__icon"></font-awesome-icon>
                    <span class="extension__name" v-if="people.length > 0">{{ names }}</span>
                    <el-form inline>
                        <el-form-item label="Who's in the photo?">
                            <el-input v-model="usernameToTag"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitTag">Tag</el-button>
                        </el-form-item>
                    </el-form>
                </template>
                <template v-else-if="option === 2">
                    <p
                        class="comment"
                        v-for="(comment, index) in comments"
                        :key="index">
                        <span class="comment__name">{{ comment.username }}: </span>
                        <span class="comment__content">{{ comment.commentText }}</span>
                    </p>
                    <el-form>
                        <el-form-item>
                            <el-input
                                type="textarea"
                                :autosize="{minRows: 1, maxRows: 4}"
                                placeholder="Comment here"
                                v-model="commentText"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitComment">Comment</el-button>
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
import {
    TaggedPerson, Comment, tagPhoto, photoTag, isLiked, likePhoto, getComment, postComment,
} from '@/service/api';
import timeAgo from '@/utils/time-format';

enum UserOption {
    None,
    Tag,
    Comments,
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

    liked = false;

    hasPeople = false;

    hasComment = false;

    commentText = '';

    comments: Comment[] = [];

    people: TaggedPerson[] = [];

    get imageUrl() {
        return resolveImagePath(this.photo.filePath);
    }

    get dateFormat() {
        return timeAgo(this.photo.timestamp);
    }

    get names() {
        return this.people.map(person => `${person.fname} ${person.lname}`).join(', ');
    }

    async created() {
        const { data } = await isLiked(this.photo.photoID);
        if (data.status === 200) {
            this.liked = data.liked;
        } else {
            this.$error(data);
        }
    }

    select(option: UserOption) {
        if (this.option === option) {
            this.option = UserOption.None;
        } else {
            this.option = option;
            if (option === UserOption.Tag && !this.hasPeople) {
                this.getTaggedPeople();
            }
            if (option === UserOption.Comments && !this.hasComment) {
                this.getComment();
            }
        }
    }

    async getTaggedPeople() {
        const { data } = await photoTag(this.photo.photoID);
        if (data.status === 200) {
            this.people = data.people;
            this.hasPeople = true;
        } else {
            this.$error(data);
        }
    }

    async getComment() {
        const { data } = await getComment(this.photo.photoID);
        if (data.status === 200) {
            this.comments = data.comments;
            this.hasComment = true;
        } else {
            this.$error(data);
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

    async submitComment() {
        if (this.commentText === '') {
            this.$message({
                type: 'error',
                message: 'Comment cannot be empty!',
            });
            return;
        }
        const { data } = await postComment(this.photo.photoID, this.commentText);
        if (data.status === 200) {
            this.comments.unshift({
                username: this.$store.state.username,
                commentText: data.commentText,
            });
            this.commentText = '';
            this.$message({
                type: 'success',
                message: 'Comment success!',
            });
        } else {
            this.$error(data);
        }
    }

    async handleLikePhoto() {
        const { data } = await likePhoto(this.photo.photoID);
        if (data.status === 200) {
            this.liked = true;
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

    .like {
        color: $danger-color;
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

    .extension__icon {
        vertical-align: middle;
        color: $support-text-color;
    }

    .extension__buttons svg {
        margin-right: 15px;
        cursor: pointer;
    }

    .extension__content {
        margin-top: 10px;
    }

    .extension__name {
        margin-left: 5px;
        font-size: 16px;
        font-weight: bold;
        color: $main-text-color;
    }

    .comment {
        margin: 2px 0;
        font-size: 14px;
    }

    .comment__name {
        font-weight: bold;
        color: $main-text-color;
    }

    .comment__content {
        color: $regular-text-color;
    }
</style>
