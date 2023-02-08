import { View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import React from "react"
import { ShantenForm, ShantenFormValues } from "./form"
import './index.scss'

const ShantenPage: React.FC = () => {
    async function onSubmit(values: ShantenFormValues) {
        const searchParams = Object.entries(values).map(([key, value]) => key + '=' + value).join('&')
        Taro.navigateTo({
            url: `/pages/shanten/result/index?${searchParams}`
        })
    }

    return (
        <View className='index'>
            <ShantenForm onSubmit={onSubmit} />
        </View>
    )
}

export default ShantenPage
