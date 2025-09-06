import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const PORT = Number(process.env.PORT) || 3000;
	const app = await NestFactory.create(AppModule);
	const api = 'api/v1';
	app.setGlobalPrefix(api);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle('nestJs+typeORM')
		.setDescription('test API maqsadi haqida malumot')
		.setVersion('1.0.0')
		.addBearerAuth({
			type: 'http',
			scheme: 'Bearer',
			in: 'Header',
		})
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(api, app, documentFactory);

	await app.listen(PORT, () => console.log('server running on port', PORT));
}
bootstrap();
