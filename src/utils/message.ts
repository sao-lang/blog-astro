import store from '@/store';
import { Message, convertChinese } from '@lania/utils';
const message = new Message();
import simpledToTraditional from '@lania/utils-json/simpledToTraditional.json';
import traditionalToSimpled from '@lania/utils-json/traditionalToSimpled.json';

const getMessage = (message: string) => {
    const { isSimple } = store.getDerivedState();
    const msg = convertChinese(message, isSimple ? traditionalToSimpled : simpledToTraditional);
    return msg;
};

export default {
    success: (msg: string, duration?: number) => message.success(getMessage(msg), duration),
    info: (msg: string, duration?: number) => message.info(getMessage(msg), duration),
    error: (msg: string, duration?: number) => message.error(getMessage(msg), duration),
    warning: (msg: string, duration?: number) => message.warning(getMessage(msg), duration),
};
