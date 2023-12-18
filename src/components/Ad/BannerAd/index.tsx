import { Ad, View, ViewProps } from "@tarojs/components";

export const BannerAd: React.FC<ViewProps> = (props) => {
    return (
        <View {...props}>
            <Ad 
              unitId='adunit-a7d29c24217bbe33'
            />
        </View>
    )
}