import { Request, Response, NextFunction } from 'express';
import { TestimonialServiceContainer } from '../../../shared/infrastructure/TestimonialServiceContainer';

export class ExpressTestimonialController {
  constructor(private readonly container: TestimonialServiceContainer) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.container.createTestimonial.run(req.body);
      res.status(201).send();
    } catch (error: any) {
      next(error);
    }
  }

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { search } = req.query;
      const result = await this.container.findAllTestimonials.run({
        search: typeof search === 'string' ? search : undefined,
      });
      res.status(200).json(result.map((t) => t.toPrimitives()));
    } catch (error: any) {
      next(error);
    }
  }

  async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await this.container.findTestimonialById.run({ id });
      res.status(200).json(result.toPrimitives());
    } catch (error: any) {
      next(error);
    }
  }

  async findApproved(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { limit } = req.query;
      const result = await this.container.findApprovedTestimonials.run({
        limit: limit ? Number(limit) : undefined,
      });
      res.status(200).json(result.map((t) => t.toPrimitives()));
    } catch (error: any) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.container.removeTestimonial.run({ id });
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const body = req.body;
      await this.container.updateTestimonial.run({ ...body, id });
      res.status(200).send();
    } catch (error: any) {
      next(error);
    }
  }

  async approve(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.container.approveTestimonial.run({ id });
      res.status(200).send();
    } catch (error: any) {
      next(error);
    }
  }
}
