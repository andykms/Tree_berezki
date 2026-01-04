import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AccountGuard } from '../auth/guards/account.guard';
import { GetCommentsQueryDto } from './dto/get-comments-query.dto';
import { LikeCommentDto } from './dto/like-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { GetRepliesQueryDto } from './dto/get-replies.dto';
import { LikeReplyDto } from './dto/like-reply.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    return await this.commentService.create(createCommentDto, req.user);
  }

  @Get()
  async findAll(@Query() query: GetCommentsQueryDto) {
    return await this.commentService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentService.update(id, updateCommentDto);
  }

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    return await this.commentService.remove(id, req.user);
  }

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Put(':id/likes')
  async like(
    @Param('id') id: string,
    @Body() likeDto: LikeCommentDto,
    @Req() req,
  ) {
    return await this.commentService.like(id, likeDto, req.user);
  }

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Delete(':id/likes')
  async unlike(
    @Param('id') id: string,
    @Body() likeDto: LikeCommentDto,
    @Req() req,
  ) {
    return await this.commentService.unlike(id, likeDto, req.user);
  }

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Put(':id/dislikes')
  async dislike(
    @Param('id') id: string,
    @Body() likeDto: LikeCommentDto,
    @Req() req,
  ) {
    return await this.commentService.dislike(id, likeDto, req.user);
  }

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Delete(':id/dislikes')
  async undislike(
    @Param('id') id: string,
    @Body() likeDto: LikeCommentDto,
    @Req() req,
  ) {
    return await this.commentService.undislike(id, likeDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Post(':id/reply')
  async reply(@Param('id') id: string, @Body() replyDto: CreateReplyDto, @Req() req) {
    return await this.commentService.reply(id, replyDto, req.user);
  }

  @Get(':id/reply')
  async getReplies(@Param('id') id: string, @Query() query: GetRepliesQueryDto) {
    return await this.commentService.getReplies(id, query);
  }

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Put('reply/:id/likes')
  async likeReply(@Param('id') id: string, @Body() likeDto: LikeReplyDto, @Req() req) {
    return await this.commentService.likeReply(id, likeDto, req.user);
  }

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Delete('reply/:id/likes')
  async unlikeReply(@Param('id') id: string, @Body() likeDto: LikeReplyDto, @Req() req) {
    return await this.commentService.unlikeReply(id, likeDto, req.user);
  }

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Put('reply/:id/dislikes')
  async dislikeReply(@Param('id') id: string, @Body() likeDto: LikeReplyDto, @Req() req) {
    return await this.commentService.dislikeReply(id, likeDto, req.user);
  }

  @UseGuards(JwtGuard)
  @UseGuards(AccountGuard)
  @Delete('reply/:id/dislikes')
  async undislikeReply(@Param('id') id: string, @Body() likeDto: LikeReplyDto, @Req() req) {
    return await this.commentService.undislikeReply(id, likeDto, req.user);
  }
}
