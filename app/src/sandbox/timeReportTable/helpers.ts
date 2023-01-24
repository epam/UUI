export const getDaysInMonth = (month: number = 1) => new Date(2023, month, 0).getDate();

export const generateDaysOfHalfMonth = (month: number = 1) => {
    const days = getDaysInMonth(month);
    const daysToGenerate = Math.floor(days / 2);
    return new Array(daysToGenerate).fill(0).map((_, index) => new Date(2023, month - 1, index + 1));
};

export const getDayName = (date: Date, locale: string = 'en-US') => {
    return date.toLocaleDateString(locale, { weekday: 'short' });
};
