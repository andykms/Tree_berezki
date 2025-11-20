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
  async remove(@Param('id') id: string) {
    return await this.commentService.remove(id);
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
}
