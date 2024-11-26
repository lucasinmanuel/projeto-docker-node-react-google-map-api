import { z } from "zod";
import { ZodRideConfirmForm, ZodRideEstimateForm } from "../lib/utils";

export type GoogleApiKey = string;

export type DriverFilter = "name" | "description" | "vehicle" | "review_rating" | "review_comment" | "value";

export type TRideEstimate = z.infer<typeof ZodRideEstimateForm>;

export type TRideConfirm = z.infer<typeof ZodRideConfirmForm>;