import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import waait from "waait";
import { MockedProvider } from "react-apollo/test-utils";

import { fakeItem } from "../lib/testUtils";

import SingleItem, { SINGLE_ITEM_QUERY } from "../components/SingleItem";

describe("<SingleItem />", () => {
  it("renders", async () => {
    const mocks = [
      {
        request: {
          query: SINGLE_ITEM_QUERY,
          variables: {
            id: "123"
          }
        },
        result: {
          data: {
            item: fakeItem()
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );

    expect(wrapper.text()).toContain("Loading...");

    await waait();
    wrapper.update();

    expect(toJSON(wrapper.find("h2"))).toMatchSnapshot();
    expect(toJSON(wrapper.find("img"))).toMatchSnapshot();
    expect(toJSON(wrapper.find("p"))).toMatchSnapshot();
  });

  it("errors when item not found", async () => {
    const mocks = [
      {
        request: {
          query: SINGLE_ITEM_QUERY,
          variables: {
            id: "123"
          }
        },
        result: {
          errors: [
            {
              message: "Item not found"
            }
          ]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );

    await waait();
    wrapper.update();

    const item = wrapper.find("[data-test='graphql-error']");
    
    expect(item.text()).toContain("Item not found");

    expect(toJSON(item)).toMatchSnapshot();
  });
});
