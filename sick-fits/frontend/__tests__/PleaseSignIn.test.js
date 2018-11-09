import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import waait from "waait";
import { MockedProvider } from "react-apollo/test-utils";

import { fakeUser } from "../lib/testUtils";

import { CURRENT_USER_QUERY } from "../components/User";
import PleaseSignIn from "../components/PleaseSignIn";

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

describe("<PleaseSignIn />", () => {
  it("renders", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    );

    expect(wrapper.text()).toContain("Loading...");

    await waait();
    wrapper.update();

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("asks user to sign in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    );

    await waait();
    wrapper.update();
    
    expect(wrapper.text()).toContain("Please Sign In before Continuing");
    expect(wrapper.find("Signin").exists()).toEqual(true);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it("renders children when signed in", async () => {
    const Child = () => <p>Child</p>;

    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <Child />
        </PleaseSignIn>
      </MockedProvider>
    );

    await waait();
    wrapper.update();
    
    expect(wrapper.contains(<Child/>)).toEqual(true);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
