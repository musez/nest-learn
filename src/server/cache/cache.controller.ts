import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CreateCacheDto } from './dto/create-cache.dto';
import { UpdateCacheDto } from './dto/update-cache.dto';

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}
}
