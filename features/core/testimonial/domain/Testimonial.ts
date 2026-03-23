enum TestimonialStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

enum TestimonialTag {
    PRODUCT = 'PRODUCT',
    SERVICE = 'SERVICE',
    SUPPORT = 'SUPPORT',
}

enum Rating {
    ONE_STAR = 1,
    TWO_STARS = 2,
    THREE_STARS = 3,
    FOUR_STARS = 4,
    FIVE_STARS = 5
}

enum Category {
    TECHNOLOGY = 'TECHNOLOGY',
    HEALTHCARE = 'HEALTHCARE',
    EDUCATION = 'EDUCATION',
    FINANCE = 'FINANCE',
    ENTERTAINMENT = 'ENTERTAINMENT'
}

export class Testimonial {
    iKey: string;
    content: string;
    author: string;
    status: TestimonialStatus;
    tags: TestimonialTag[];
    rating: Rating;
    category: Category;
    imageUrl?: string;
    videoUrl?: string;

    constructor(
        iKey: string,
        content: string,
        author: string,
        status: TestimonialStatus,
        tags: TestimonialTag[],
        rating: Rating,
        category: Category
    ) {
        this.iKey = iKey;
        this.content = content;
        this.author = author;
        this.status = status;
        this.tags = tags;
        this.rating = rating;
        this.category = category;
    }

}