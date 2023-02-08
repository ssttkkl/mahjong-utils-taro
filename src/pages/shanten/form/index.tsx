import {Tile} from "mahjong-utils"
import React, {useState} from "react"
import {AtButton, AtForm, AtInput, AtRadio} from "taro-ui"
import './index.scss'
import {Panel} from "../../../components/Panel"

export type ShantenMode = 'union' | 'regular' | 'chitoi' | 'kokushi'

export interface ShantenFormValues {
    tiles: string,
    mode: ShantenMode
}

export const ShantenForm: React.FC<{
    onSubmit: (values: ShantenFormValues) => Promise<void>
}> = (props) => {
    const [tilesValue, setTilesValue] = useState("34568m235p688s")
    const [tilesError, setTilesError] = useState(false)

    const [mode, setMode] = useState<ShantenMode>('union')

    const onSubmit = () => {
        let valid = true

        // validate tiles
        const tiles = Tile.parseTiles(tilesValue)
        if (tiles === undefined || tiles.length === 0) {
            setTilesError(true)
            valid = false
        }

        if (valid) {
            props.onSubmit({
                tiles: tilesValue,
                mode
            })
        }
    }

    return (
        <AtForm onSubmit={onSubmit}>
            <AtInput
              name='tiles'
              title='手牌'
              type='text'
              placeholder='示例：34568m235p688s'
              value={tilesValue}
              onChange={v => setTilesValue(v.toString())}
              error={tilesError}
              clear
              required
            />
            <Panel title='模式'>
                <AtRadio
                  options={[
                        { label: '一般形', value: 'union', desc: '包括标准形、七对子与国士无双和牌的情况（默认）' },
                        { label: '标准形', value: 'regular', desc: '只考虑四面子+雀头和牌的情况' },
                        { label: '七对子', value: 'chitoi', desc: '只考虑七种对子和牌的情况' },
                        { label: '国士无双', value: 'kokushi', desc: '只考虑13张幺九牌其中1种一对，剩下12种各一张和牌的情况' }
                    ]}
                  value={mode}
                  onClick={v => setMode(v)}
                />
            </Panel>
            <AtButton formType='submit'>提交</AtButton>
        </AtForm>
    )
}
