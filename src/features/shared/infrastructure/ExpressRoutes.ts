import { Router } from 'express';
import { ExpressTestimonialController } from '../../core/testimonial/infraestructure/ExpressTestimonialController';

export class ExpressRoutes {
  constructor(
    private readonly testimonialController: ExpressTestimonialController,
  ) {}

  public register(router: Router): void {
    router.post('/testimonials', (req, res, next) =>
      this.testimonialController.create(req, res, next),
    );
    router.get('/testimonials', (req, res, next) =>
      this.testimonialController.findAll(req, res, next),
    );
    router.get('/testimonials/approved', (req, res, next) =>
      this.testimonialController.findApproved(req, res, next),
    );
    router.get('/testimonials/:id', (req, res, next) =>
      this.testimonialController.findById(req, res, next),
    );
    router.put('/testimonials/:id', (req, res, next) =>
      this.testimonialController.update(req, res, next),
    );
    router.patch('/testimonials/:id/approve', (req, res, next) =>
      this.testimonialController.approve(req, res, next),
    );
    router.delete('/testimonials/:id', (req, res, next) =>
      this.testimonialController.remove(req, res, next),
    );
  }
}
