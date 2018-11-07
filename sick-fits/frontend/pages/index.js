import Items from "../components/Items";

const Home = props => (
  <div>
    <Items page={Math.max(parseFloat(props.query.page), 1) || 1} />
  </div>
);

export default Home;
