<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="440px"
        @open="handleDialogOpen"
        @close="handleDialogClose">
        <el-tabs v-model="activeTab">
            <el-tab-pane label="Follower request" name="follow"></el-tab-pane>
            <el-tab-pane label="Tag request" name="tag"></el-tab-pane>
        </el-tabs>
        <el-table :data="tableData" v-loading="isLoading">
            <el-table-column :label="labelName" width="220">
                <template slot-scope="scope">
                    <img class="follower__avatar"
                         v-if="activeTab === 'follow'"
                         :src="scope.row.avatar" alt="avatar"/>
                    <span
                        class="follower__username"
                        v-if="activeTab === 'follow'">{{ scope.row.followerUsername }}</span>
                    <a
                        class="tag__link"
                        target="_blank"
                        :href="scope.row.filePath"
                        v-if="activeTab === 'tag'">Photo #{{ scope.row.photoID }}</a>
                </template>
            </el-table-column>
            <el-table-column label="Actions" width="180">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="success"
                        @click="handleRequest(scope.$index, 'accept')">Accept</el-button>
                    <el-button
                        size="small"
                        type="danger"
                        @click="handleRequest(scope.$index, 'decline')">Decline</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script lang="ts">
import {
    Component,
    Prop,
    Watch,
    Vue,
} from 'vue-property-decorator';
import {
    Follower, TagRequest, manageRequest, showRequest, getTag, manageTag,
} from '@/service/api';
import { resolveImagePath } from '@/utils/resolve-image-path';

enum Response {
    Accept,
    Decline,
}

@Component
export default class TheFollowDialog extends Vue {
    @Prop(Boolean) isVisible!: boolean;

    activeTab = 'follow';

    isLoading = false;

    dialogVisible = this.isVisible;

    requestData: Follower[] = [];

    tagData: TagRequest[] = [];

    get title() {
        return this.activeTab === 'follow' ? 'Follower Requests' : 'Tag requests';
    }

    get labelName() {
        return this.activeTab === 'follow' ? 'User' : 'Photo';
    }

    get tableData() {
        return this.activeTab === 'follow' ? this.requestData : this.tagData;
    }

    @Watch('isVisible')
    onVisibleChange(this: TheFollowDialog, val: boolean) {
        this.dialogVisible = val;
    }

    @Watch('activeTab')
    async onTabChange(newTab: string) {
        this.isLoading = true;
        if (newTab === 'follow') {
            await this.loadFollowData();
        } else {
            await this.loadTagData();
        }
        this.isLoading = false;
    }

    async loadFollowData() {
        const { data } = await showRequest();
        if (data.status === 200) {
            this.requestData = data.users.map((item) => {
                const newItem = item;
                newItem.avatar = resolveImagePath(newItem.avatar);
                return newItem;
            });
        } else {
            this.$error(data);
        }
    }

    async loadTagData() {
        const { data } = await getTag();
        if (data.status === 200) {
            this.tagData = data.tags.map((item: TagRequest) => {
                const newItem = item;
                newItem.filePath = resolveImagePath(newItem.filePath);
                return item;
            });
        } else {
            this.$error(data);
        }
    }

    async handleDialogOpen(this: TheFollowDialog) {
        this.isLoading = true;
        await this.loadFollowData();
        this.isLoading = false;
    }

    handleDialogClose(this: TheFollowDialog) {
        this.$emit('close');
    }

    async handleFollowRequest(index: number, response: Response) {
        const { followerUsername } = this.requestData[index];
        const { data } = await manageRequest(followerUsername, response);
        if (data.status === 200) {
            this.requestData.splice(index, 1);
            this.$message({
                message: response === Response.Accept
                    ? `Success! Now ${followerUsername} is your follower!`
                    : `You declined the follower request from ${followerUsername}`,
                type: response === Response.Accept ? 'success' : 'info',
            });
        } else {
            this.$error(data);
        }
    }

    async handleTagRequest(index: number, response: Response) {
        const photo = this.tagData[index];
        const { data } = await manageTag(photo.photoID, response);
        if (data.status === 200) {
            this.tagData.splice(index, 1);
            this.$message({
                message: response === Response.Accept
                    ? 'Tag accepted! It is now visible to anyone having access to the photo.'
                    : 'You declined the tag.',
                type: response === Response.Accept ? 'success' : 'info',
            });
        } else {
            this.$error(data);
        }
    }

    async handleRequest(this: TheFollowDialog, index: number, action: string) {
        const response = action === 'accept' ? Response.Accept : Response.Decline;
        this.isLoading = true;
        if (this.activeTab === 'follow') {
            await this.handleFollowRequest(index, response);
        } else {
            await this.handleTagRequest(index, response);
        }
        this.isLoading = false;

    }
}
</script>

<style lang="scss" scoped>
    @import "../assets/scss/main";
    $avatar-size: 40px;

    .follower__avatar {
        width: $avatar-size;
        height: $avatar-size;
        vertical-align: middle;
        border-radius: 50%;
    }

    .follower__username {
        margin-left: 15px;
        font-size: 16px;
    }

    .tag__link {
        color: $brand-color;
    }
</style>
