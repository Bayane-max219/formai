import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Form, FormType } from "./form.entity";

@Injectable()
export class FormsService {
  constructor(@InjectRepository(Form) private repo: Repository<Form>) {}

  async create(userId: string, type: FormType, data: Record<string, unknown>) {
    const form = this.repo.create({ userId, type, data, status: "draft" });
    return this.repo.save(form);
  }

  async update(id: string, userId: string, data: Record<string, unknown>) {
    const form = await this.repo.findOne({ where: { id, userId } });
    if (!form) throw new NotFoundException("Form not found");
    form.data = { ...form.data, ...data };
    return this.repo.save(form);
  }

  async findOne(id: string, userId: string) {
    const form = await this.repo.findOne({ where: { id, userId } });
    if (!form) throw new NotFoundException("Form not found");
    return form;
  }

  async findAll(userId: string) {
    return this.repo.find({ where: { userId }, order: { createdAt: "DESC" } });
  }
}
