export interface IUser {
  email: string;
  name: string;
  _id: string;
  joinedAt: Date;
}

export interface IToast {
  message: string;
  type: "SUCCESS" | "ERROR";
}

export interface IBooking {
  userId: IUser['_id'];
  name: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
  paymentIntentId: string;
  lastUpdated: Date;
}

export interface IMyHotel {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: { id: string; public_id: string; url: string }[];
  lastUpdated: Date;
  bookings: IBooking[]
}

export interface ISearchParam {
  city: string;
  country: string;
  adultCount: number;
  childCount: number;
  checkIn?: Date;
  checkOut?: Date;
}

export interface IPaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
}
