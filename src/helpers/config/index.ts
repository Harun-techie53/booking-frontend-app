export const isLoggedIn = (): boolean => {
  const isLoggedIn =
    localStorage.getItem("token") !== null ||
    localStorage.getItem("token") !== undefined ||
    localStorage.getItem("token") !== "";

  return isLoggedIn;
};
