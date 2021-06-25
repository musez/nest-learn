import { Test, TestingModule } from '@nestjs/testing';
import { HolidayCatController } from './holiday-cat.controller';
import { HolidayCatService } from './holiday-cat.service';

describe('HolidayCatController', () => {
  let controller: HolidayCatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolidayCatController],
      providers: [HolidayCatService],
    }).compile();

    controller = module.get<HolidayCatController>(HolidayCatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
