import {Tile} from "mahjong-utils"
import React, {useState} from "react"
import {AtButton, AtForm, AtSwitch} from "taro-ui"
import {useToast} from "taro-hooks";
import './index.scss'
import {TilesInput} from "../../../components/TilesInput";
import { validateNumOfTiles } from "../../../utils/tiles";

export interface FuroShantenFormValues {
  tiles: string
  chanceTile: string
  allowChi: boolean
}

export const FuroShantenForm: React.FC<{
  onSubmit: (values: FuroShantenFormValues) => Promise<void>
}> = (props) => {
  const [showToast] = useToast()

  const [tilesValue, setTilesValue] = useState("")
  const [tilesError, setTilesError] = useState(false)

  const [chanceTileValue, setChanceTileValue] = useState("")
  const [chanceTilesError, setChanceTilesError] = useState(false)

  const [allowChi, setAllowChi] = useState(true)

  const onSubmit = async () => {
    let valid = true

    // validate tiles
    const tiles = Tile.parseTiles(tilesValue)
    if (tiles === undefined || tiles.length === 0) {
      setTilesError(true)
      valid = false
    } else {
      setTilesError(false)
    }

    // validate chanceTile
    const chanceTile = Tile.byText(chanceTileValue)
    if (chanceTile === undefined) {
      setChanceTilesError(true)
      valid = false
    } else {
      setChanceTilesError(false)
    }

    // validate tiles number
    if (valid && ((tiles?.length ?? 0) % 3 !== 1 || (tiles?.length ?? 0) > 13)) {
      showToast({
        title: '手牌必须由4、7、10或13张牌组成',
        icon: 'none'
      }).catch(e => console.error(e))
      return
    }

    // ts-ignore
    if (valid && !validateNumOfTiles([...tiles, chanceTile])) {
      showToast({
        title: '单种牌不能超过4张',
        icon: 'none'
      }).catch(e => console.error(e))
      return
    }

    if (valid) {
      await props.onSubmit({
        tiles: tilesValue,
        chanceTile: chanceTileValue,
        allowChi
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
        placeholder='示例：3456778m123457p'
        value={tilesValue}
        onChange={v => setTilesValue(v.toString())}
        error={tilesError}
        required
      />
      <TilesInput
        name='chanceTile'
        title='机会牌'
        type='text'
        placeholder='示例：7m'
        value={chanceTileValue}
        onChange={v => setChanceTileValue(v.toString())}
        error={chanceTilesError}
        required
      />
      <AtSwitch
        title='允许吃牌'
        checked={allowChi}
        onChange={v => setAllowChi(v)}
      />
      <AtButton formType='submit' type='primary'>提交</AtButton>
    </AtForm>
  )
}
