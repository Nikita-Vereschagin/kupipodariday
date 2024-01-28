import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  //  GET /users/me

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Req() req) {
    return this.usersService.findById(req.user.id);
  }

  //  PATCH /users/me

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  patchMe(@Req() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateOne(req.user, dto);
  }

  //  GET /users/me/wishes

  @UseGuards(JwtAuthGuard)
  @Get('me/wishes')
  findMyWIshes(@Req() req) {
    const user = req.user.id

    if (!user) {
      throw new Error(`Что-то пошло не так: ${user}`)
    }

    return this.wishesService.findUsersWishes(user.id)
  }

  //  GET /users/{username}

  @Get(':username')
  async findByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new Error('Такой пользователь не найден');
    }

    return user;
  }

  //  GET /users/{username}/wishes

  @Get(':username/wishes')
  async findWishesByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new Error('Такой пользователь не найден');
    }

    return this.wishesService.findUsersWishes(user.id);
  }

  //  GET /users/find

  @Post('find')
  findMany(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }
}
