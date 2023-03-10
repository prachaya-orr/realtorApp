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
import { PropertyType, UserType } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import {
  CreateHomeDto,
  HomeResponseDto,
  InquireDto,
  UpdateHomeDto,
} from './dto/home.dto';
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

  @Roles(UserType.REALTOR)
  @Post()
  createHome(@Body() createHomeDto: CreateHomeDto, @User() user: UserInfo) {
    return this.homeService.createHome(createHomeDto, user.id);
  }

  @Roles(UserType.REALTOR)
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

  @Roles(UserType.REALTOR)
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

  @Roles(UserType.BUYER)
  @Post('/:id/inquire')
  async inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
    @Body() { message }: InquireDto,
  ) {
    return this.homeService.inquire(user, homeId, message);
  }

  @Roles(UserType.REALTOR)
  @Get(':id/messages')
  async getHomeMessages(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    return this.homeService.getMessagesByHomeId(id);
  }
}

// http://localhost:3000/home/Thailand/100000/200000

// http://localhost:3000/home?city=Thailand&minPrice=100000&maxPrice=200000

// Buyer
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoib2htIiwiaWQiOjcsImlhdCI6MTY3MzU5ODExOSwiZXhwIjoxNjczNzcwOTE5fQ.JR78uP-UBoa9OZFgj522FsUHQvGdZZg1k83qeL9a5jM

// Realter
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoib2htIiwiaWQiOjYsImlhdCI6MTY3MzU5Nzg5NSwiZXhwIjoxNjczNzcwNjk1fQ.tSLkyuODtWRhQuE7RikB7qN6M5l3GVODBldO66FSa7I

// 1) Buyer sends message to Realtor
// 2) Reaktor gets all messages
