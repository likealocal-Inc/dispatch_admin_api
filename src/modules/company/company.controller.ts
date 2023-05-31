import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create.company.dto';
import { UpdateCompanyDto } from './dto/update.company.dto';
import { PagingDto } from 'src/libs/core/dtos/paging';
import { APIResponseObj, HttpUtils } from 'src/libs/core/utils/http.utils';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CompanyEntiry } from './entities/company.entity';
import { AUTH_MUST } from 'src/config/core/decorators/api/auth.must/auth.must.decorator';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.companyService.create(createCompanyDto),
    );
  }

  @Get()
  async findManyPaging(@Query() pagingDto: PagingDto): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(
      true,
      await this.companyService.findManyPaging(pagingDto),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.companyService.findOneById(id),
    );
  }

  @AUTH_MUST()
  @Patch(':id/:active')
  @ApiCreatedResponse({ type: CompanyEntiry, isArray: false })
  async updateActive(
    @Param('id') id: string,
    @Param('active') active: string,
  ): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(
      true,
      await this.companyService.updateAcive(
        id,
        active === 'true' ? true : false,
      ),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.companyService.update(id, updateCompanyDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.companyService.remove(id),
    );
  }
}
