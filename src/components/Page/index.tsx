import { ViewProps } from "@tarojs/components"

export interface PageProps {
    title: string
    children: ViewProps['children']
}

const Page: React.FC<PageProps> = ({ title, children }) => {
    return (
        <>
            {children}
        </>
    )
}

export default Page