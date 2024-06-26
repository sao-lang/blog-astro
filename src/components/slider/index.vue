<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const content = ref<HTMLDivElement>();
const bar = ref<HTMLDivElement>();
const dot = ref<HTMLDivElement>();
const progress = ref<HTMLDivElement>();
const dotLeft = ref(0);
const progressWidth = ref(0);
const percent = ref(0);


onMounted(() => {
    //  获取所有的节点元素
    // var content = document.getElementsByClassName('content')[0] as HTMLElement;
    // var bar = document.getElementsByClassName('bar')[0] as HTMLElement;
    // var progress = document.getElementsByClassName('progress')[0] as HTMLElement;
    // var dot = document.getElementsByClassName('dot')[0] as HTMLElement;
    // var p = document.getElementsByTagName('p')[0] as HTMLElement;
    // /*
    // * offsetWidth 获取当前节点的宽度 （width + border + padding）
    // **/
    // // 总长度减去原点覆盖的部分
    // var rest = bar.offsetWidth - dot.offsetWidth
    // // 鼠标按下事件
    // dot.onmousedown = function (ev) {
    //     /*
    //     * offsetLeft 获取的是相对于父对象的左边距, 返回的是数值， 没有单位
    //     */
    //     let dotL = dot.offsetLeft
    //     let e = ev || window.event //兼容性
    //     /*
    //     * clientX 事件属性返回当事件被触发时鼠标指针向对于浏览器页面（或客户区）的水平坐标。
    //     */
    //     let mouseX = e.clientX //鼠标按下的位置
    //     window.onmousemove = function (ev) {
    //         let e = ev || window.event
    //         // 浏览器当前位置减去鼠标按下的位置
    //         let moveL = e.clientX - mouseX //鼠标移动的距离

    //         // 保存newL是必要的    
    //         let newL = dotL + moveL //left值
    //         // 判断最大值和最小值
    //         if (newL < 0) {
    //             newL = 0
    //         }
    //         if (newL >= rest) {
    //             newL = rest
    //         }
    //         // 改变left值
    //         dot.style.left = newL + 'px'
    //         // 计算比例
    //         let bili = newL / rest * 100
    //         progress.style.width = 500 * Math.ceil(bili) / 100 + 'px';
    //         return false //取消默认事件
    //     }
    //     window.onmouseup = function () {
    //         window.onmousemove = null //解绑移动事件
    //         return false
    //     }
    //     return false
    // };
    // // 点击音量条
    // bar.onclick = function (ev) {
    //     let left = ev.clientX - content.offsetLeft - dot.offsetWidth / 2
    //     if (left < 0) {
    //         left = 0
    //     }
    //     if (left >= rest) {
    //         left = rest
    //     }
    //     dot.style.left = left + 'px'
    //     let bili = left / rest * 100
    //     p.innerHTML = Math.ceil(bili) + '%'
    //     progress.style.width = 500 * Math.ceil(bili) / 100 + 'px';
    //     return false
    // }
    init();
})

const init = () => {
    console.log({ dot: dot.value, bar: bar.value })
    dot.value?.addEventListener('mousedown', (dotEvent) => {
        const onMousemove = (e: MouseEvent) => handleMouseMove(e, dotEvent.clientX)
        document.addEventListener('mousemove', onMousemove);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMousemove);
        })
    })
}

const handleMouseMove = (e: MouseEvent, clientX: number) => {
    const offset = e.clientX - clientX;
    const totalOffset = offset + dot.value!.offsetLeft;
    const totalWidth = bar.value!.offsetWidth - dot.value!.offsetWidth;
    dotLeft.value = totalOffset < 0 ? 0 : totalOffset >= totalWidth ? totalWidth : totalOffset;
    percent.value = Number((dotLeft.value / bar.value!.offsetWidth * 100).toFixed(2));
}

</script>
<template>
    <div class="content">
        <p>0%</p>
        <div class="bar" ref="bar">
            <div class="progress" :style="{ width: `${percent}%` }"></div>
            <div ref="dot" class="dot" :style="{ left: `${dotLeft}px` }"></div>
        </div>
    </div>
</template>
<style lang="scss">
@use './index.scss';
</style>