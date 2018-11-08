import formatMoney from "../lib/formatMoney";

describe("formatMoney Function", () => {
  it("works with fractional amount", () => {
    expect(formatMoney(1)).toEqual("£0.01");
    expect(formatMoney(402)).toEqual("£4.02");
  });

  it("leaves pence off for whole pounds", () => {
    expect(formatMoney(100)).toEqual("£1");
    expect(formatMoney(4200)).toEqual("£42");
  });

  it("puts in the right commas", () => {
    expect(formatMoney(100010)).toEqual("£1,000.10");
    expect(formatMoney(4200000)).toEqual("£42,000");
  });
});
