import Link from "next/link";

import Nav from "./Nav";

const Header = () => (
  <div>
    <div className="bar">
      <Link href="/">
        <a>Sick Fits</a>
      </Link>
    </div>

    <Nav />

    <div className="sub-bar">
      <p>Search</p>
    </div>

    <div>Cart</div>
  </div>
);

export default Header;
