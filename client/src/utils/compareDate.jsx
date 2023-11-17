import { format, compareAsc } from "date-fns";

const compareDate = (date1, date2) => {
    const time1 = format(new Date(date1), 'yyyy-MM-dd HH:mm:ss');
    const time2 = format(new Date(date2), 'yyyy-MM-dd HH:mm:ss');
    const comparisonResult = compareAsc(time1, time2);
    if (comparisonResult === -1) {
        return date2;
    } else {
        return date2;
    }

};
export default compareDate;