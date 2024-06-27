/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import {
    addDays,
    differenceInCalendarDays,
    endOfMonth,
    getYear,
    isBefore,
    isSameDay,
    isToday,
    isValid,
    isWithinInterval,
    parse,
    setYear,
    startOfTomorrow
} from "date-fns";

export function isBirthdayTodayOrNextWeek(birthday: Date): {
    isBirthdayToday: boolean;
    isBirthdayNextWeek: boolean;
} {
    const today = new Date();
    let birthdayCurrentYear = setYear(birthday, getYear(today));
    // Handle leap year
    if (!isValid(birthdayCurrentYear)) {
        // Move the date to the end of February
        birthdayCurrentYear = endOfMonth(new Date(getYear(today), 1));
    }

    // DoB is today
    const isBirthdayToday = isToday(birthdayCurrentYear);
    // DoB is greater than today but less than today plus one week
    const isBirthdayNextWeek = isWithinInterval(birthdayCurrentYear, {
        start: startOfTomorrow(),
        end: addDays(today, 7)
    });

    return { isBirthdayToday, isBirthdayNextWeek };
}

export function getDateFromString(dateString: string, locale: string): Date {
    if (locale === "de") {
        // dd.MM.yyyy format
        return parse(dateString, "dd.MM.yyyy", new Date());
    } else if (locale === "en") {
        // MM/dd/yyyy format
        return parse(dateString, "MM/dd/yyyy", new Date());
    }
    throw new Error(`Unsupported locale '${locale}'. Supported locales are 'de' and 'en'.`);
}

export function setDateYearToNextOccurrence(date: Date): Date {
    const today = new Date();
    let adjustedDate = setYear(date, getYear(today));
    if (!isSameDay(adjustedDate, today) && isBefore(adjustedDate, today)) {
        adjustedDate = setYear(adjustedDate, getYear(adjustedDate) + 1);
    }
    return adjustedDate;
}

export function daysUntil(date: Date): number {
    return differenceInCalendarDays(date, new Date());
}
