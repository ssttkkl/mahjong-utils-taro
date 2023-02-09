import React from "react";
import {View, Image} from '@tarojs/components'

import emailIcon from '../../assets/images/icons/email.svg'
import githubIcon from '../../assets/images/icons/github.svg'
import './index.scss'

const HelpPage: React.FC = () => {
  return (
    <View className='at-article'>
      <View className='at-article__h1'>
        帮助
      </View>
      <View className='at-article__content'>
        <View className='at-article__section'>
          <View className='at-article__h2'>
            麻将牌的输入方式
          </View>
          <View className='at-article__p'>
            麻将牌通过牌代码的方式输入。
          </View>
          <View className='at-article__p'>
            对于数牌，牌代码由序号数字（1~9）与种类字母（m=万、p=筒、s=条）共两位组成。例如，三索用3s表示、九筒用9p表示。
          </View>
          <View className='at-article__p'>
            对于字牌，我们用1~7的序号加上字母z分别“东南西北白发中”。例如，东用1z表示、白用5z表示。
          </View>
          <View className='at-article__p'>
            需要输入一组麻将牌的时候，我们只需要将多张麻将牌的牌代码连起来（不需要用任何符号分割）。例如，三索四索五索东东用3s4s5s1z1z表示。
          </View>
          <View className='at-article__p'>
            对于相邻的同种类的牌，我们还可以使用连写方式，即省略除最后一张牌外其余牌的种类字母。例如，刚才的牌还可以表示为345s11z。
          </View>
        </View>
      </View>
      <View className='at-article__h1'>
        关于
      </View>
      <View className='at-article__content'>
        <View className='at-article__section'>
          <View className='at-article__p'>
            本小程序基于MIT许可证开源
          </View>
          <View className='at-article__p'>
            源代码仓库：<Image className='icon' src={githubIcon} /> ssttkkl/mahjong-utils-taro
          </View>
          <View className='at-article__h2'>
            联系方式
          </View>
          <View className='at-article__p'>
            如果在使用上遇到了疑问或bug，欢迎联系作者或者在GitHub上发起issue。
          </View>
          <View className='at-article__p'>
            <Image className='icon' src={githubIcon} /> GitHub：ssttkkl
          </View>
          <View className='at-article__p'>
            <Image className='icon' src={emailIcon} /> 邮箱：huang.wen.long@hotmail.com
          </View>
        </View>
      </View>
    </View>
  )
}

export default HelpPage
