import { IMyHotel } from "../types/interfaces";

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: IMyHotel;
};

const BookingDetailsSummary = (props: Props) => {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking Details</h2>
      <div className="border-b py-2">
        Location:
        <div className="font-bold">{`${props.hotel.name}, ${props.hotel.city}, ${props.hotel.country}`}</div>
      </div>
      <div className="flex justify-between">
        <div>
          Check-in
          <div className="font-bold"> {props.checkIn.toDateString()}</div>
        </div>
        <div>
          Check-out
          <div className="font-bold"> {props.checkOut.toDateString()}</div>
        </div>
      </div>
      <div className="border-t border-b py-2">
        Total length of stay:
        <div className="font-bold">{props.numberOfNights} nights</div>
      </div>

      <div>
        Guests{" "}
        <div className="font-bold">
          {props.adultCount} adults & {props.childCount} children
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsSummary;
