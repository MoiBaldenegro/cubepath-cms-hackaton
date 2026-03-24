export enum TestimonialCategoryEnum {
  TECHNOLOGY = 'TECHNOLOGY',
  HEALTHCARE = 'HEALTHCARE',
  EDUCATION = 'EDUCATION',
  FINANCE = 'FINANCE',
  ENTERTAINMENT = 'ENTERTAINMENT',
  OTHER = 'OTHER',
}

export class TestimonialCategory {
  readonly value: TestimonialCategoryEnum;

  constructor(value: TestimonialCategoryEnum) {
    this.ensureIsValid(value);
    this.value = value;
  }

  private ensureIsValid(value: TestimonialCategoryEnum): void {
    if (!Object.values(TestimonialCategoryEnum).includes(value)) {
      throw new Error('Invalid TestimonialCategory');
    }
  }
}
