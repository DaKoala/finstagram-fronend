<template>
    <div>
        <TheNav/>
        <main class="groups" v-loading.fullscreen.lock="pageLoading">
            <el-button type="primary"
                       icon="el-icon-plus"
                       @click="createNewGroup"
            >Create new group</el-button>
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
                <el-table-column label="Operations" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="addGroupMember(scope.row)"
                            v-if="scope.row.groupOwner === $store.state.username"
                        >Add member</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </main>
        <el-dialog
            v-loading="formLoading"
            :title="addMemberHeader"
            :visible.sync="addMemberFormVisible">
            <el-form
                :model="newMembersForm"
                label-width="160px"
                :key="addMemberFormVisible"
                ref="memberForm">
                <el-form-item
                    v-for="(member, index) in newMembersForm.newMembers"
                    :label="'member' + (index + 1) + '\'s username'"
                    :key="index"
                    :prop="'newMembers.' + index + '.username'"
                    :rules="{required: true, message: 'Username cannot be empty!', trigger: 'blur'}"
                >
                    <el-input v-model="member.username" class="member-input"></el-input>
                    <el-button @click.prevent="removeMember(index)">Remove</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addMemberInput">Add new</el-button>
                <el-button @click="cancelAddingMember">Cancel</el-button>
                <el-button type="primary" @click="submitMemberForm">Finish</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TheNav from '@/components/TheNav.vue';
import {
    Group, authorizeBeforeLoad, getJoinedGroups, createGroup, addMember,
} from '@/service/api';

interface GroupWithMember extends Group {
    members: string[];
}

@Component({
    components: { TheNav },
})
export default class FriendGroups extends Vue {
    pageLoading = true;

    formLoading = false;

    joinedGroups: GroupWithMember[] = [];

    groupNameToAdd = '';

    groupOwnerToAdd = '';

    newMembersForm = {
        newMembers: [{
            username: '',
        }],
    };

    addMemberFormVisible = false;

    get addMemberHeader() {
        return `Add member to group ${this.groupNameToAdd} owned by ${this.groupOwnerToAdd}`;
    }

    async created() {
        await authorizeBeforeLoad(this);
        const { data } = await getJoinedGroups(true);
        this.pageLoading = false;
        this.joinedGroups = data.groups as GroupWithMember[];
    }

    createNewGroup() {
        this.$prompt('Please enter the name of the new group', 'New Group', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
        })
            .then(({ value }) => createGroup(value))
            .then(({ data }) => {
                if (data.status === 200) {
                    this.insertMyNewGroup(data.groupName);
                    this.$message({
                        message: 'A new group has been created.',
                        type: 'success',
                    });
                } else {
                    this.$error(data);
                }
            })
            .catch(() => {});
    }

    insertMyNewGroup(groupName: string) {
        const myUsername = this.$store.state.username;
        const newGroup: GroupWithMember = {
            groupOwner: myUsername,
            members: [myUsername],
            groupName,
        };
        this.joinedGroups.unshift(newGroup);
    }

    addGroupMember(group: Group) {
        this.groupNameToAdd = group.groupName;
        this.groupOwnerToAdd = group.groupOwner;
        this.addMemberFormVisible = true;
    }

    addMemberInput() {
        this.newMembersForm.newMembers.push({
            username: '',
        });
    }

    cancelAddingMember() {
        this.addMemberFormVisible = false;
        this.newMembersForm = {
            newMembers: [{
                username: '',
            }],
        };
    }

    removeMember(index: number) {
        this.newMembersForm.newMembers.splice(index, 1);
    }

    submitMemberForm() {
        // @ts-ignore
        this.$refs.memberForm.validate(async (valid) => {
            if (valid) {
                const members = this.newMembersForm.newMembers.map(member => member.username);
                this.formLoading = true;
                const { data } = await addMember(this.groupNameToAdd, members);
                this.formLoading = false;
                if (data.status === 200) {
                    let modifiedGroup: GroupWithMember;
                    for (let i = 0; i < this.joinedGroups.length; i += 1) {
                        const { groupName, groupOwner } = this.joinedGroups[i];
                        if (groupName === this.groupNameToAdd
                            && groupOwner === this.groupOwnerToAdd) {
                            modifiedGroup = this.joinedGroups[i];
                            break;
                        }
                    }
                    // @ts-ignore
                    modifiedGroup.members.push(...data.newMembers);
                    this.addMemberFormVisible = false;
                    this.$message({
                        message: 'Your friends have been added to the group.',
                        type: 'success',
                    });
                } else {
                    this.$error(data);
                }
            }
        });
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
    .member-input {
        width: 50%;
        margin-right: 10px;
    }
</style>
