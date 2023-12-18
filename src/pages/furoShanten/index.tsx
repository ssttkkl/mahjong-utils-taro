import Taro from "@tarojs/taro"
import React from "react"
import Page from "../../components/Page"
import { buildSearchParams } from "../../utils/searchParams"
import { FuroShantenForm } from "./form"
import './index.scss'

const FuroShantenPage: React.FC = () => {
    async function onSubmit(values) {
        Taro.navigateTo({
            url: `/pages/furoShanten/result/index?${buildSearchParams(values)}`
        })
    }

    return (
        <Page title='副露牌理'>
            <FuroShantenForm onSubmit={onSubmit} />
        </Page>
    )
}

export default FuroShantenPage
