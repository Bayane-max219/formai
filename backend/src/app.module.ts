import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/user.entity";
import { Form } from "./forms/form.entity";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { FormsModule } from "./forms/forms.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        url: config.get("DATABASE_URL"),
        entities: [User, Form],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    FormsModule,
  ],
})
export class AppModule {}
