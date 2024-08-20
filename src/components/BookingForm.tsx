import { useForm } from "react-hook-form";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../states/reducer";
import { IPaymentIntentResponse, IUser } from "../types/interfaces";
import { apiPost } from "../helpers/axios/config";
import { showToast } from "../states/toastSlice";
import { useState } from "react";

type Props = {
  currentUser: IUser;
  paymentIntent: IPaymentIntentResponse;
};

export type BookingFormData = {
  name: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
};

const BookingForm = ({ paymentIntent, currentUser }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const { checkIn, checkOut, adultCount, childCount } = useSelector(
    (state: RootState) => state.booking
  );
  const { hotelId } = useParams();

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      name: currentUser?.name,
      email: currentUser?.email,
      adultCount: adultCount as number,
      childCount: childCount as number,
      checkIn: checkIn?.toISOString(),
      checkOut: checkOut?.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent?.totalCost,
      paymentIntentId: paymentIntent?.paymentIntentId,
    },
  });

  const createBookingConfirm = async (data: BookingFormData) => {
    setIsLoading(true);
    const response = await apiPost({
      apiPath: `/hotels/${hotelId}/bookings/payment-confirm`,
      data,
      withCredentials: true,
    });

    if (response.status === "success") {
      dispatch(
        showToast({ message: response.message, isShow: true, type: "SUCCESS" })
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
      dispatch(
        showToast({
          message: response.errorMessage,
          isShow: true,
          type: "ERROR",
        })
      );
    }
  };

  const onSubmit = async (formData: BookingFormData) => {
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
      },
    });

    if (result.paymentIntent?.status === "succeeded") {
      createBookingConfirm({
        ...formData,
        paymentIntentId: result.paymentIntent.id,
      });
    } else {
      dispatch(
        showToast({
          message: "Payment failed",
          isShow: true,
          type: "ERROR",
        })
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("name")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>

        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: £{paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold"> Payment Details</h3>
        <CardElement
          id="payment-element"
          className="border rounded-md p-2 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
        >
          {isLoading ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
