const compareDate = async (param1, param2) => {
  if (new Date(param1) > new Date(param2)) {
    return true;
  } else {
    return false;
  }
}
module.exports = compareDate;
