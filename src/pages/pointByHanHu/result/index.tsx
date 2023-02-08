import React from "react";
import {Text, View} from "@tarojs/components";
import {Card} from "../../../components/Card";

function getText(params: {
  ron: number,
  tsumoParent: number,
  tsumoChild: number,
  isParent: boolean
}): string {
  const {ron, tsumoParent, tsumoChild, isParent} = params

  let ronText = ron !== 0 ? `${ron}点` : ''
  let tsumoText = ''
  if (tsumoChild !== 0 || tsumoParent !== 0) {
    if (tsumoChild !== 0) {
      tsumoText += `子家${tsumoChild}点`
    }
    if (tsumoChild !== 0 && tsumoParent !== 0) {
      tsumoText += '，'
    }
    if (tsumoParent !== 0) {
      tsumoText += `亲家${tsumoParent}点`
    }
    tsumoText += `（共${isParent ? tsumoChild * 3 : tsumoChild * 2 + tsumoParent}点）`
  }

  if (ronText && tsumoText) {
    return `荣和：${ronText}\n自摸：${tsumoText}`
  } else if (ronText) {
    return `荣和：${ronText}`
  } else {
    return `自摸：${tsumoText}`
  }
}

const PointByHanHuResult: React.FC<{
  parent?: { ron: number, tsumo: number },
  child?: { ron: number, tsumoParent: number, tsumoChild: number }
}> = ({parent, child}) => {
  return <>
    {parent ?
      <Card title='亲家和牌时'>
        <Text>
          {getText({ron: parent.ron, tsumoChild: parent.tsumo, tsumoParent: 0, isParent: true})}
        </Text>
      </Card> : null}
    <View style={{height:'16px'}} />
    {child ?
      <Card title='子家和牌时'>
        <Text>
          {getText({isParent: false, ...child})}
        </Text>
      </Card> : null}
  </>
}

export default PointByHanHuResult
