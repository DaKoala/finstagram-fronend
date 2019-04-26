function handlePlural(unit: string, sum: number): string {
    if (sum > 1) {
        return `${sum} ${unit}s ago`;
    }
    return `${sum} ${unit} ago`;
}

function dateString(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const MONTH_NAMES = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    return `${MONTH_NAMES[month]} ${day}, ${year}`;
}

export function timeAgo(timestamp: string): string {
    const thatDate = new Date(timestamp);
    const diff = +Date.now() - +thatDate;
    const MINUTE = 60 * 1000;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    const MONTH = DAY * 30;

    if (diff < MINUTE) {
        return 'Just now';
    }
    if (diff < HOUR) {
        return handlePlural('minute', Math.floor(diff / MINUTE));
    }
    if (diff < DAY) {
        return handlePlural('hour', Math.floor(diff / HOUR));
    }
    if (diff < MONTH) {
        return handlePlural('day', Math.floor(diff / DAY));
    }
    return dateString(thatDate);
}
