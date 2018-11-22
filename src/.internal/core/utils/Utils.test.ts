import * as $utils from "./Utils";


test("numberToString", () => {
  expect($utils.numberToString(1.23456789e21)).toBe("1234567890000000000000");
  expect($utils.numberToString(-1.23456789e21)).toBe("-1234567890000000000000");
  expect($utils.numberToString(0.123456789e22)).toBe("1234567890000000000000");
  expect($utils.numberToString(-0.123456789e22)).toBe("-1234567890000000000000");

  expect($utils.numberToString(1.23456789e-7)).toBe("0.000000123456789");
  expect($utils.numberToString(-1.23456789e-7)).toBe("-0.000000123456789");
  expect($utils.numberToString(0.123456789e-6)).toBe("0.000000123456789");
  expect($utils.numberToString(-0.123456789e-6)).toBe("-0.000000123456789");

  expect($utils.numberToString(1.23456789e8)).toBe("123456789");
  expect($utils.numberToString(-1.23456789e8)).toBe("-123456789");
  expect($utils.numberToString(0.123456789e9)).toBe("123456789");
  expect($utils.numberToString(-0.123456789e9)).toBe("-123456789");

  expect($utils.numberToString(1.23456789e3)).toBe("1234.56789");
  expect($utils.numberToString(-1.23456789e3)).toBe("-1234.56789");
  expect($utils.numberToString(0.123456789e4)).toBe("1234.56789");
  expect($utils.numberToString(-0.123456789e4)).toBe("-1234.56789");

  expect($utils.numberToString(NaN)).toBe("NaN");
  expect($utils.numberToString(Infinity)).toBe("Infinity");
  expect($utils.numberToString(-Infinity)).toBe("-Infinity");

  expect($utils.numberToString(0)).toBe("0");
  expect($utils.numberToString(-0)).toBe("-0");
});
