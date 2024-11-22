import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { apiPost } from "../helpers/axios/config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../states/reducer";
import { showToast } from "../states/toastSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { registerUser } from "../states/authSlice";

export interface ISignUpForm {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  submitError?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ISignUpForm>();

  //   const registerUserMutation = useMutation(apiClient.registerUser, {
  //     onSuccess: () => {
  //       console.log("user registered successfully");
  //     },
  //     onError: (error) => {
  //       console.log("error", error);
  //     },
  //   });

  const formSubmit: SubmitHandler<ISignUpForm> = async (data) => {
    const response: any = await apiPost({ apiPath: "/auth/signUp", data });

    if (response.status === "success") {
      localStorage.setItem("auth", response.token);
      navigate("/");

      dispatch(
        registerUser({ isAuthenticated: true, currentUser: response.data.user })
      );

      dispatch(
        showToast({
          message: "Created Account Successfully",
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

  useEffect(() => {
    console.log("authState", authState);
  }, [authState]);

  return (
    <>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(formSubmit)}>
        <h2 className="text-3xl font-bold">Create an Account</h2>
        <div className="flex flex-col md:flex-row gap-5">
          <label className="text-gray-700 text-sm font-bold flex-1">
            Name
            <input
              type="text"
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("name", {
                required: "Name is required",
                maxLength: {
                  value: 60,
                  message: "Name can't be exceed more than 60 characters",
                },
              })}
            ></input>
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </label>
        </div>
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
        <label className="text-gray-700 text-sm font-bold flex-1">
          Confirm Password
          <input
            type="password"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("passwordConfirm", {
              validate: (val) => {
                if (!val) {
                  return "Password Confirmation is required";
                } else if (watch("password") !== val) {
                  return "Password didn't match";
                }
              },
            })}
          ></input>
          {errors.passwordConfirm && (
            <span className="text-red-500">
              {errors.passwordConfirm.message}
            </span>
          )}
        </label>
        <span>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
          >
            Create Account
          </button>
          <span className="pl-2">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Sign In
            </Link>
          </span>
        </span>
      </form>
    </>
  );
};

export default Register;
