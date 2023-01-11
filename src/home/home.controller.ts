import { Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { HomeResponseDto } from './dto/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('properType') properType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    console.log({city, minPrice, maxPrice, properType});
    return this.homeService.getHomes();
  }

  @Get(':id')
  getHome() {
    return {};
  }

  @Post()
  createHome() {
    return {};
  }

  @Put(':id')
  updateHome() {
    return {};
  }

  @Delete(':id')
  deleteHome() {}
}

// http://localhost:3000/home/Thailand/100000/200000

// http://localhost:3000/home?city=Thailand&minPrice=100000&maxPrice=200000
