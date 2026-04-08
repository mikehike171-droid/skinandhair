"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    app.setGlobalPrefix('front-office');
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT') || 3003;
    await app.listen(port);
    console.log(`Front Office Service is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map