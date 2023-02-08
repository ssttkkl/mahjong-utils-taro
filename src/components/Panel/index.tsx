import { View, ViewProps } from "@tarojs/components";
import './index.scss'

export const Panel: React.FC<{ title: string } & ViewProps> = ({ title, children, ...props }) => {
    return (
        <View className='panel' {...props}>
            <View className='panel__title'>{title}</View>
            {children}
        </View>
    )
}