<template>
    <div class="player"></div>
</template>

<script setup lang="ts">
    import { songs } from '@/mock/songs';
</script>

<style lang="scss">
    @import '@lania/utils-scss/mixin.scss';
    .player {
        @include fixed($left: 0, $bottom: 0);
        @include box-model($width: 66px, $height: 66px);
        @include background($color: var(--bg-color));
    }
</style>
