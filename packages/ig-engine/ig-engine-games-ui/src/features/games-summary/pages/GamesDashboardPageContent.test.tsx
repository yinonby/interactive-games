
import { render } from "@testing-library/react-native";
import React from "react";
import { GamesDashboardPageContent } from "./GamesDashboardPageContent";

// mocks
jest.mock("../components/GamesDashboardView", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');

  return {
    GamesDashboardView: View,
  };
});

describe("JoinableGameCardView", () => {
  it("renders properly", async () => {
    const { queryByTestId } = render(
      <GamesDashboardPageContent/>
    );

    expect(queryByTestId("app-content-tid")).toBeTruthy();
    expect(queryByTestId("games-dashboard-view-tid")).toBeTruthy();
  });

});
