import {Text, View, ViewProps} from "@tarojs/components";
import React from "react";
import './index.scss'

export const Panel: React.FC<{
  title: string,
  suffix?: string | React.ReactNode
} & ViewProps> = ({title, suffix, children, ...props}) => {
  return (
    <View className='panel' {...props}>
      <View className='panel__title'>
        <Text className='panel__title__text'>
          {title}
        </Text>
        {suffix}
      </View>
      {children}
    </View>
  )
}
