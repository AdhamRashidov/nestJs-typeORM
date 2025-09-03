import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const PORT = Number(process.env.PORT) || 3000;
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('/api');
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
		}),
	);
	await app.listen(PORT, () => console.log('server running on port', PORT));
}
bootstrap();
