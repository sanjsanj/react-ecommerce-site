import { shallow } from "enzyme";

import ItemComponent from "../components/Item";

const fakeItem = {
  id: "ABC123",
  title: "A Cool Item",
  price: 4000,
  description: "This item is really cool!",
  image: "dog.jpg",
  largeImage: "largedog.jpg"
};

describe("<Item />", () => {
  it("renders properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(wrapper.exists()).toEqual(true);
  });
});
