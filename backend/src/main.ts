import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error);
  process.exit(1);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://formai-flax.vercel.app",
    ],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Backend running on http://localhost:${process.env.PORT ?? 3001}`);
}
bootstrap();
