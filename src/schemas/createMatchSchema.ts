import { z } from "zod";

export const createMatchSchema = z.object({
  team1Name: z.string().min(1, "Nome do time 1 é obrigatório"),
  team2Name: z.string().min(1, "Nome do time 2 é obrigatório"),
  local: z.string().min(1, "Local é obrigatório"),
  horario: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
      "Formato de hora inválido (use HH:MM ou HH:MM:SS)"
    ),
  dia: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Formato de data inválido (use DD/MM/AAAA)"
    ),
});

export type CreateMatchFormData = z.infer<typeof createMatchSchema>;
