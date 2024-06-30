<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, type PropType, watch } from 'vue';

const props = defineProps({
    percent: {
        type: Number as PropType<number>,
        default: 0,
    }
});
const emits = defineEmits(['update:percent', 'mousedown', 'mouseup', 'mousemove', 'change'])

const bar = ref<HTMLDivElement>();
const dot = ref<HTMLDivElement>();
const dotLeft = ref(0)
const percent = computed({
    get() {
        const percent = props.percent;
        return percent < 0 ? 0 : percent > 1 ? 1 : percent;
    },
    set(value) {
        emits('update:percent', value);
    }
});
const isMouseDown = ref(false);

watch(() => percent.value, () => {
    dotLeft.value = (bar.value!.offsetWidth - dot.value!.offsetWidth / 2) * percent.value;
})
onBeforeUnmount(() => {
    removeEvent();
})

const removeEvent = () => {
    document.removeEventListener('mouseup', handleDocumentMouseUp);
}
const handleProcessWidthChange = (e: MouseEvent) => {
    const [{ width, left }] = bar.value?.getClientRects()!;
    const x = e.pageX - left;
    const maxX = width - dot.value!.offsetWidth;
    if (x < 0 || x > maxX) {
        return;
    }
    const value = Number((x / maxX).toFixed(2));
    percent.value = value;
    emits('change', value);
}
const handleDotMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    isMouseDown.value = true;
    window.addEventListener('mousemove', handleDotMouseMove);
    window.addEventListener('mouseup', handleDocumentMouseUp);
    emits('mousedown');
}
const handleDotMouseMove = (e: MouseEvent) => {
    handleProcessWidthChange(e);
    emits('mousemove', percent.value);
}
const handleDocumentMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    isMouseDown.value = false;
    window.removeEventListener('mousemove', handleDotMouseMove);
    emits('mouseup');
}
const handleBarClick = (e: MouseEvent) => {
    handleProcessWidthChange(e);
}


</script>
<template>
    <div class="bar" ref="bar" @click="handleBarClick">
        <div class="progress-wrapper">
            <div :class="['progress', { 'add-transition': !isMouseDown }]" :style="{ width: `${percent * 100}%` }" />
        </div>
        <div ref="dot" :style="{ left: `${dotLeft}px` }"
            :class="['dot', { 'add-transition': !isMouseDown, 'add-hover': isMouseDown }]"
            @mousedown="handleDotMouseDown" />
    </div>
</template>
<style lang="scss" scoped>
.bar {
    position: relative;
    width: 100%;
    height: 5px;
    border-radius: 10px;
    background: #e4e7ed;
    cursor: pointer;

    .progress-wrapper {
        width: 100%;
        height: 100%;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        overflow: hidden;

        .progress {
            height: 100%;
            height: 100%;
            background: #409eff;
        }
    }

    .dot {
        // width: 10px;
        // height: 10px;
        // border: 1px solid #409eff;
        position: absolute;
        bottom: 0;
        top: 0;
        margin: auto 0;
        border-radius: 50%;
        cursor: pointer;
        box-sizing: border-box;
        user-select: none;


        &::after {
            content: ' ';
            position: absolute;
            right: -5px;
            top: -3px;
            width: 10px;
            height: 10px;
            background: #fff;
            border-radius: 50%;
        }

        &:hover {
            &::after {
                outline: 5px solid #fff;
            }
        }
    }


    .add-transition {
        transition: all 0.3s;
    }

    .add-hover {
        &::after {
            outline: 5px solid #fff;
        }
    }

}
</style>