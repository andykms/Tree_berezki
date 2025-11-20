import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../user/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { Product } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';
import { ESortedCommentBy } from './dto/get-comments-query.dto';
import { LikeCommentDto } from './dto/like-comment.dto';
import { ETypeLikes } from './entities/comment-likes.entity';
import { CommentLike } from './entities/comment-likes.entity';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: Repository<Comment>,
    private productRepository: Repository<Product>,
    private commentLikeRepository: Repository<CommentLike>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User) {
    const account = user.accounts.find(
      (account) => account.id === createCommentDto.accountId,
    );

    if (
      account?.comments.find(
        (comment) => comment.product.id === createCommentDto.productId,
      )
    ) {
      throw new NotFoundException('комментарий уже существует');
    }

    const product = await this.productRepository.findOne({
      where: { id: createCommentDto.productId },
    });
    if (!product) {
      throw new NotFoundException('товар не найден');
    }

    const comment = await this.commentRepository.create({
      ...createCommentDto,
      product,
      account,
    });
    return await this.commentRepository.save(comment);
  }

  async findAll(query: GetCommentsQueryDto) {
    const product = await this.productRepository.findOne({
      where: { id: query.productId },
    });
    if (!product) {
      throw new NotFoundException('товар не найден');
    }

    const queryBuilder = this.commentRepository.createQueryBuilder('comment');

    queryBuilder.andWhere('comment.product = :product', {
      product,
    });

    if (query.withImage) {
      queryBuilder.andWhere('comment.images.length > 0');
    }

    if (query.sortBy) {
      switch (query.sortBy) {
        case ESortedCommentBy.MAXRATING:
          queryBuilder.orderBy('comment.rating', 'DESC');
          break;
        case ESortedCommentBy.MINRATING:
          queryBuilder.orderBy('comment.rating', 'ASC');
          break;
        case ESortedCommentBy.NEW:
          queryBuilder.orderBy('comment.created_at', 'DESC');
          break;
        case ESortedCommentBy.OLD:
          queryBuilder.orderBy('comment.created_at', 'ASC');
          break;
        case ESortedCommentBy.USEFUL:
          queryBuilder
            .addSelect(
              `(SELECT COUNT(*) FROM comment_like WHERE comment_like.commentId = comment.id AND comment_like.type = 'like') -
              (SELECT COUNT(*) FROM comment_like WHERE comment_like.commentId = comment.id AND comment_like.type = 'dislike')`,
              'useful_rating',
            )
            .orderBy('useful_rating', 'DESC');
          break;
      }
    }
    queryBuilder
      .skip((Number(query.page) - 1) * Number(query.limit))
      .take(Number(query.limit));

    const comments = await queryBuilder.getMany();

    return {
      items: comments,
      total: comments.length,
    };
  }

  async findOne(id: string) {
    return await this.commentRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    return await this.commentRepository.update(id, updateCommentDto);
  }

  async remove(id: string) {
    return await this.commentRepository.delete(id);
  }

  async like(id: string, likeDto: LikeCommentDto, user: User) {
    const account = user.accounts.find(
      (account) => account.id === likeDto.accountId,
    );
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('комментарий не найден');
    }
    if (comment.likes.some((like) => like.account.id == likeDto.accountId)) {
      throw new BadRequestException('лайк/дизлайк уже поставлен');
    }
    const like = await this.commentLikeRepository.create({
      account,
      comment,
      type: ETypeLikes.LIKE,
    });

    await this.commentLikeRepository.save(like);

    return Promise.resolve({
      message: 'ok',
    });
  }

  async unlike(id: string, likeDto: LikeCommentDto, user: User) {
    const account = user.accounts.find(
      (account) => account.id === likeDto.accountId,
    );
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('комментарий не найден');
    }
    const like = await this.commentLikeRepository.findOne({
      where: {
        account,
        type: ETypeLikes.LIKE,
        comment,
      },
    });

    if (!like) {
      throw new NotFoundException('лайк не найден');
    }

    await this.commentLikeRepository.delete(like.id);

    return Promise.resolve({
      message: 'ok',
    });
  }

  async dislike(id: string, likeDto: LikeCommentDto, user: User) {
    const account = user.accounts.find(
      (account) => account.id === likeDto.accountId,
    );
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('комментарий не найден');
    }
    if (comment.likes.some((like) => like.account.id == likeDto.accountId)) {
      throw new BadRequestException('лайк/дизлайк уже поставлен');
    }

    const dislike = await this.commentLikeRepository.create({
      account,
      comment,
      type: ETypeLikes.DISLIKE,
    });

    await this.commentLikeRepository.save(dislike);

    return Promise.resolve({
      message: 'ok',
    });
  }

  async undislike(id: string, likeDto: LikeCommentDto, user: User) {
    const account = user.accounts.find(
      (account) => account.id === likeDto.accountId,
    );
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('комментарий не найден');
    }
    const dislike = await this.commentLikeRepository.findOne({
      where: {
        account,
        type: ETypeLikes.DISLIKE,
        comment,
      },
    });

    if (!dislike) {
      throw new NotFoundException('дизлайк не найден');
    }

    await this.commentLikeRepository.delete(dislike.id);

    return Promise.resolve({
      message: 'ok',
    });
  }
}
