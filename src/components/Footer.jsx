import logo from "/logo.png";

const Footer = () => {
  return (
    <footer className="text-light mx-auto mt-10 flex max-w-7xl flex-col items-center justify-center bg-gray-800 py-8 text-center">
      <img className="w-60 sm:w-1/2 sm:max-w-[600px]" src={logo} alt="logo" />
      <p className="mt-5">© 2025 Cake Shop. All Rights Reserved.</p>
    </footer>
  );
};
export default Footer;
