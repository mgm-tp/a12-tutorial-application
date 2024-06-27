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
    return new Date();
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
