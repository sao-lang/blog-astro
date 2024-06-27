<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, type PropType } from 'vue';

const props = defineProps({
    percent: {
        type: Number as PropType<number>,
        default: 0,
    }
});
const emits = defineEmits(['update:percent'])

const bar = ref<HTMLDivElement>();
const dot = ref<HTMLDivElement>();
const dotLeft = ref(0);
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

onBeforeUnmount(() => {
    removeEvent();
})
const removeEvent = () => {
    document.removeEventListener('mouseup', handleDocumentMouseUp);
}
const handleDotMouseDown = () => {
    isMouseDown.value = true;
    document.addEventListener('mousemove', handleDotMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp)
}
const handleDotMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    const [{ width, left }] = bar.value?.getClientRects()!;
    const x = e.pageX - left;
    const maxX = width - dot.value!.offsetWidth;
    dotLeft.value = x < 0 ? 0 : x > maxX ? maxX : x;
    percent.value = Number((dotLeft.value / maxX).toFixed(4));
}
const handleDocumentMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    isMouseDown.value = false;
    document.removeEventListener('mousemove', handleDotMouseMove);
}
const handleBarClick = (e: MouseEvent) => {
    const [{ width, left }] = bar.value?.getClientRects()!;
    const x = e.pageX - left;
    const maxX = width - dot.value!.offsetWidth;
    dotLeft.value = x < 0 ? 0 : x > maxX ? maxX : x;
    percent.value = Number((dotLeft.value / maxX).toFixed(4));
}

</script>
<template>
    <div class="content">
        <div class="bar" ref="bar" @click="handleBarClick">
            <div :class="['progress', { 'add-transition': !isMouseDown }]" :style="{ width: `${percent * 100}%` }"></div>
            <div ref="dot" :class="['dot', { 'add-transition': !isMouseDown, 'add-hover': isMouseDown }]"
                :style="{ left: `${percent === 0 ? 0 : `calc(${percent * 100}% - ${dot?.offsetWidth ?? 0}px)`}` }"
                @mousedown="handleDotMouseDown">
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.content {
    width: 100%;
    height: 5px;
    margin: 0 auto;
    position: relative;
}

.bar {
    height: 100%;
    border-radius: 10px;
    background: #e4e7ed;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    cursor: pointer;
}

.progress {
    height: 100%;
    border-radius: 10px;
    background: #409eff;
}

.dot {
    width: 10px;
    height: 10px;
    background: #fff;
    border: 1px solid #409eff;
    position: absolute;
    bottom: 0;
    top: 0;
    margin: auto 0;
    border-radius: 50%;
    cursor: pointer;
    box-sizing: border-box;

    &:hover {
        outline: 5px solid #fff;
    }
}

.add-transition {
    transition: all 0.3s;
}

.add-hover {
    outline: 5px solid #fff;
}
</style>