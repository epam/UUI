import React from 'react';
import { Calendar as UuiCalendar, withMods } from "@epam/uui";

const applyCalendarMods = () => ['uui-theme-loveship'];

export const Calendar = withMods(UuiCalendar, applyCalendarMods);
