import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ClearAccess {
    constructor(private readonly prismaService: PrismaService) { }
    @Cron('0 0 * * *') // Runs every day at midnight
    async handleCron() {
        const now = new Date();
        await this.prismaService.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: now,
                },
            },
        });
    }
}