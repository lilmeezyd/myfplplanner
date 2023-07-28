const getTime = (time) => {
    let newTime = time.slice(0, time.length-3)
    newTime = newTime.slice(0, newTime.length-3)
    return newTime
}

export default getTime