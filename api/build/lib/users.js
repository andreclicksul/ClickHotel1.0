"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.difTime = void 0;
const BRAZIL_TIMEZONE = 'America/Sao_Paulo';
const getBrazilNowMinutes = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: BRAZIL_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const hour = Number.parseInt(parts.find((part) => part.type === 'hour')?.value ?? '0', 10);
    const minute = Number.parseInt(parts.find((part) => part.type === 'minute')?.value ?? '0', 10);
    return hour * 60 + minute;
};
const toMinutes = (hours, minutes) => {
    const parsedHours = Number.parseInt(hours ?? '0', 10);
    const parsedMinutes = Number.parseInt(minutes ?? '0', 10);
    const h = Number.isNaN(parsedHours) ? 0 : parsedHours;
    const m = Number.isNaN(parsedMinutes) ? 0 : parsedMinutes;
    return (h % 24) * 60 + (m % 60);
};
const difTime = (HH1, mm1, HH2, mm2) => {
    const start = toMinutes(HH1, mm1);
    const finish = toMinutes(HH2, mm2);
    const now = getBrazilNowMinutes();
    if (start === finish) {
        return false;
    }
    return start > finish
        ? !(now >= start || now <= finish)
        : now < start || now > finish;
};
exports.difTime = difTime;
