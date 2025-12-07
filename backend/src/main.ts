import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('GDash Weather API')
    .setDescription('Documentação da API do Sistema de Monitoramento Climático')
    .setVersion('1.0')
    .addTag('weather')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const usersService = app.get(UsersService);
  const adminEmail = 'admin@example.com';
  
  const existingAdmin = await usersService.findOneByEmail(adminEmail);
  if (!existingAdmin) {
    console.log('Criando usuário padrão (Admin)...');
    await usersService.create({
      name: 'Admin GDASH',
      email: adminEmail,
      password: '123456',
    });
    console.log('Usuário Admin criado!');
  }

  await app.listen(3000);
}
bootstrap();