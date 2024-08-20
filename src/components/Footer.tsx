import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-blue-800 py-10">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/" className="hover:text-gray-100">
            MernHolidays.com
          </Link>
        </span>
        <span className="flex gap-4 tracking-tight text-white font-bold">
          <p className="cursor-pointer">Privacy Policy</p>
          <p className="cursor-pointer">Terms & Conditions</p>
        </span>
      </div>
    </div>
  );
};

export default Footer;
