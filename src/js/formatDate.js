const formatDate = async (date) => {
  try {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year}`; // ${hours}:${minutes}:${seconds}
  } catch (error) {
    return '';
  }
}

const formatDateDB = async (date) => {
  if (date.length > 0 && date.length !== null) {
    try {
      const fullDate = date.split('/');

      return `${fullDate[1]}-${fullDate[0]}-${fullDate[2]}`;
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
}

const formatDateTable = async (date) => {
  if (date.length > 0 && date.length !== null) {
    try {
      const fullDate = date.split('/');

      return `${fullDate[2]}-${fullDate[1]}-${fullDate[0]}`;
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
}

const formatDateToPostgres = async (date) => {
  const moment = require('moment');
  if (date.trim() === "") {
    return null;
  }
  const defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
  const dateObj = moment(date, "YYYY-MM-DD");
  const defaultFormattedDate = dateObj.format(defaultFormat);
  return defaultFormattedDate;
}