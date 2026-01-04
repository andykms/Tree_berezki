import * as dotenv from 'dotenv';
import { ConfigType, registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import {join} from "path"
import { User } from '../user/entities/user.entity';
import { Shop } from '../shop/entities/shop.entity';
import { ShowcaseProducts } from '../shop/entities/showcase-products.entity';
import { Question } from '../question/entities/question.entity';
import { Measure } from '../product/entities/measure.entity';
import { Param } from '../product/entities/param.entity';
import { ProductImage } from '../product/entities/product-image.entity';
import { ProductParam } from '../product/entities/product-param.entity';
import { Product } from '../product/entities/product.entity';
import { OrderProduct } from '../order/entities/order-product';
import { Order } from '../order/entities/order.entity';
import { CommentImage } from '../comment/entities/comment-image.entity';
import { CommentLike } from '../comment/entities/comment-likes.entity';
import { Comment } from '../comment/entities/comment.entity';
import { ReplyLike } from '../comment/entities/reply-likes.entity';
import { Reply } from '../comment/entities/reply.entity';
import { Category } from '../category/entities/category.entity';
import { RequiredParam } from '../category/entities/required-param.entity';
import { Basket } from '../basket/entities/basket.entity';
import { Account } from '../account/entities/account.entity';

dotenv.config();

export const dbConfiguration = registerAs(
  'DB_CONFIG',
  (): DataSourceOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '76911120',
    database: process.env.DB_NAME || 'tree_berezki',
    entities: [
      User,
      Shop,
      ShowcaseProducts,
      Question,
      Measure,
      Param,
      ProductImage,
      ProductParam,
      Product,
      OrderProduct,
      Order,
      CommentImage,
      CommentLike,
      Comment,
      ReplyLike,
      Reply,
      Category,
      RequiredParam,
      Basket,
      Account,
    ],
    synchronize: true,
  }),
);

export type IDbConfig = ConfigType<typeof dbConfiguration>;

export const AppDataSource = new DataSource(dbConfiguration());
