import { z } from 'zod';

export const tournamentSchema = z.object({
    tournamentName: z.string().min(1, "대회명을 입력해주세요."),
    tournamentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)."),
    programType: z.string().optional()
});

export const trainingStartSchema = z.object({
    programId: z.string().min(1, "프로그램 ID가 필요합니다."),
    programName: z.string().min(1, "프로그램명이 필요합니다."),
    weeks: z.number().min(1, "훈련 기간은 최소 1주 이상이어야 합니다.")
});

export const trainingUpdateSchema = z.object({
    progressId: z.number(),
    tasksCompleted: z.number().min(0),
    weekNumber: z.number().min(1)
});
