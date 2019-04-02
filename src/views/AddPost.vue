<template>
    <div>
        <TheNav/>
        <main class="post">
            <el-form>
                <el-form-item>
                    <el-upload
                        class="photo-uploader"
                        name="imageToUpload"
                        :model="post"
                        :action="host"
                        :show-file-list="false"
                        :on-success="handleImageSuccess"
                        >
                        <img v-if="imageUrl" :src="imageUrl" class="photo">
                        <i class="el-icon-plus photo-uploader__icon" v-else></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="post.caption"
                              prefix-icon="el-icon-edit-outline"
                              placeholder="Add caption"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-switch
                        v-model="post.allFollowers"
                        active-text="Visible to all followers"></el-switch>
                </el-form-item>
                <el-form-item class="post__button-container">
                    <el-button
                        type="primary"
                        :loading="buttonLoading"
                        :disabled="buttonDisabled"
                        @click="submitPost">{{postButton}}</el-button>
                    <el-button
                        :loading="buttonLoading"
                        :disabled="buttonDisabled"
                        @click="toDashboard">Back</el-button>
                </el-form-item>
            </el-form>
        </main>
    </div>
</template>

<script lang="ts">
import BASE_URL from '../service/config';
import { Component, Prop, Vue } from 'vue-property-decorator';
import TheNav from '@/components/TheNav.vue';
import { authorizeBeforeLoad, addPost } from '@/service/api';

@Component({
    components: {
        TheNav,
    },
})
export default class AddPost extends Vue {
    host = `${BASE_URL}/uploadImage`;

    imageUrl = '';

    postButton = 'Post';

    post = {
        fileName: '',
        caption: '',
        allFollowers: false,
    };

    buttonLoading = false;

    buttonDisabled = false;

    async created(this: AddPost) {
        authorizeBeforeLoad(this);
    }

    handleImageSuccess(this: AddPost, res: any, file: any) {
        if (res.status === 200) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.post.fileName = res.imageName;
        } else {
            this.$message({
                message: res.msg,
                type: 'error',
            });
        }
    }

    async submitPost(this: AddPost) {
        this.buttonLoading = true;
        const res = await addPost(this.post.fileName, this.post.caption, this.post.allFollowers);
        this.buttonLoading = false;
        const { data } = res;
        if (data.status === 200) {
            this.buttonDisabled = true;
            this.$message({
                message: 'Post success! You will return to dashboard in 3 seconds.',
                type: 'success',
            });
            setTimeout(() => {
                this.$router.push('/dashboard');
            }, 3000);
        } else {
            this.$message({
                message: data.msg,
                type: 'error',
            });
        }
    }

    toDashboard(this: AddPost) {
        this.$router.push('/dashboard');
    }
}
</script>

<style lang="scss" scoped>
    @import "../assets/scss/main";
    $photo-width: 200px;
    $photo-height: $photo-width;

    .post {
        width: 40%;
        margin: 50px auto 0 auto;
    }

    .post__button-container {
        @include center-flex;
    }

    .photo-uploader {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: $photo-width;
        height: $photo-height;
        margin: 0 auto;
    }
    .photo-uploader:hover {
        border-color: #409EFF;
    }
    .photo-uploader__icon {
        font-size: 28px;
        color: #8c939d;
        width: $photo-width;
        height: $photo-height;
        line-height: 178px;
        text-align: center;
    }
    .photo {
        width: $photo-width;
        height: $photo-height;
        display: block;
    }
</style>
