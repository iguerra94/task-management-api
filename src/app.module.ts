import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   envFilePath: [`.env.stage.${process.env.STAGE}`],
    //   validationSchema: configValidationSchema,
    // }),
    TasksModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (_
        // configService: ConfigService
      ) => {
        console.log(process.env.stage);
        const isProduction = process.env.STAGE === 'prod';

        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          url: `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`,
          entities: [Task, User],
          synchronize: true,
        };
      },
    }),
  ],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
