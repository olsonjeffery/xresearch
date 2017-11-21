export const parseBuildTime = (totalTimeHours) => {
    var days = totalTimeHours > 24 ? Math.floor(totalTimeHours / 24) : 0;
    var hours = totalTimeHours > 24 ? totalTimeHours % 24 : totalTimeHours;
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
