export const getMeridian = (newValue: string, format: 'HH:mm' | 'hh:mm A'): false | 'AM' | 'PM' => {
    if (format === 'hh:mm A') {
        return newValue.toLowerCase().includes('pm') ? 'PM' : 'AM';
    }
    return false;
};

export const parseTimeNumbers = (value: string, separator: number): { hours: number, minutes: number } => {
    let hours: number, minutes: number;
    const timeNumbers = value.replace(/\D/gi, '');

    switch (separator) {
        case 0:
            hours = 0;
            minutes = parseInt(timeNumbers.trim().slice(0, 2));
            break;
        case 1:
            hours = parseInt(timeNumbers.slice(0, 1));
            minutes = parseInt(timeNumbers.slice(1, 3));
            break;
        default:
            hours = parseInt(timeNumbers.slice(0, 2));
            minutes = parseInt(timeNumbers.slice(2, 4));
    }
    return { hours, minutes };
};

export const formatTime = (hours: number, minutes: number, meridian: 'AM' | 'PM' | false): string => {
    const hoursToString = Number.isNaN(hours) ? '00' : hours.toString().padStart(2, '0');
    const minutesToString = Number.isNaN(minutes) ? '00' : minutes.toString().padStart(2, '0');

    if (hoursToString === '00' && minutesToString === '00') {
        return '';
    }

    const time = `${hoursToString}:${minutesToString}`;
    return meridian ? time.concat(` ${meridian}`) : time;
};
