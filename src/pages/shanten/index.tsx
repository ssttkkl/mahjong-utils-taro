import {View} from "@tarojs/components"
import Taro from "@tarojs/taro"
import React from "react"
import {buildSearchParams} from "../../utils/searchParams"
import {ShantenForm, ShantenFormValues} from "./form"
import './index.scss'

const ShantenPage: React.FC = () => {
    async function onSubmit(values: ShantenFormValues) {
        Taro.navigateTo({
            url: `/pages/shanten/result/index?${buildSearchParams(values)}`
        })
    }

    return (
        <View className='index'>
            <ShantenForm onSubmit={onSubmit} />
        </View>
    )
}

export default ShantenPage
