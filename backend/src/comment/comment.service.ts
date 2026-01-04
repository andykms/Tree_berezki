import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../user/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { Product } from '../product/entities/product.entity';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';
import { ESortedCommentBy } from './dto/get-comments-query.dto';
import { LikeCommentDto } from './dto/like-comment.dto';
import { ETypeLikes } from './entities/comment-likes.entity';
import { CommentLike } from './entities/comment-likes.entity';
import { CommentImage } from './entities/comment-image.entity';
import { CreateReplyDto } from './dto/create-reply.dto';
import { Reply } from './entities/reply.entity';
import { ReplyLike } from './entities/reply-likes.entity';
import { GetRepliesQueryDto } from './dto/get-replies.dto';
import { LikeReplyDto } from './dto/like-reply.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Reply)
    private replyRepository: Repository<Reply>,
    @InjectRepository(ReplyLike)
    private replyLikeRepository: Repository<ReplyLike>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(CommentImage)
    private commentImageRepository: Repository<CommentImage>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(CommentLike)
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
      throw new BadRequestException('комментарий уже существует');
    }

    const product = await this.productRepository.findOneOrFail({
      where: { id: createCommentDto.productId },
    });

    const images: CommentImage[] = [];

    for(const imageDto of createCommentDto.images){
      const image = await this.commentImageRepository.create({
        url: imageDto.path,
      });
      await this.commentImageRepository.save(image);
    }
    const comment = await this.commentRepository.create({
      ...createCommentDto,
      product,
      account,
      images,
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


    queryBuilder.leftJoinAndSelect('comment.images.', 'images');

    const comments = await queryBuilder.getMany();

    return {
      items: comments,
      total: comments.length,
    };
  }

  async findOne(id: string) {
    return await this.commentRepository.findOne({ where: { id }, relations: ['images'] });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    return await this.commentRepository.update(id, updateCommentDto);
  }

  async remove(id: string, user: User) {
    const comment = await this.commentRepository.findOneOrFail({ where: { id ,account: {user}} });
    return await this.commentRepository.delete({id, account: {user}});
  }

  async like(id: string, likeDto: LikeCommentDto, user: User) {
    const account = user.accounts.find(
      (account) => account.id === likeDto.accountId,
    );
    const comment = await this.commentRepository.findOneOrFail({ where: { id } });

    if (comment.likes.some((like) => like.account.id == likeDto.accountId)) {
      throw new BadRequestException('лайк/дизлайк уже поставлен');
    }
    const like = await this.commentLikeRepository.create({
      account,
      comment,
      type: ETypeLikes.LIKE,
    });

    comment.likes_count += 1;
    await this.commentRepository.save(comment);

    await this.commentLikeRepository.save(like);

    return comment;
  }

  async unlike(id: string, likeDto: LikeCommentDto, user: User) {
    const account = user.accounts.find(
      (account) => account.id === likeDto.accountId,
    );
    const comment = await this.commentRepository.findOneOrFail({ where: { id } });

    const like = await this.commentLikeRepository.findOneOrFail({
      where: {
        account,
        type: ETypeLikes.LIKE,
        comment,
      },
    });


    await this.commentLikeRepository.delete(like.id);

    comment.likes_count -= 1;
    await this.commentRepository.save(comment);

    return comment;
  }

  async dislike(id: string, likeDto: LikeCommentDto, user: User) {
    const account = user.accounts.find(
      (account) => account.id === likeDto.accountId,
    );
    const comment = await this.commentRepository.findOneOrFail({ where: { id } });

    if (comment.likes.some((like) => like.account.id == likeDto.accountId)) {
      throw new BadRequestException('лайк/дизлайк уже поставлен');
    }

    const dislike = await this.commentLikeRepository.create({
      account,
      comment,
      type: ETypeLikes.DISLIKE,
    });

    await this.commentLikeRepository.save(dislike);


    comment.dislikes_count += 1;
    await this.commentRepository.save(comment);

    return comment;
  }

  async undislike(id: string, likeDto: LikeCommentDto, user: User) {
    const account = user.accounts.find(
      (account) => account.id === likeDto.accountId,
    );
    const comment = await this.commentRepository.findOneOrFail({ where: { id } });
    const dislike = await this.commentLikeRepository.findOneOrFail({
      where: {
        account,
        type: ETypeLikes.DISLIKE,
        comment,
      },
    });


    comment.dislikes_count -= 1;
    await this.commentRepository.save(comment);

    await this.commentLikeRepository.delete(dislike.id);

    return comment;
  }

  async reply(commentId: string, replyDto: CreateReplyDto, user: User) {
    const comment = await this.commentRepository.findOneOrFail({where: {id: commentId}});

    const account = user.accounts.find((account) => account.id === replyDto.accountId);

    const reply = await this.replyRepository.create({
      ...replyDto,
      comment,
      account,
      parent_id: replyDto.replyId || ""
    });

    await this.replyRepository.save(reply);

    return reply;
  }

  async getReplies(commentId: string, query: GetRepliesQueryDto) {
    const limit = Number(query.limit);
    const page = Number(query.page);
    const replies = await this.replyRepository.find({where: {comment: {id: commentId}}, order: {created_at: 'DESC'}, take: limit, skip: page * limit});

    return {
      items: replies,
      total: replies.length
    };
  }

  async likeReply(id: string, likeDto: LikeReplyDto, user: User) {
    const reply = await this.replyRepository.findOneOrFail({where: {id}});

    const account = user.accounts.find((account) => account.id === likeDto.accountId);

    if (reply.likes.some((like) => like.account.id == likeDto.accountId)) {
      throw new BadRequestException('лайк/дизлайк уже поставлен');
    }

    const like = await this.replyLikeRepository.create({
      account,
      reply,
      type: ETypeLikes.LIKE
    });

    reply.likes_count += 1;
    await this.replyRepository.save(reply);

    await this.replyLikeRepository.save(like);

    return reply;
  }

  async unlikeReply(id: string, likeDto: LikeReplyDto, user: User) {
    const reply = await this.replyRepository.findOneOrFail({where: {id}});

    const account = user.accounts.find((account) => account.id === likeDto.accountId);

    const like = await this.replyLikeRepository.findOneOrFail({where: {account, reply, type: ETypeLikes.LIKE}});

    await this.replyLikeRepository.delete(like.id);

    reply.likes_count -= 1;
    await this.replyRepository.save(reply);

    return reply;
  }

  async dislikeReply(id: string, likeDto: LikeReplyDto, user: User) {
    const reply = await this.replyRepository.findOneOrFail({where: {id}});

    const account = user.accounts.find((account) => account.id === likeDto.accountId);

    if (reply.likes.some((like) => like.account.id == likeDto.accountId)) {
      throw new BadRequestException('лайк/дизлайк уже поставлен');
    }

    const like = await this.replyLikeRepository.create({
      account,
      reply,
      type: ETypeLikes.DISLIKE
    });

    reply.dislikes_count += 1;
    await this.replyRepository.save(reply);

    await this.replyLikeRepository.save(like);

    return reply;
  }

  async undislikeReply(id: string, likeDto: LikeReplyDto, user: User) {
    const reply = await this.replyRepository.findOneOrFail({where: {id}});

    const account = user.accounts.find((account) => account.id === likeDto.accountId);

    const dislike = await this.replyLikeRepository.findOneOrFail({where: {account, reply, type: ETypeLikes.DISLIKE}});

    await this.replyLikeRepository.delete(dislike.id);

    reply.dislikes_count -= 1;
    await this.replyRepository.save(reply);

    return reply; 
  }
}
