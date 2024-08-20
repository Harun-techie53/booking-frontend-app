import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../states/reducer";
import { useParams } from "react-router-dom";
import { apiGet, apiPost } from "../helpers/axios/config";
import { IMyHotel, IPaymentIntentResponse, IUser } from "../types/interfaces";
import { Elements } from "@stripe/react-stripe-js";
import { showToast } from "../states/toastSlice";
import BookingForm from "../components/BookingForm";
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

const Booking = () => {
  const stripePromise = loadStripe(STRIPE_PUB_KEY);
  const { checkIn, checkOut, adultCount, childCount } = useSelector(
    (state: RootState) => state.booking
  );
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { hotelId } = useParams();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);
  const [paymentIntent, setPaymentIntent] =
    useState<IPaymentIntentResponse | null>(null);
  const [hotel, setHotel] = useState<IMyHotel | null>(null);

  const fetchHotelInfo = async () => {
    const response = await apiGet({ apiPath: `/hotels/${hotelId}` });

    if (response.status === "success") {
      setHotel(response.data.hotel);
    }
  };

  const createPaymentIntent = async () => {
    if (numberOfNights <= 0) {
      return;
    }
    const response = await apiPost({
      apiPath: `/hotels/${hotelId}/bookings/payment-intent`,
      data: { numberOfNights },
      withCredentials: true,
    });

    if (response.status === "success") {
      setPaymentIntent(response.data.response);
      dispatch(
        showToast({ message: response.message, isShow: true, type: "SUCCESS" })
      );
    } else {
      dispatch(
        showToast({
          message: response.errorMessage,
          isShow: true,
          type: "ERROR",
        })
      );
    }
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      const nights =
        Math.abs(checkOut.getTime() - checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.ceil(nights));
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    fetchHotelInfo();
  }, [hotelId]);

  useEffect(() => {
    createPaymentIntent();
  }, [stripePromise]);

  if (!hotel) {
    return <></>;
  }

  console.log(
    "checkIn",
    checkIn,
    "checkIn",
    checkOut,
    "numberOfNights",
    numberOfNights
  );

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={checkIn as Date}
        checkOut={checkOut as Date}
        adultCount={adultCount as number}
        childCount={childCount as number}
        numberOfNights={numberOfNights}
        hotel={hotel as IMyHotel}
      />
      {currentUser && paymentIntent && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntent?.clientSecret,
          }}
        >
          <BookingForm
            currentUser={currentUser as IUser}
            paymentIntent={paymentIntent as IPaymentIntentResponse}
          />
        </Elements>
      )}
    </div>
  );
};

export default Booking;
