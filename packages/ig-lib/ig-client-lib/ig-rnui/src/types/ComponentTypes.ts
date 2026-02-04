
export type TestableComponentT = {
  testID?: string;
};

export type RnuiLabelPropsT = TestableComponentT & {
  text: string;
  textColor?: string;
  backgroundColor?: string;
}
