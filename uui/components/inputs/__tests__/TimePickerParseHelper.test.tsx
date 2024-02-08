import { formatTime, getMeridian, parseTimeNumbers } from '../timePicker/parseTimeHelper';

describe('TimePicker, getMeridian function', () => {
    const withMeridianFormat = 'hh:mm A';
    const withoutMeridianFormat = 'HH:mm';

    it('Should return \'AM\'', () => {
        expect(getMeridian('2 22ap', withMeridianFormat)).toEqual('AM');
    });

    it('Should return \'PM\'', () => {
        expect(getMeridian('2/12pa', withMeridianFormat)).toEqual('PM');
    });

    it('Should return \'false\'', () => {
        expect(getMeridian('2/12am', withoutMeridianFormat)).toBeFalsy();
    });
});

describe('TimePicker, parseTimeNumbers function', () => {
    it('In this case separator equals zero, so it should return hours: 0, minutes: first 2 numbers from string', () => {
        expect(parseTimeNumbers('.22pm', 0)).toEqual({ hours: 0, minutes: 22 });
        expect(parseTimeNumbers('.2222pm', 0)).toEqual({ hours: 0, minutes: 22 });
        expect(parseTimeNumbers('/3223amsa', 0)).toEqual({ hours: 0, minutes: 32 });
        expect(parseTimeNumbers('a32', 0)).toEqual({ hours: 0, minutes: 32 });
    });

    it('In this case separator equals 1, so it should return hours: first number, minutes: first two of the next numbers', () => {
        expect(parseTimeNumbers('1.2', 1)).toEqual({ hours: 1, minutes: 2 });
        expect(parseTimeNumbers('2 2pm', 1)).toEqual({ hours: 2, minutes: 2 });
        expect(parseTimeNumbers('2:12', 1)).toEqual({ hours: 2, minutes: 12 });
        expect(parseTimeNumbers('1/22am', 1)).toEqual({ hours: 1, minutes: 22 });
        expect(parseTimeNumbers('1n2233am', 1)).toEqual({ hours: 1, minutes: 22 });
    });

    it('In this case separator equals two or bigger or undefined, so it should return first two numbers as hours and first two of other numbers as minutes', () => {
        expect(parseTimeNumbers('12.22', 2)).toEqual({ hours: 12, minutes: 22 });
        expect(parseTimeNumbers('12a22345sdf', 2)).toEqual({ hours: 12, minutes: 22 });
        expect(parseTimeNumbers('00/22345sdf', 2)).toEqual({ hours: 0, minutes: 22 });
        expect(parseTimeNumbers('00 00', 2)).toEqual({ hours: 0, minutes: 0 });
        expect(parseTimeNumbers('1234', undefined)).toEqual({ hours: 12, minutes: 34 });
        expect(parseTimeNumbers('123456', undefined)).toEqual({ hours: 12, minutes: 34 });
    });
});

describe('TimePicker, formatTime function', () => {
    it('Should return time with meridian', () => {
        expect(formatTime(12, 34, 'PM', 'hh:mm A')).toEqual('12:34 PM');
        expect(formatTime(2, 4, 'AM', 'hh:mm A')).toEqual('02:04 AM');
        expect(formatTime(15, 0, false, 'hh:mm A')).toEqual('03:00 PM');
    });

    it('Should return time without meridian', () => {
        expect(formatTime(12, 34, false, 'HH:mm')).toEqual('12:34');
        expect(formatTime(2, 4, false, 'HH:mm')).toEqual('02:04');
        expect(formatTime(0, 0, false, 'HH:mm')).toEqual('00:00');
    });

    it('Should return empty string', () => {
        expect(formatTime(0, 0, 'AM', 'hh:mm A')).toEqual('');
        expect(formatTime(0, 0, 'PM', 'hh:mm A')).toEqual('');
    });
});
