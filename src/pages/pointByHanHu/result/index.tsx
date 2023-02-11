import React from "react";
import {Text, View} from "@tarojs/components";
import {Card} from "../../../components/Card";

function getTag(point: number): string {
  if (point === 32000) {
    return '累计役满'
  } else if (point === 24000) {
    return '三倍满'
  } else if (point === 16000) {
    return '倍满'
  } else if (point === 12000) {
    return '跳满'
  } else if (point === 8000) {
    return '满贯'
  } else {
    return ''
  }
}

function getText(params: {
  ron: number,
  tsumoParent: number,
  tsumoChild: number,
  isParent: boolean
}): string {
  const {ron, tsumoParent, tsumoChild, isParent} = params

  let ronText = ron !== 0 ? `${ron}点` : ''
  let ronTag = getTag(isParent ? ron / 1.5 : ron)
  if (ronTag.length !== 0) {
    ronText += `（${ronTag}）`
  }

  let tsumoText = ''
  if (tsumoChild !== 0) {
    tsumoText += `子家${tsumoChild}点`
  }
  if (tsumoChild !== 0 && tsumoParent !== 0) {
    tsumoText += '，'
  }
  if (tsumoParent !== 0) {
    tsumoText += `亲家${tsumoParent}点`
  }

  const tsumoTotal = isParent ? tsumoChild * 3 : tsumoChild * 2 + tsumoParent
  let tsumoTag = [
    getTag(isParent ? tsumoTotal / 1.5 : tsumoTotal),
    tsumoTotal > 0 ? `共${tsumoTotal}点` : ''
  ].filter(x => x.length !== 0).join('，')
  if (tsumoTag.length !== 0) {
    tsumoText += `（${tsumoTag}）`
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
    {parent && child ?
      <View style={{height: '16px'}} />
      : null}
    {child ?
      <Card title='子家和牌时'>
        <Text>
          {getText({isParent: false, ...child})}
        </Text>
      </Card> : null}
  </>
}

export default PointByHanHuResult
