import { FindAllTestimonials } from '../findAllTestimonials/FindAllTestimonials';
import { Testimonial } from '../../domain/Testimonial';
import { TestimonialRepository } from '../../domain/ports/TestimonialRepository';
import { OrganizationId } from '../../domain/value-objects/OrganizationId';

describe('FindAllTestimonials Multi-Tenant', () => {
  let repo: TestimonialRepository;
  let useCase: FindAllTestimonials;

  beforeEach(() => {
    repo = {
      findAll: jest.fn((orgId: OrganizationId) => {
        // Simula datos de dos organizaciones
        if (orgId.value === 'org-1') {
          return Promise.resolve([
            { id: 't1', organizationId: new OrganizationId('org-1') } as unknown as Testimonial,
          ]);
        }
        if (orgId.value === 'org-2') {
          return Promise.resolve([
            { id: 't2', organizationId: new OrganizationId('org-2') } as unknown as Testimonial,
          ]);
        }
        return Promise.resolve([]);
      }),
    } as any;
    useCase = new FindAllTestimonials(repo);
  });

  it('solo retorna testimonios de la organización solicitada', async () => {
    const org1 = await useCase.run({ organizationId: 'org-1' });
    const org2 = await useCase.run({ organizationId: 'org-2' });
    expect(org1).toHaveLength(1);
    expect(org1[0].organizationId.value).toBe('org-1');
    expect(org2).toHaveLength(1);
    expect(org2[0].organizationId.value).toBe('org-2');
  });
});
