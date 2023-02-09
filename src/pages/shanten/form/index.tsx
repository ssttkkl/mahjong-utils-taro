import {Tile} from "mahjong-utils"
import React, {useState} from "react"
import {AtButton, AtForm, AtRadio} from "taro-ui"
import {useToast} from "taro-hooks";
import './index.scss'
import {Panel} from "../../../components/Panel"
import {TilesInput} from "../../../components/TilesInput";
import { validateNumOfTiles } from "../../../utils/tiles";

export type ShantenMode = 'union' | 'regular' | 'chitoi' | 'kokushi'

export interface ShantenFormValues {
  tiles: string,
  mode: ShantenMode
}

const modeOptions = [
  {label: '一般形', value: 'union', desc: '除四面子+雀头的标准形外，还考虑七对子与国士无双和牌的情况'},
  {label: '标准形', value: 'regular', desc: '只考虑四面子+雀头和牌的情况'}
]

export const ShantenForm: React.FC<{
  onSubmit: (values: ShantenFormValues) => Promise<void>
}> = (props) => {
  const [showToast] = useToast()
  const [tilesValue, setTilesValue] = useState("")
  const [tilesError, setTilesError] = useState(false)

  const [mode, setMode] = useState<ShantenMode>('union')

  const onSubmit = async () => {
    let valid = true

    // validate tiles
    const tiles = Tile.parseTiles(tilesValue)
    if (tiles === undefined || tiles.length === 0) {
      setTilesError(true)
      valid = false
    }

    // validate tiles number
    if (valid && (tiles?.length ?? 0) > 14) {
      showToast({
        title: '手牌不能由多于14张牌组成',
        icon: 'none'
      }).catch(e => console.error(e))
      return
    }
    if (valid && (tiles?.length ?? 0) % 3 === 0) {
      showToast({
        title: '手牌不能由3的倍数张牌组成',
        icon: 'none'
      }).catch(e => console.error(e))
      return
    }

    if (valid && !validateNumOfTiles(tiles!)) {
      showToast({
        title: '单种牌不能超过4张',
        icon: 'none'
      }).catch(e => console.error(e))
      return
    }

    if (valid) {
      await props.onSubmit({
        tiles: tilesValue,
        mode
      })
    } else {
      showToast({title: '请检查输入', icon: 'error'})
        .catch(e => console.error(e))
    }
  }

  return (
    <AtForm onSubmit={onSubmit}>
      <TilesInput
        name='tiles'
        title='手牌'
        type='text'
        placeholder='示例：34568m235p688s'
        value={tilesValue}
        onChange={v => setTilesValue(v.toString())}
        error={tilesError}
        required
      />
      <Panel title='模式'>
        <AtRadio
          options={modeOptions}
          value={mode}
          onClick={v => setMode(v)}
        />
      </Panel>
      <AtButton formType='submit' type='primary'>计算</AtButton>
    </AtForm>
  )
}
