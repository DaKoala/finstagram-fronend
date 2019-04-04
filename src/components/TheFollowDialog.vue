<template>
    <el-dialog
        title="Follower Requests"
        v-loading="isLoading"
        :visible.sync="isVisible"
        @close="handleDialogClose">
        <el-table :data="requestData">
            <el-table-column label="User" width="180">
                <template slot-scope="scope">
                    <img class="follower__avatar" :src="scope.avatar" alt="avatar"/>
                    <span class="follower__username">{{ scope.username }}</span>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TheFollowDialog extends Vue {
    @Prop(Boolean) isVisible!: boolean;

    isLoading = false;

    requestData = [];

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
