import { useEffect, useState } from "react"
import { useRouter } from "taro-hooks"
import { AtActivityIndicator } from "taro-ui"
import ErrorMessage from "../ErrorMessage"
import './index.scss'

export interface ResultProps<T = any> {
    calc: (params: Partial<Record<string, string>>) => T
    render: (result: T) => React.ReactNode
}

const Result: React.FC<ResultProps> = (props) => {
    const [{ params }] = useRouter()

    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        setTimeout(() => {
            try {
                const calcResult = props.calc(params)
                setError(null)
                setResult(calcResult)
            } catch (e) {
                console.error(e)
                setError(e)
                setResult(null)
            }
        })
    }, [props, params])

    if (result === null) {
        if (error) {
            return <ErrorMessage error={error} />
        } else {
            return <AtActivityIndicator mode='center' size={48} content='计算中……' />
        }
    } else {
        return <>
            {props.render(result)}
        </>
    }
}

export default Result