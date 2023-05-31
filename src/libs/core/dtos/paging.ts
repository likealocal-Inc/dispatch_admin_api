export class PagingDto {
  page: number;
  size: number;
  condition?: string;
  isAllList = false;

  getPaging(orderBy?: any) {
    return {
      skip: +this.page,
      take: +this.size,
      orderBy,
    };
  }
}
