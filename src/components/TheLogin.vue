<template>
    <div>
        <main class="form">
            <h1 class="form__header">Finstagram</h1>
            <h2 class="form__subheader"
                v-if="!isLogIn">Sign up to see photos and videos from your friends.</h2>
            <el-form
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
                        type="password"></el-input>
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
                        placeholder="Last Name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">{{ buttonContent }}</el-button>
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

        toggleLogIn(this: TheLogin): void {
            this.isLogIn = !this.isLogIn;
        }

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
