export const timestampToDate = (timestamp) => {
    // const moment = new Date(timestamp);
    // return `${moment.getFullYear()}/${moment.getMonth()}/${moment.getDate()} ${moment.getHours()}:${moment.getMinutes()}`;
    const date = new Date(timestamp*1000);
    return date.toLocaleDateString("en-US");
}

export const toLocalNumber = (longnumber, seed) => {
    return longnumber / 10 ** seed;
}