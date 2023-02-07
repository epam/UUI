import React from 'react';
import { withMods } from "@epam/uui-core";
import { Calendar as UuiCalendar } from "@epam/uui";

const applyCalendarMods = () => ['uui-theme-loveship'];

export const Calendar = withMods(UuiCalendar, applyCalendarMods);
