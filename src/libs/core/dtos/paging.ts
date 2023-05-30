export class PagingDto {
  page: number;
  size: number;
  condition?: string;

  getPaging(orderBy?: any) {
    return {
      skip: +this.page,
      take: +this.size,
      orderBy,
    };
  }
}
