import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Reply } from './entities/reply.entity';
import { ReplyLike } from './entities/reply-likes.entity';
import { Comment } from './entities/comment.entity';
import { CommentImage } from './entities/comment-image.entity';
import { CommentLike } from './entities/comment-likes.entity';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    TypeOrmModule.forFeature([
      Comment,
      Reply,
      ReplyLike,
      CommentImage,
      CommentLike,
    ]),
    ProductModule,
  ],
})
export class CommentModule {}
