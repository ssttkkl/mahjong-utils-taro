import Taro from "@tarojs/taro"
import React from "react"
import Page from "../../components/Page"
import { buildSearchParams } from "../../utils/searchParams"
import { ShantenForm, ShantenFormValues } from "./form"
import './index.scss'

const ShantenPage: React.FC = () => {
    async function onSubmit(values: ShantenFormValues) {
        Taro.navigateTo({
            url: `/pages/shanten/result/index?${buildSearchParams(values)}`
        })
    }

    return (
        <Page title="向听计算&牌理">
            <ShantenForm onSubmit={onSubmit} />
        </Page>
    )
}

export default ShantenPage
