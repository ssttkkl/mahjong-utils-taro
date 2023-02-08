import React from "react";
import Taro from "@tarojs/taro";
import {View} from "@tarojs/components";
import {buildSearchParams} from "../../utils/searchParams";
import {HoraForm} from "./form";
import './index.scss'

const HoraPage: React.FC = () => {
  async function onSubmit(values) {
    Taro.navigateTo({
      url: `/pages/hora/result/index?${buildSearchParams(values)}`
    })
  }

  return (
    <View className='index'>
      <HoraForm onSubmit={onSubmit} />
    </View>
  )
}

export default HoraPage
