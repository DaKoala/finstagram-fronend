<template>
    <el-dialog
        title="Follower Requests"
        v-loading="isLoading"
        :visible.sync="dialogVisible"
        @open="handleDialogOpen"
        @close="handleDialogClose">
        <el-table :data="requestData">
            <el-table-column label="User" width="180">
                <template slot-scope="scope">
                    <img class="follower__avatar" :src="scope.row.avatar" alt="avatar"/>
                    <span class="follower__username">{{ scope.row.followerUsername }}</span>
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
import { Follower, showRequest } from '@/service/api';
import { resolveImagePath } from '@/utils/resolve-image-path';

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
}
</script>

<style lang="scss" scoped>
    $avatar-size: 30px;

    .follower__avatar {
        width: $avatar-size;
        height: $avatar-size;
        border-radius: 50%;
    }
</style>
