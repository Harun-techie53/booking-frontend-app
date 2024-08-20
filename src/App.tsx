import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateHotel from "./pages/CreateHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import HotelDetail from "./pages/HotelDetails";
import { useSelector } from "react-redux";
import { RootState } from "./states/reducer";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout isSearchbarShow={true}>
                <Search />
              </Layout>
            }
          />
          <Route
            path="/search"
            element={
              <Layout isSearchbarShow={true}>
                <Search />
              </Layout>
            }
          />
          <Route
            path="/hotel-detail/:hotelId"
            element={
              <Layout>
                <HotelDetail />
              </Layout>
            }
          />
          {isAuthenticated && (
            <>
              <Route
                path="/create-hotel"
                element={
                  <Layout isHeroShow={false}>
                    <CreateHotel />
                  </Layout>
                }
              />
              <Route
                path="/hotel/:hotelId/booking"
                element={
                  <Layout isHeroShow={false}>
                    <Booking />
                  </Layout>
                }
              />
              <Route
                path="/hotels/my-bookings"
                element={
                  <Layout isHeroShow={false}>
                    <MyBookings />
                  </Layout>
                }
              />
              <Route
                path="/my-hotels"
                element={
                  <Layout isHeroShow={false}>
                    <MyHotels />
                  </Layout>
                }
              />
              <Route
                path="/edit-hotel/:hotelId"
                element={
                  <Layout isHeroShow={false}>
                    <EditHotel />
                  </Layout>
                }
              />
            </>
          )}
          <Route
            path="/sign-up"
            element={
              <Layout isHeroShow={false}>
                <Register />
              </Layout>
            }
          />
          <Route
            path="/sign-in"
            element={
              <Layout isHeroShow={false}>
                <Login />
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
