const CalculateHoursFromTrackerTask = (str: string): number => {
    let weeks = 0;
    let days = 0;
    let hours = 0;
    let minutes = 0;

    const regex = /(\d+)W|(\d+)D|(\d+)H|(\d+)M/g;
    let match;

    while ((match = regex.exec(str)) !== null) {
        if (match[1]) {
            weeks = parseInt(match[1]);
        } else if (match[2]) {
            days = parseInt(match[2]);
        } else if (match[3]) {
            hours = parseInt(match[3]);
        } else if (match[4]) {
            minutes = parseInt(match[4]);
        }
    }

    return weeks * 5 * 8 + days * 8 + hours + minutes / 60;
}

export default CalculateHoursFromTrackerTask;