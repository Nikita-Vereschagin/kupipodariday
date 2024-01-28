import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  //  POST /wishes

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateWishDto) {
    return this.wishesService.create(req.user, dto);
  }

  //  GET /wishes/last

  @Get('last')
  findLastWishes() {
    return this.wishesService.findLastWishes();
  }

  //  GET /wishes/top

  @Get('top')
  findTopWishes() {
    return this.wishesService.findTopWishes();
  }

  //  GET /wishes/{id}
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const wish = this.wishesService.findOne(Number(id));

    if (!wish) {
      throw new Error('Подарок не найден');
    }

    return wish;
  }

  //  PATCH /wishes/{id}
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateOne(@Param('id') id: string, @Req() req, @Body() dto: UpdateWishDto) {
    return this.wishesService.updateOne(Number(id), Number(req.user.id), dto);
  }

  //  DELETE /wishes/{id}
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeOne(@Param('id') id: string, @Req() req) {
    return this.wishesService.removeOne(Number(id), Number(req.user.id));
  }

  //  PATCH /wishes/{id}/copy
  @UseGuards(JwtAuthGuard)
  @Patch(':id/copy')
  updateCopy(@Param('id') id: string, @Req() req) {
    return this.wishesService.updateCopy(Number(id), Number(req.user.id));
  }
}
