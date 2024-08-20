import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOutUser } from "../states/authSlice";
import { apiPost } from "../helpers/axios/config";
import { showToast } from "../states/toastSlice";

const SignOutButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    const response = await apiPost({
      apiPath: "/auth/logout",
      withCredentials: true,
    });

    if (response.status === "success") {
      dispatch(signOutUser());
      dispatch(
        showToast({
          message: "Sign Out Successfully",
          type: "SUCCESS",
          isShow: true,
        })
      );
      navigate("/sign-in");
    } else {
      dispatch(
        showToast({
          message: response.errorMessage,
          type: "ERROR",
          isShow: true,
        })
      );
    }
  };
  return (
    <button
      onClick={handleSignOut}
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100 "
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
