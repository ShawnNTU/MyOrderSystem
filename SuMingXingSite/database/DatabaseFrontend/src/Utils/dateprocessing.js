export function getTodayString(){
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() + 1 // month is 0-based
    month = (month < 10 ? `0${month}` : `${month}`)
    let date = now.getDate()
    date = (date < 10 ? `0${date}` : `${date}`)
    return `${year}-${month}-${date}`
}