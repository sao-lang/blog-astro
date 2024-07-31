<script setup lang="ts">
    import { ref, type CSSProperties, watch } from 'vue';

    const props = withDefaults(
        defineProps<{
            width?: number | string;
            height?: number | string;
            thumbColor?: string;
            trackColor?: string;
            percent?: number;
            trackStyle?: CSSProperties;
            thumbStyle?: CSSProperties;
            direction?: 'x' | 'y';
        }>(),
        { width: '150px', height: '6px', percent: 0, direction: 'x' },
    );

    const trackRef = ref<HTMLDivElement>();

    const emits = defineEmits(['change', 'update:percent']);

    const handleClickTrack = (e: MouseEvent) => {
        const percent = Number((e.offsetX / trackRef.value?.offsetWidth!).toFixed(4));
        emits('change', percent);
        emits('update:percent', percent);
    };
</script>
<template>
    <div
        :style="{
            width: typeof width === 'number' ? width + 'px' : width,
            height: typeof height === 'number' ? height + 'px' : height,
            backgroundColor: trackColor ?? 'rgba(0, 0, 0, .5)',
            ...(trackStyle || {}),
        }"
        class="progress-track"
        @click="handleClickTrack"
        ref="trackRef"
    >
        <div
            class="progress-thumb"
            :style="{
                width: direction === 'x' ? percent * 100 + '%' : '100%',
                height: direction === 'y' ? percent * 100 + '%' : '100%',
                backgroundColor: thumbColor ?? 'rgba(222, 222, 222, .75)',
                ...(thumbStyle || {}),
            }"
        >
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @use './index.scss';
</style>
