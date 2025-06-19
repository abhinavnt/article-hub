export class CategoryResponseDto {
  id: string;
  name: string;
  createdAt: Date;

  constructor(category: any) {
    this.id = category._id.toString();
    this.name = category.name;
    this.createdAt = category.createdAt;
  }
}