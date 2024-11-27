import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ZodRideEstimateForm = z
  .object({
    customer_id: z
      .string()
      .min(1, { message: 'ID do cliente deve ter ao menos 1 caracteres' }),
    origin: z
      .string()
      .min(2, { message: 'Origem deve ter ao menos 2 caracteres' }),
    destination: z
      .string()
      .min(2, { message: 'Destino deve ter ao menos 2 caracteres' })
  })
  .refine((data) => data.origin !== data.destination, {
    message: 'O ponto de origem e destino não podem ser iguais!',
    path: ['confirm']
  });

export const ZodRideConfirmForm = z
  .object({
    customer_id: z
      .string()
      .min(1, { message: 'ID do cliente deve ter ao menos 1 caractere' }),
    origin: z
      .string()
      .min(2, { message: 'Origem deve ter ao menos 2 caracteres' }),
    destination: z
      .string()
      .min(2, { message: 'Destino deve ter ao menos 2 caracteres' }),
    distance: z
      .number()
      .min(1, { message: 'Distância deve ter ao menos 1 caractere' }),
    duration: z
      .string()
      .min(1, { message: 'Duração deve ter ao menos 1 caractere' }),
    driver_id: z
      .number()
      .min(1, { message: 'ID do motorista deve ter ao menos 1 caractere' }),
    driver_name: z
      .string()
      .min(1, { message: 'Nome do motorista deve ter ao menos 1 caractere' }),
    value: z
      .number()
      .min(1, { message: 'Valor deve ter ao menos 1 caractere' })
  })
  .refine((data) => data.origin !== data.destination, {
    message: 'O ponto de origem e destino não podem ser iguais!',
    path: ['confirm']
  });

export const ZodRideHistoryForm = z
  .object({
    customer_id: z
      .string()
      .min(1, { message: 'ID do cliente deve ter ao menos 1 caractere' }),
    driver_id: z
      .string()
      .min(1, { message: 'ID do motorista deve ter ao menos 1 caractere' })
  });

