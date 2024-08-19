import { Draggable, type DraggableOptions } from '@lania/utils';
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

const useDraggableHook = (element: Ref<HTMLElement>, options?: DraggableOptions) => {
    let draggable = ref<Draggable>();
    onMounted(() => {
        draggable.value = new Draggable(element.value, options);
        draggable.value.bindEvents();
    });
    onBeforeUnmount(() => {
        draggable.value!.unbindEvents();
    });
    return draggable;
};

export default useDraggableHook;
