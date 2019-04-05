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
                <el-form-item class="center-container" v-if="!post.allFollowers">
                    <el-transfer
                        v-model="post.sharedGroupsIndex"
                        v-loading="transferLoading"
                        :titles="['Joined groups', 'Photo shared in:']"
                        :button-texts="['Not share', 'Share']"
                        :data="joinedGroupsInTransfer"></el-transfer>
                </el-form-item>
                <el-form-item class="center-container">
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
import { Component, Watch, Vue } from 'vue-property-decorator';
import TheNav from '@/components/TheNav.vue';
import {
    Group,
    authorizeBeforeLoad,
    addPost,
    getJoinedGroups,
} from '@/service/api';

interface DisplayedGroup {
    key: number,
    label: string,
    disabled?: boolean,
}

@Component({
    components: {
        TheNav,
    },
})
export default class AddPost extends Vue {
    host = `${BASE_URL}/uploadImage`;

    imageUrl = '';

    postButton = 'Post';

    joinedGroups: Group[] = [];

    post = {
        fileName: '',
        caption: '',
        sharedGroupsIndex: [],
        allFollowers: true,
    };

    transferLoading = false;

    buttonLoading = false;

    buttonDisabled = false;

    get joinedGroupsInTransfer(): DisplayedGroup[] {
        return this.joinedGroups.map((item, index) => ({
            key: index,
            label: `${item.groupName} - ${item.groupOwner}`,
        }));
    }

    @Watch('post.allFollowers')
    async onAllFollowersChange(this: AddPost, val: boolean) {
        if (!val) {
            this.transferLoading = true;
            const { data } = await getJoinedGroups();
            this.transferLoading = false;
            if (data.status === 200) {
                this.joinedGroups = data.groups;
            } else {
                this.$error(data);
                this.joinedGroups = [];
            }
        }
    }

    async created(this: AddPost) {
        authorizeBeforeLoad(this);
    }

    handleImageSuccess(this: AddPost, res: any, file: any) {
        if (res.status === 200) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.post.fileName = res.imageName;
        } else {
            this.$error(res);
        }
    }

    async submitPost(this: AddPost) {
        this.buttonLoading = true;
        const sharedGroups: Group[] = [];
        this.post.sharedGroupsIndex.forEach((item) => {
            sharedGroups.push(this.joinedGroups[item]);
        });
        const res = await addPost({
            fileName: this.post.fileName,
            caption: this.post.caption,
            allFollowers: this.post.allFollowers,
            sharedGroups,
        });
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
            this.$error(data);
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

    .center-container {
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
