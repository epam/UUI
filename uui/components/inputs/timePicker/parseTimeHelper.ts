export const getMeridian = (newValue: string, format: 'HH:mm' | 'hh:mm A'): false | 'AM' | 'PM' => {
    if (format === 'hh:mm A') {
        if (newValue.toLowerCase().includes('p') && newValue.toLowerCase().includes('a')) {
            return newValue.toLowerCase().indexOf('p') < newValue.toLowerCase().indexOf('a') ? 'PM' : 'AM';
        }
        return newValue.toLowerCase().includes('p') ? 'PM' : 'AM';
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

export const formatTime = (hours: number, minutes: number, meridian: 'AM' | 'PM' | false, format: 'HH:mm' | 'hh:mm A'): string => {
    const normalizeHours = (h: number) => Number.isNaN(h) ? '00' : h.toString().padStart(2, '0');
    const normalizeMinutes = (m: number) => Number.isNaN(m) ? '00' : m.toString().padStart(2, '0');

    if (meridian && normalizeHours(hours) === '00' && normalizeMinutes(minutes) === '00') {
        return '';
    }

    let hoursResult = Number.parseInt(normalizeHours(hours));
    let meridianResult = meridian;

    if ((format === 'hh:mm A') && hoursResult > 12) {
        hoursResult -= 12;
        meridianResult = 'PM';
    }

    if ((format === 'hh:mm A') && hoursResult === 0) {
        hoursResult = 12;
    }

    const time = `${normalizeHours(hoursResult)}:${normalizeMinutes(minutes)}`;

    return meridianResult ? time.concat(` ${meridianResult}`) : time;
};
