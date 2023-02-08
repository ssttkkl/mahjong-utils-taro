import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtGrid } from 'taro-ui'

import './index.scss'

const Index: React.FC = () => {
  const gridData = [
    {
      image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
      value: '向听计算&牌理'
    },
    {
      image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
      value: '副露牌理'
    },
    {
      image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
      value: '和牌分析'
    },
    {
      image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
      value: '番符算点'
    }
  ]

  const onClick = (item, index) => {
    switch(index) {
      case 0:
        Taro.navigateTo({
          url: '/pages/shanten/index',
        })
        break;
    }
  }

  return (
    <View className='index'>
      <AtGrid data={gridData} onClick={onClick}/>
    </View>
  )
}

export default Index