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
                    <el-button type="primary">{{ buttonContent }}</el-button>
                </el-form-item>
            </el-form>
            <p class="form__support" :class="{'form__support--light': !isLogIn}">
                {{ supportContent }}
                <span class="form__link" @click="toggleLogIn">{{ linkContent }}</span>
            </p>
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

    isLogIn = true;

    toggleLogIn(this: TheLogin): void {
        this.isLogIn = !this.isLogIn;
    }

    get supportContent(): string {
        return this.isLogIn ? 'Don\'t have an account?' : 'Have an account?';
    }

    get buttonContent(): string {
        return this.isLogIn ? 'Log In' : 'Sign Up';
    }

    get linkContent(): string {
        return this.isLogIn ? 'Sign up' : 'Log in';
    }
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
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        text-align: center;
    }

    .form__support {
        color: $main-text-color;
        text-align: center;
    }

    .form__support--light {
        color: $support-text-color;
    }

    .form__link {
        color: $brand-color;
        cursor: pointer;
    }
</style>
