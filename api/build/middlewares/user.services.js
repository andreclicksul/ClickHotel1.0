"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserAuthentication = exports.permissionDay = void 0;
const permissionDay = (sunday, monday, tuesday, wednesday, thursday, friday, saturday) => {
    const weekDay = new Date().getDay();
    const dayUser = [
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
    ];
    const isPermission = dayUser[weekDay];
    return isPermission;
};
exports.permissionDay = permissionDay;
async function findUserAuthentication(objectUser) {
    const passwordHash = objectUser.password;
    const user = {
        id: objectUser.id,
        user: objectUser.user,
        name: objectUser.name,
        email: objectUser.email,
        phone: objectUser.phone,
        client: objectUser.client,
        caduser: objectUser.caduser,
        checklist: objectUser.checklist,
        provider: objectUser.provider,
        audit: objectUser.audit,
        accountpay: objectUser.accountpay,
        accountreceive: objectUser.accountreceive,
        financial: objectUser.financial,
        product: objectUser.product,
        occupationmap: objectUser.occupationmap,
        color: objectUser.color,
        avatar: objectUser.avatar,
        starthour: objectUser.starthour,
        startminute: objectUser.startminute,
        finishhour: objectUser.finishhour,
        finishminute: objectUser.finishminute,
    };
    const isPermission = (0, exports.permissionDay)(objectUser.sunday, objectUser.monday, objectUser.tuesday, objectUser.wednesday, objectUser.thursday, objectUser.friday, objectUser.saturday);
    return {
        user,
        isPermission,
        passwordHash,
    };
}
exports.findUserAuthentication = findUserAuthentication;
