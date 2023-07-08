import { View, ViewProps } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { usePage } from "taro-hooks"
import { AtNavBar } from "taro-ui"
import './index.scss'

export interface PageProps {
    title: string
    children: ViewProps['children']
}

const Page: React.FC<PageProps> = ({ title, children }) => {
    const [stackLength,] = usePage()

    return (
        <View>
            <AtNavBar
                title={title}
                color='#000'
                leftIconType={stackLength > 1 ? 'chevron-left' : undefined}
                onClickLeftIcon={stackLength > 1 ? () => { Taro.navigateBack() } : undefined}
            >
            </AtNavBar>
            {children}
        </View>
    )
}

export default Page