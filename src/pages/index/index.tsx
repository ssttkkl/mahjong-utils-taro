import React from "react";
import {View} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {AtGrid} from 'taro-ui'

import icon1 from '../../assets/images/icons/icon1.svg'
import icon2 from '../../assets/images/icons/icon2.svg'
import icon3 from '../../assets/images/icons/icon3.svg'
import icon4 from '../../assets/images/icons/icon4.svg'

import './index.scss'

const Index: React.FC = () => {
  const gridData = [
    {
      image: icon1,
      value: '向听计算&牌理'
    },
    {
      image: icon2,
      value: '副露牌理'
    },
    {
      image: icon3,
      value: '和牌分析'
    },
    {
      image: icon4,
      value: '番符算点'
    }
  ]

  const onClick = (_, index) => {
    switch (index) {
      case 0:
        Taro.navigateTo({
          url: '/pages/shanten/index',
        })
        break;
      case 1:
        Taro.navigateTo({
          url: '/pages/furoShanten/index',
        })
        break;
      case 2:
        Taro.navigateTo({
          url: '/pages/hora/index',
        })
        break;
      case 3:
        Taro.navigateTo({
          url: '/pages/pointByHanHu/index',
        })
        break;
    }
  }

  return (
    <View className='index'>
      <AtGrid data={gridData} onClick={onClick} columnNum={2} />
    </View>
  )
}

export default Index
