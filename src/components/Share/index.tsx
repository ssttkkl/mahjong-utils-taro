import { useShareAppMessage, useShareTimeline } from "@tarojs/taro";
import { useRouter } from "taro-hooks";
import { buildSearchParams } from "../../utils/searchParams";

export const useSharePage = ({ title }: { title: string }) => {
    const [{ path, params }] = useRouter()
    useShareAppMessage(() => ({
        title: '日麻小工具：' + title,
        path: `${path}?${buildSearchParams(params)}`
    }));
    useShareTimeline(() => ({
        title: '日麻小工具：' + title,
        query: buildSearchParams(params)
    }));
}
