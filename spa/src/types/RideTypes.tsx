import { z } from "zod";
import { ZodRideConfirmForm, ZodRideEstimateForm, ZodRideHistoryForm } from "../lib/utils";

export type GoogleApiKey = string;

export type DriverFilter = "name" | "description" | "vehicle" | "review_rating" | "review_comment" | "value";

export type HistoryFilter = "date" | "driver_name" | "origin" | "destination" | "distance" | "duration" | "value";

export type TRideEstimate = z.infer<typeof ZodRideEstimateForm>;

export type TRideConfirm = z.infer<typeof ZodRideConfirmForm>;

export type TRideHistory = z.infer<typeof ZodRideHistoryForm>;