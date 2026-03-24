export class OrganizationId {
  constructor(readonly value: string) {
    if (!value) {
      throw new Error('OrganizationId cannot be empty');
    }
  }
}
