import React, {useState} from "react";
import {View} from "@tarojs/components";
import {getChildPointByHanHu, getParentPointByHanHu} from "mahjong-utils";
import {useToast} from "taro-hooks";
import {PointByHanHuForm, PointByHanHuFormValues} from "./form";
import PointByHanHuResult from "./result";

const PointByHanHuPage: React.FC = () => {
  const [showToast] = useToast()
  const [parentResult, setParentResult] = useState<{ ron: number, tsumo: number }>()
  const [childResult, setChildResult] = useState<{ ron: number, tsumoParent: number, tsumoChild: number }>()

  async function onSubmit(values: PointByHanHuFormValues) {
    let p: any = null
    let c: any = null

    try {
      p = getParentPointByHanHu(values.han, values.hu)
      setParentResult(p)
    } catch (e) {
      setParentResult(undefined)
    }

    try {
      c = getChildPointByHanHu(values.han, values.hu)
      setChildResult(c)
    } catch (e) {
      setChildResult(undefined)
    }

    console.log(p)
    console.log(c)
    if (!p && !c) {
      await showToast({
        title: '不存在对应的和牌',
        icon: 'none'
      })
    }
  }

  return (
    <View className='index'>
      <PointByHanHuForm onSubmit={onSubmit} />
      <View style={{height:'16px'}} />
      <PointByHanHuResult parent={parentResult} child={childResult} />
    </View>
  )
}

export default PointByHanHuPage
