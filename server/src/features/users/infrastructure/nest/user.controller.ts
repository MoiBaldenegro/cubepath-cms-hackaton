import { Body, Controller, Get, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { FindAllUsers } from '../../application/findAllUsers/FindAllUsers';
import { UpdateUserRole } from '../../application/updateUserRole/UpdateUserRole';
import { JwtAuthGuard } from '../../../auth/infrastructure/nest/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/nest/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/nest/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly findAllUsers: FindAllUsers,
    private readonly updateUserRole: UpdateUserRole,
  ) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAll(@Request() req: any) {
    const organizationId = req.user.organizationId;
    const users = await this.findAllUsers.run(organizationId);
    return users.map((user) => user.toPrimitives());
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    if (!['admin', 'editor'].includes(role)) {
      throw new Error('Invalid role');
    }
    await this.updateUserRole.run({ id, role });
    return { success: true };
  }
}
