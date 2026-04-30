import { Controller, Post, Patch, Get, Body, Param, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IsObject, IsIn } from "class-validator";
import { FormsService } from "./forms.service";
import type { FormType } from "./form.entity";

class CreateFormDto {
  @IsIn(["succession", "naturalisation", "maprimereno"])
  type!: FormType;

  @IsObject()
  data!: Record<string, unknown>;
}

class UpdateFormDto {
  @IsObject()
  data!: Record<string, unknown>;
}

@Controller("forms")
@UseGuards(AuthGuard("jwt"))
export class FormsController {
  constructor(private formsService: FormsService) {}

  @Post()
  create(@Request() req: { user: { id: string } }, @Body() dto: CreateFormDto) {
    return this.formsService.create(req.user.id, dto.type, dto.data);
  }

  @Patch(":id")
  update(
    @Request() req: { user: { id: string } },
    @Param("id") id: string,
    @Body() dto: UpdateFormDto,
  ) {
    return this.formsService.update(id, req.user.id, dto.data);
  }

  @Get()
  findAll(@Request() req: { user: { id: string } }) {
    return this.formsService.findAll(req.user.id);
  }

  @Get(":id")
  findOne(@Request() req: { user: { id: string } }, @Param("id") id: string) {
    return this.formsService.findOne(id, req.user.id);
  }
}
