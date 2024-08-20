import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../states/reducer";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/" className="hover:text-gray-100">
            MernHolidays.com
          </Link>
        </span>
        <span className="flex space-x-2">
          {isAuthenticated ? (
            <>
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/hotels/my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/my-hotels"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="bg-white text-blue-600 flex items-center px-3 font-bold cursor-pointer hover:bg-gray-100 hover:text-green-800"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
