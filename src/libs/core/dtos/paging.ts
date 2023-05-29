export class PagingDto {
  page: number;
  size: number;

  getPaging(orderBy?: any) {
    return {
      skip: +this.page,
      take: +this.size,
      orderBy,
    };
  }
}
