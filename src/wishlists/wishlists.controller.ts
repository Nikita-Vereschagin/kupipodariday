import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  //  GET /wishlists

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  //  POST /wishlists

  @Post()
  create(@Req() req, @Body() dto: CreateWishlistDto) {
    return this.wishlistsService.create(req.user, dto);
  }

  //  GET /wishlists/{id}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(Number(id));
  }

  //  PATCH /wishlists/{id}

  @Patch(':id')
  updateOne(@Param('id') id: string, @Req() req, dto: UpdateWishlistDto) {
    return this.wishlistsService.updateOne(
      Number(id),
      Number(req.user.id),
      dto,
    );
  }

  //  DELETE /wishlists/{id}

  @Delete(':id')
  removeOne(@Param('id') id: string, @Req() req) {
    return this.wishlistsService.removeOne(Number(id), Number(req.user.id));
  }
}
