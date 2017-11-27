export const parseBuildTime = (totalTimeHours, runts = 1) => {
    var totalTimeSplit = totalTimeHours / runts;
    var days = Math.round(totalTimeSplit > 24 ? Math.floor(totalTimeSplit / 24) : 0);
    var hours = Math.round((totalTimeSplit > 24 ? totalTimeSplit % 24 : totalTimeSplit)*100) / 100;
    if(days === 0 && hours === 0) {
        return '0hr';
    } else if (days === 0) {
        return `${hours}hrs`;
    } else {
        if(hours === 0) {
            return `${days}d`;
        } else {
            return `${days}d${hours}hr`;
        }
    }
};
