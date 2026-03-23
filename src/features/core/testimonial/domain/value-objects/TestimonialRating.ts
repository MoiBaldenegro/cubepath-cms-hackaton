export enum TestimonialRatingEnum {
  ONE_STAR = 1,
  TWO_STARS = 2,
  THREE_STARS = 3,
  FOUR_STARS = 4,
  FIVE_STARS = 5,
}

export class TestimonialRating {
  readonly value: TestimonialRatingEnum;

  constructor(value: TestimonialRatingEnum) {
    this.ensureIsValid(value);
    this.value = value;
  }

  private ensureIsValid(value: TestimonialRatingEnum): void {
    if (!Object.values(TestimonialRatingEnum).includes(value)) {
      throw new Error('Invalid TestimonialRating');
    }
  }
}
