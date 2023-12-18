import { Ad, View, ViewProps } from "@tarojs/components";

export const ResultPageAd: React.FC<ViewProps> = (props) => {
    return (
        <View {...props}>
            <Ad 
              unitId='adunit-8b6965be841898df'
              adType='video'
              adTheme='white'
            />
        </View>
    )
}