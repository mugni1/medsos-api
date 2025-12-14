export const userAllKey = () => {
    return "USER_ALL_KEY"
}
export const userByIdKey = (id: string) => {
    return `USER_BY_ID_KEY_${id}`
}
export const userByUsernameKey = (username: string) => {
    return `USER_BY_USERNAME_KEY_${username}`
}
export const userBySearchQueryKey = (keyword: string) => {
    return `USER_BY_SEARCH_QUERY_KEY_${keyword}`
}