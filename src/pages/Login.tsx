import { SubmitHandler, useForm } from "react-hook-form";
import { ISignUpForm } from "./Register";
import { useDispatch } from "react-redux";
import { apiPost } from "../helpers/axios/config";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../states/toastSlice";
import { Link } from "react-router-dom";
import { registerUser } from "../states/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpForm>();

  const formSubmit: SubmitHandler<ISignUpForm> = async (data) => {
    const response: any = await apiPost({
      apiPath: "/auth/signIn",
      data,
      withCredentials: true,
    });

    if (response.status === "success") {
      if (location.state !== null) {
        navigate(location.state.from.pathname);
      } else {
        navigate("/");
      }

      dispatch(
        registerUser({ isAuthenticated: true, currentUser: response.data.user })
      );

      dispatch(
        showToast({
          message: "Login Successfully",
          type: "SUCCESS",
          isShow: true,
        })
      );
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
    <>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(formSubmit)}>
        <h2 className="text-3xl font-bold">Login to Account</h2>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            type="email"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("email", { required: "Email is required" })}
          ></input>
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Password
          <input
            type="password"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be of 8 characters or more",
              },
            })}
          ></input>
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </label>
        {errors.submitError && (
          <span className="text-red-500">{errors.submitError.message}</span>
        )}
        <span>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
          >
            Login
          </button>
          <span className="pl-2">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Sign Up
            </Link>
          </span>
        </span>
      </form>
    </>
  );
};

export default Login;
