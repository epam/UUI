import React from 'react';
import { Calendar as UuiCalendar, withMods } from "@epam/uui";

const applyCalendarMods = () => ['uui-theme-promo'];

export const Calendar = withMods(UuiCalendar, applyCalendarMods);
