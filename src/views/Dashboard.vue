<template>
    <TheNav/>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TheNav from '@/components/TheNav.vue';

@Component({
    components: {
        TheNav,
    },
})
export default class HelloWorld extends Vue {
    @Prop() private msg!: string;
}
</script>

<style scoped>

</style>
