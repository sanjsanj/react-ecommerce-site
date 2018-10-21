import Link from "next/link";

const Nav = () => (
  <nav>
    <Link href="/">
      <a>Home!</a>
    </Link>

    <Link href="/sell">
      <a>Sell!</a>
    </Link>
  </nav>
);

export default Nav;
