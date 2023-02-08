import {View} from "@tarojs/components"
import Taro from "@tarojs/taro"
import React from "react"
import {buildSearchParams} from "../../utils/searchParams"
import {FuroShantenForm} from "./form"
import './index.scss'

const FuroShantenPage: React.FC = () => {
    async function onSubmit(values) {
        Taro.navigateTo({
            url: `/pages/furoShanten/result/index?${buildSearchParams(values)}`
        })
    }

    return (
        <View className='index'>
            <FuroShantenForm onSubmit={onSubmit} />
        </View>
    )
}

export default FuroShantenPage
