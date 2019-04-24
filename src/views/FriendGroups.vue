<template>
    <div>
        <TheNav/>
        <main class="groups" v-loading.fullscreen.lock="pageLoading">
            <el-button type="primary" icon="el-icon-plus">Create new group</el-button>
            <h2>Groups I belong to</h2>
            <el-table
                :data="joinedGroups"
                border
                class="groups__table">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="groups__expand">
                            <el-form-item
                                label="Member:"
                                v-for="member in props.row.members"
                                :key="member">
                                <div>{{ member }}</div>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="groupName"
                    label="Group"
                    align="center"
                    ></el-table-column>
                <el-table-column
                    prop="groupOwner"
                    label="Owner"
                    align="center"
                ></el-table-column>
            </el-table>
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TheNav from '@/components/TheNav.vue';
import { Group, getJoinedGroups } from '@/service/api';

@Component({
    components: { TheNav },
})
export default class FriendGroups extends Vue {
    pageLoading = true;

    joinedGroups: Group[] = [];

    async created() {
        const { data } = await getJoinedGroups(true);
        this.pageLoading = false;
        this.joinedGroups = data.groups;
    }
}
</script>

<style lang="scss" scoped>
    @import "../assets/scss/main";

    .groups {
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .groups__table {
        width: 50%;
        font-size: 16px;
    }

    .groups__expand {
        font-size: 0;
    }
    .groups__expand label {
        width: 90px;
        color: #99a9bf;
    }
    .groups__expand .el-form-item {
        display: block;
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
