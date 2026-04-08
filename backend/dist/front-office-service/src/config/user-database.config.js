"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDatabaseConfig = void 0;
const user_entity_1 = require("../entities/user.entity");
const getUserDatabaseConfig = (configService) => ({
    name: 'userConnection',
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: 'hims_user_settings',
    entities: [user_entity_1.User],
    synchronize: false,
    logging: false,
});
exports.getUserDatabaseConfig = getUserDatabaseConfig;
//# sourceMappingURL=user-database.config.js.map