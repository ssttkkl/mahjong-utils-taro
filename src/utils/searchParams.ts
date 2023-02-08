export function buildSearchParams(values: any): string {
    return Object.entries(values).map(([key, value]) => key + '=' + value).join('&')
}