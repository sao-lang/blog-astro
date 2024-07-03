<script lang="ts" setup>
    import { computed, onBeforeUnmount, ref, type PropType, watch, nextTick } from 'vue';

    const props = defineProps({
        percent: {
            type: Number as PropType<number>,
            default: 0,
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

    onBeforeUnmount(() => {
        removeEvent();
    });

    const removeEvent = () => {
        document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
    const handleProcessWidthChange = (e: MouseEvent) => {
        const [{ width, left }] = bar.value?.getClientRects()!;
        const x = e.pageX - left;
        const maxX = width - dot.value!.offsetWidth;
        const offsetX = x < 0 ? 0 : x > maxX ? maxX : x;
        const value = Number((offsetX / maxX).toFixed(4));
        percent.value = value;
        emits('change', value);
    };
    const handleDotMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        isMouseDown.value = true;
        window.addEventListener('mousemove', handleDotMouseMove);
        window.addEventListener('mouseup', handleDocumentMouseUp);
        handleMouseDown();
    };
    const handleDotMouseMove = (e: MouseEvent) => {
        handleProcessWidthChange(e);
        emits('mousemove', percent.value);
    };
    const handleDocumentMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        isMouseDown.value = false;
        window.removeEventListener('mousemove', handleDotMouseMove);
        handleMouseUp();
    };
    const handleBarMouseUp = (e: MouseEvent) => {
        handleProcessWidthChange(e);
        handleMouseUp();
    };
    const handleMouseDown = () => {
        emits('mousedown');
    };
    const handleMouseUp = () => {
        nextTick(() => {
            emits('mouseup', percent.value);
        });
    };
</script>
<template>
    <div
        class="bar"
        ref="bar"
        @mousedown="handleMouseDown"
        @mouseup="handleBarMouseUp"
    >
        <div class="progress-wrapper">
            <div
                :class="['progress', { 'add-transition': !isMouseDown }]"
                :style="{ width: `${percent * 100}%` }"
            />
        </div>
        <div
            ref="dot"
            :style="{ left: `${percent * 100}%` }"
            :class="['dot', { 'add-transition': !isMouseDown, 'add-hover': isMouseDown }]"
            @mousedown="handleDotMouseDown"
        />
    </div>
</template>
<style lang="scss" scoped>
    @use './index.scss';
</style>
