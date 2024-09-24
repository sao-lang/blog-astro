<script lang="ts" setup>
    import type { CSSProperties } from 'vue';

    const props = defineProps({
        percent: {
            type: Number as PropType<number>,
            default: 0,
        },
        direction: {
            type: String as PropType<'horizontal' | 'vertical'>,
            default: 'horizontal',
        },
        barStyle: {
            type: Object as PropType<CSSProperties>,
            default: () => ({}),
        },
        dotStyle: {
            type: Object as PropType<CSSProperties>,
            default: () => ({}),
        },
        progressStyle: {
            type: Object as PropType<CSSProperties>,
            default: () => ({}),
        },
    });
    const emits = defineEmits(['update:percent', 'mousedown', 'mouseup', 'mousemove', 'change']);

    const bar = ref<HTMLDivElement>();
    const dot = ref<HTMLDivElement>();
    const percent = computed({
        get() {
            const percent = props.percent;
            return percent < 0 ? 0 : percent > 1 ? 1 : percent;
        },
        set(value) {
            emits('update:percent', value);
        },
    });
    const isMouseDown = ref(false);
    const isHorizontal = computed(() => props.direction === 'horizontal');
    const computedProgressStyle = computed(() => {
        if (isHorizontal.value) {
            return { width: `${percent.value * 100}%` };
        }
        return {
            height: `${percent.value * 100}%`,
        };
    });
    const computedBarStyle = computed(() => {
        if (isHorizontal.value) {
            return { left: `${percent.value * 100}%` };
        }
        return {
            bottom: `${percent.value * 100}%`,
        };
    });

    onBeforeUnmount(() => {
        document.removeEventListener('mouseup', handleDocumentMouseUp);
    });

    const handleProcessWidthChange = (e: MouseEvent) => {
        const { offset, maxDistance } = getDiffDistance(e);
        const value = Number((offset / maxDistance).toFixed(4));
        percent.value = value;
        emits('change', value);
    };
    const getDiffDistance = (e: MouseEvent) => {
        const [{ width, left, height, bottom }] = bar.value?.getClientRects()!;
        if (isHorizontal.value) {
            const x = e.pageX - left;
            const maxDistance = width - dot.value!.offsetWidth;
            const offset = x < 0 ? 0 : x > maxDistance ? maxDistance : x;
            return {
                offset,
                maxDistance,
            };
        }
        const y = bottom - e.pageY;
        const maxDistance = height - dot.value!.offsetHeight;
        const offset = y < 0 ? 0 : y > maxDistance ? maxDistance : y;
        return {
            offset,
            maxDistance,
        };
    };
    const handleDotMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        isMouseDown.value = true;
        document.addEventListener('mousemove', handleDotMouseMove);
        document.addEventListener('mouseup', handleDocumentMouseUp);
        handleMouseDown();
    };
    const handleDotMouseMove = (e: MouseEvent) => {
        handleProcessWidthChange(e);
        emits('mousemove', percent.value);
    };
    const handleDocumentMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        isMouseDown.value = false;
        document.removeEventListener('mousemove', handleDotMouseMove);
        handleMouseUp();
    };
    const handleBarMouseUp = (e: MouseEvent) => {
        handleProcessWidthChange(e);
        handleMouseUp();
    };
    const handleMouseDown = (e?: MouseEvent) => {
        e?.stopPropagation();
        emits('mousedown');
    };
    const handleMouseUp = (e?: MouseEvent) => {
        e?.stopPropagation();
        nextTick(() => {
            emits('mouseup', percent.value);
        });
    };
</script>
<template>
    <div
        class="bar"
        :class="{ 'bar--vertical': props.direction === 'vertical' }"
        :style="props.barStyle"
        ref="bar"
        @mousedown="handleMouseDown"
        @mouseup="handleBarMouseUp"
    >
        <div class="bar__progress--wrapper">
            <div
                :class="['bar__progress', { 'add-transition': !isMouseDown }]"
                :style="{ ...props.progressStyle, ...computedProgressStyle }"
            />
        </div>
        <div
            ref="dot"
            :style="{ ...props.dotStyle, ...computedBarStyle }"
            :class="['bar__dot', { 'add-transition': !isMouseDown, 'add-hover': isMouseDown }]"
            @mousedown="handleDotMouseDown"
        >
            <div class="bar__dot--inner"></div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    @use './index.scss';
</style>
