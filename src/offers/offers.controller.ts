import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  //  POST /offers

  @Post()
  create(@Req() req, @Body() dto: CreateOfferDto) {
    return this.offersService.create(req.user.id, dto);
  }

  //  GET /offers

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  //  GET /offers/{id}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(Number(id));
  }
}
