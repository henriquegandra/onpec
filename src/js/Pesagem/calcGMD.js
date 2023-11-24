const calcGMD = async (obj) => {
    return ((obj.p1 - obj.p2) / ((obj.d1 - obj.d2) / (1000 * 60 * 60 * 24))).toFixed(4)
}