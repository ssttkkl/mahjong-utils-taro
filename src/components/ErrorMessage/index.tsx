import React from "react";
import {ViewProps} from "@tarojs/components/types/View";
import {View} from "@tarojs/components";
import './index.scss'

const ErrorMessage: React.FC<ViewProps & {
  error: any
}> = ({error, ...viewProps}) => {
  return (
    <View className='error-msg' {...viewProps}>
      <View className='error-msg__title'>发生错误</View>
      <View className='error-msg__content'>{error?.toString()}</View>
    </View>
  )
}

export default ErrorMessage
