import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { resolveSoa } from 'dns';
import { AuthGuard } from 'src/guards/auth.guard';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number): Promise<HomeResponseDto> {
    return this.homeService.getHomeById(id);
  }

  // @Roles(UserType.REALTOR,UserType.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  createHome(@Body() createHomeDto: CreateHomeDto, @User() user: UserInfo) {
    // return this.homeService.createHome(createHomeDto, user.id);
    return 'created Home';
  }

  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.updateHomeById(id, body);
  }

  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.deleteHomeById(id);
  }
}

// http://localhost:3000/home/Thailand/100000/200000

// http://localhost:3000/home?city=Thailand&minPrice=100000&maxPrice=200000
