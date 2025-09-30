"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.difTime = void 0;
const difTime = (HH1, mm1, HH2, mm2) => {
    const dateStart = new Date();
    dateStart.setHours(parseInt(HH1), parseInt(mm1), 0, 0);
    const dateFinish = new Date();
    dateFinish.setHours(parseInt(HH2), parseInt(mm2), 0, 0);
    const now = new Date();
    return dateStart > dateFinish
        ? !(now >= dateStart || now <= dateFinish)
        : now < dateStart || now > dateFinish;
};
exports.difTime = difTime;
