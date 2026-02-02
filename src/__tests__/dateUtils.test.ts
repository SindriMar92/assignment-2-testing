import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	getCurrentYear,
	add,
	isWithinRange,
	isDateBefore,
	isSameDay,
	getHolidays,
	isHoliday,
} from "../dateUtils";
import { DATE_UNIT_TYPES } from "../constants";

describe("Date Utils", () => {
	it("getCurrentYear return the current year", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2022-01-01"));

		expect(getCurrentYear()).toBe(2022);

		vi.useRealTimers();
	});

	it ("add adds days to a date", () => {
		const date = new Date(2020, 0, 1);
		const result = add(date, 5, DATE_UNIT_TYPES.DAYS);

		expect(result).toEqual(new Date(2020, 0, 6));
	});

	it("add throws an error for invalid dates", () => {
		expect(() => add("not a date" as any, 1)).toThrow();
	});


	it("add throws an error for invalid amounts", () => {
		expect(() => add(new Date(), NaN)).toThrow();
	});

	it("isWithinRange returns true when date is in range", () => {
		const date = new Date(2020, 0, 5);
		const from = new Date(2020, 0, 1);
		const to = new Date(2020, 0, 10);

		expect(isWithinRange(date, from, to)).toBe(true);
	});

	it("isWithinRange throws an error when range is invalid", () => {
		const date = new Date();
		const from = new Date(2020, 0, 10);
		const to = new Date(2020, 0, 1);

		expect(() => isWithinRange(date, from, to)).toThrow();
	});

	it("isDateBefore returns true when date is before another", () => {
		const date1 = new Date(2020, 0, 1);
		const date2 = new Date(2020, 0, 2);

		expect(isDateBefore(date1, date2)).toBe(true);
	});

	it("isSameDay returns true for same day with different times", () => { 
		const morning = new Date(2020, 0, 1, 8);
		const evening = new Date(2020, 0, 1, 20);

		expect(isSameDay(morning, evening)).toBe(true);
	});

	it("getHolidayd returns holidays for a year", async () => {
		vi.useFakeTimers();

		const promise = getHolidays(2024);
		vi.advanceTimersByTime(100);

		const holidays = await promise;
		
		expect(holidays.length).toBe(3);
		expect(holidays[0]).toEqual(new Date(2024, 0, 1));

		vi.useRealTimers();
	});

	it("isHoliday returns true for Christmas", async () => {
		vi.useFakeTimers();
		
		const date = new Date(2024, 11, 25);
		const promise = isHoliday(date);

		vi.advanceTimersByTime(100);

		expect(await promise).toBe(true);

		vi.useRealTimers();
	});

	it("isHoliday returns false for a normal day", async () => {
    		vi.useFakeTimers();

    		const date = new Date(2024, 6, 1);
    		const promise = isHoliday(date);

    		vi.advanceTimersByTime(100);

    		expect(await promise).toBe(false);

    		vi.useRealTimers();
  	});
});

