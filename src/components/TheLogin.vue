<template>
    <div>
        <main class="form">
            <h1 class="form__header">Finstagram</h1>
            <h2 class="form__subheader"
                v-if="!isLogIn">Sign up to see photos and videos from your friends.</h2>
            <el-form
                status-icon
                ref="form"
                :model="user"
                :rules="formRules"
                :key="isLogIn">
                <el-form-item prop="username">
                    <el-input
                        v-model="user.username"
                        placeholder="Username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        v-model="user.password"
                        placeholder="Password"
                        type="password"
                        @keyup.enter.native="submitForm"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="!isLogIn"
                    prop="confirmPassword">
                    <el-input
                        v-model="user.confirmPassword"
                        placeholder="Confirm Password"
                        type="password"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="!isLogIn"
                    prop="firstName">
                    <el-input
                        v-model="user.firstName"
                        placeholder="First Name"></el-input>
                </el-form-item>
                <el-form-item
                    v-if="!isLogIn"
                    prop="lastName">
                    <el-input
                        v-model="user.lastName"
                        placeholder="Last Name"
                        @keyup.enter.native="submitForm"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">{{ buttonContent }}</el-button>
                </el-form-item>
            </el-form>
            <p
                class="form__support"
                :class="{'form__support--light': !isLogIn}">
                {{ supportContent }}
                <span
                    class="form__link"
                    @click="toggleLogIn">{{ linkContent }}</span>
            </p>
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { login, checkUsername, register } from '@/service/api';

@Component
export default class TheLogin extends Vue {
    user = {
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    };

    isLogIn = true;

    get formRules(): void | object {
        if (this.isLogIn) {
            return undefined;
        }
        type Callback = (e?: Error) => void;
        const validatePassword = (rule: any, value: string, callback: Callback): void => {
            if (value === '') {
                callback(new Error('Please confirm your password'));
            } else if (value !== this.user.password) {
                callback(new Error('Passwords are not consistent!'));
            } else {
                callback();
            }
        };
        const validateUsername = async (rule: any, value: string, callback: Callback) => {
            const res = await checkUsername(this.user.username);
            const { data } = res;
            if (data.status !== 200) {
                callback(new Error(data.msg));
            } else {
                callback();
            }
        };
        return {
            username: [
                {
                    required: true,
                    message: 'Please enter a username',
                    trigger: 'blur',
                },
                {
                    min: 6,
                    max: 20,
                    message: 'Length should between 6 to 20 characters',
                    trigger: 'blur',
                },
                {
                    validator: validateUsername,
                    trigger: 'blur',
                },
            ],
            password: [
                {
                    required: true,
                    message: 'Please enter a password',
                    trigger: 'blur',
                },
                {
                    min: 6,
                    max: 16,
                    message: 'Length should between 6 to 16 characters',
                    trigger: 'blur',
                },
            ],
            confirmPassword: [
                {
                    required: true,
                    message: 'Please confirm your password',
                    trigger: 'blur',
                },
                {
                    validator: validatePassword,
                    trigger: 'blur',
                },
            ],
            firstName: [
                {
                    required: true,
                    message: 'Please enter your first name',
                    trigger: 'blur',
                },
                {
                    max: 20,
                    message: 'Length should no larger than 20 characters',
                    trigger: 'blur',
                },
            ],
            lastName: [
                {
                    required: true,
                    message: 'Please enter your last name',
                    trigger: 'blur',
                },
                {
                    max: 20,
                    message: 'Length should no larger than 20 characters',
                    trigger: 'blur',
                },
            ],
        };
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

    toggleLogIn(this: TheLogin): void {
        this.isLogIn = !this.isLogIn;
    }

    submitForm(this: TheLogin) {
        if (this.isLogIn) {
            this.submitLogin();
        } else {
            const { form }: any = this.$refs;
            form.validate((valid: boolean) => {
                if (valid) {
                    this.submitRegister().then(() => this.submitLogin());
                }
            });
        }
    }

    async submitLogin(this: TheLogin) {
        const res = await login(this.user.username, this.user.password);
        const { data } = res;
        if (data.status === 200) {
            this.$router.push('/dashboard');
        } else {
            this.$error(data);
        }
    }

    async submitRegister(this: TheLogin) {
        const res = await register({
            username: this.user.username,
            password: this.user.password,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
        });
        const { data } = res;
        if (data.status !== 200) {
            this.$error(data);
            throw new Error(data.msg);
        }
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
        @include finstagram;
        text-align: center;
    }

    .form__subheader {
        text-align: center;
        color: $regular-text-color;
        font-size: 18px;
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
