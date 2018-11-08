import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import CartCount from "../components/CartCount";

describe("<CartCount />", () => {
  it("renders", () => {
    shallow(<CartCount count={10} />);
  });

  it("matches snapshot", () => {
    const wrapper = shallow(<CartCount count={10} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("updates via props", () => {
    const wrapper = shallow(<CartCount count={10} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 20 });
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
