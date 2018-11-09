import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import waait from "waait";
import { MockedProvider } from "react-apollo/test-utils";

import { fakeUser, fakeCartItem } from "../lib/testUtils";

import { CURRENT_USER_QUERY } from "../components/User";
import Nav from "../components/Nav";

const notSignedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: { data: { me: null } }
  }
];

const signedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: { data: { me: fakeUser() } }
  }
];

const signedInMocksWithCartItems = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()]
        }
      }
    }
  }
];

describe("<Nav />", () => {
  it("renders non signed in nav when not signed in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    );

    await waait();
    wrapper.update();

    expect(wrapper.text()).toContain("Shop");
    expect(wrapper.text()).toContain("Signin");
    expect(wrapper.text()).toContain("Signup");

    const nav = wrapper.find("[data-test='nav']");

    expect(toJSON(nav)).toMatchSnapshot();
  });

  it("renders signed in nav when signed in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    );

    await waait();
    wrapper.update();

    expect(wrapper.text()).toContain("Sell");
    expect(wrapper.text()).toContain("Orders");
    expect(wrapper.text()).toContain("Account");
    expect(wrapper.text()).toContain("My Cart");

    const nav = wrapper.find("[data-test='nav']");

    expect(nav.find("Link").length).toEqual(4);
  });

  it("renders right amount of cart items", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocksWithCartItems}>
        <Nav />
      </MockedProvider>
    );

    await waait();
    wrapper.update();

    const nav = wrapper.find('[data-test="nav"]');
    const count = nav.find("div.count");
    
    expect(count.text()).toEqual("3");
    expect(toJSON(count)).toMatchSnapshot();
  });
});
