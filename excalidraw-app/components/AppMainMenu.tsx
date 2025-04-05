import React from "react";
import { MainMenu } from "@excalidraw/excalidraw";
import type { Theme } from "@excalidraw/excalidraw/types";

export const AppMainMenu: React.FC<{
  theme: Theme | "system";
  setTheme: (theme: Theme | "system") => void;
}> = React.memo((props) => {
  return (
    <MainMenu>
      <MainMenu.DefaultItems.LoadScene />
      <MainMenu.DefaultItems.SaveToActiveFile />
      <MainMenu.DefaultItems.SaveAsImage />
      <MainMenu.Separator />
      <MainMenu.DefaultItems.ToggleTheme
        allowSystemTheme
        theme={props.theme}
        onSelect={props.setTheme}
      />
    </MainMenu>
  );
});
