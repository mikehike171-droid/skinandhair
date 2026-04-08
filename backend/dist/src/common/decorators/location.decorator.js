"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentLocation = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentLocation = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-location-id'] || request.query.locationId;
});
//# sourceMappingURL=location.decorator.js.map