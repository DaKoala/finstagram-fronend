<template>
    <el-dialog
        title="Follower Requests"
        :visible.sync="dialogVisible"
        width="440px"
        @open="handleDialogOpen"
        @close="handleDialogClose">
        <el-table :data="requestData" v-loading="isLoading">
            <el-table-column label="User" width="220">
                <template slot-scope="scope">
                    <img class="follower__avatar" :src="scope.row.avatar" alt="avatar"/>
                    <span class="follower__username">{{ scope.row.followerUsername }}</span>
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
import { Follower, manageRequest, showRequest } from '@/service/api';
import { resolveImagePath } from '@/utils/resolve-image-path';

enum Response {
    Accept,
    Decline,
}

@Component
export default class TheFollowDialog extends Vue {
    @Prop(Boolean) isVisible!: boolean;

    isLoading = false;

    dialogVisible = this.isVisible;

    requestData: Follower[] = [];

    @Watch('isVisible')
    onVisibleChange(this: TheFollowDialog, val: boolean) {
        this.dialogVisible = val;
    }

    async handleDialogOpen(this: TheFollowDialog) {
        this.isLoading = true;
        const { data } = await showRequest();
        this.isLoading = false;
        if (data.status === 200) {
            if (data.users.length === 0) {
                this.dialogVisible = false;
                this.handleDialogClose();
                this.$message({
                    message: 'You have no follower request.',
                });
            } else {
                this.requestData = data.users.map((item) => {
                    const newItem = item;
                    newItem.avatar = resolveImagePath(newItem.avatar);
                    return newItem;
                });
            }
        } else {
            this.$error(data);
        }
    }

    handleDialogClose(this: TheFollowDialog) {
        this.$emit('close');
    }

    async handleRequest(this: TheFollowDialog, index: number, action: string) {
        const response = action === 'accept' ? Response.Accept : Response.Decline;
        this.isLoading = true;
        const { followerUsername } = this.requestData[index];
        const { data } = await manageRequest(followerUsername, response);
        this.isLoading = false;
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
}
</script>

<style lang="scss" scoped>
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
</style>
