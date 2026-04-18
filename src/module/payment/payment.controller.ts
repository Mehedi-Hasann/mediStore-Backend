 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { stripe } from "../../config/stripe.config";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const handleStripeWebhookEvent = catchAsync(async(req : Request, res : Response) => {
    const signature = req.headers['stripe-signature'] as string
    const webhookSecret = envVars.STRIPE_WEBHOOK_SECRET;

    if(!signature || !webhookSecret){
        console.error("Missing Stripe signature or webhook secret");
        sendResponse(res, {
          httpStatusCode : status.BAD_REQUEST,
          success : false,
          message : "Missing Stripe signature or webhook secret"
        })
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error : any) {
        console.error("Error processing Stripe webhook:", error);
        sendResponse(res, {
          httpStatusCode : status.BAD_REQUEST,
          success : false,
          message : "Error processing Stripe webhook"
        })
    }

    try {
        const result = await PaymentService.handlerStripeWebhookEvent(req.user?.id as string, event as any);
        sendResponse(res, {
          httpStatusCode : status.OK,
          success : true,
          message : "Stripe webhook event processed successfully",
          data : result
        })
    } catch (error) {
        console.error("Error handling Stripe webhook event:", error);
        sendResponse(res, {
          httpStatusCode : status.INTERNAL_SERVER_ERROR,
          success : false,
          message : "Error handling Stripe webhook event"
        })

    }
}
)

export const PaymentController = {
    handleStripeWebhookEvent
}