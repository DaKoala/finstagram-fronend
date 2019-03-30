<template>
    <div>
        <main class="form">
            <h1 class="form__header">Finstagram</h1>
            <el-form :model="user">
                <el-form-item>
                    <el-input v-model="user.username"
                              placeholder="Username"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="user.password"
                              placeholder="Password"
                              type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">Sign in</el-button>
                </el-form-item>
            </el-form>
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TheLogin extends Vue {
    user = {
        username: '',
        password: '',
        passwordCheck: '',
        firstName: '',
        lastName: '',
    };
}
</script>

<style lang="scss" scoped>
    @import '../assets/scss/main';

    .form {
        background-color: white;
        border-radius: 10px;
        padding: 15px;
        border: 1px solid $first-border-color;
        max-width: 80vw;
        width: 500px;
        min-width: 25vw;
    }

    .form button {
        display: block;
        margin: 0 auto;
    }

    .form__header {
        text-align: center;
    }
</style>
