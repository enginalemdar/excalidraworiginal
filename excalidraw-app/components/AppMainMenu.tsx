import {
  loginIcon,
  ExcalLogo,
  eyeIcon,
} from "@excalidraw/excalidraw/components/icons";
import { MainMenu } from "@excalidraw/excalidraw/index";
import React from "react";

import { isDevEnv } from "@excalidraw/common";
import { LanguageList } from "../app-language/LanguageList";
import { isExcalidrawPlusSignedUser } from "../app_constants";
import { saveDebugState } from "./DebugCanvas";

export const AppMainMenu: React.FC<{
  onCollabDialogOpen: () => any;
  isCollaborating: boolean;
  isCollabEnabled: boolean;
  theme: any;
  setTheme: (theme: any) => void;
  refresh: () => void;
}> = React.memo((props) => {
  const handleSaveToUnitPlan = async () => {
    const companyId = new URLSearchParams(window.location.search).get("company");
    const drawId = new URLSearchParams(window.location.search).get("draw");

    const data = {
      company_id: companyId,
      content: "SOME_DRAWING_DATA", // TODO: Excalidraw içeriğini serialize et
    };

    try {
      const response = await fetch("https://app.unitplan.co/version-test/api/1.1/wf/draws", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      const newId = result?.response?._id;

      if (newId) {
        const params = new URLSearchParams(window.location.search);
        params.set("draw", newId);
        window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
        alert("Çizim UnitPlan'a kaydedildi!");
      } else {
        alert("ID dönmedi!");
      }
    } catch (err) {
      alert("Kayıt sırasında hata oluştu.");
      console.error(err);
    }
  };

  return (
    <MainMenu>
      <MainMenu.DefaultItems.LoadScene />
      <MainMenu.DefaultItems.SaveToActiveFile />
      <MainMenu.DefaultItems.Export />
      <MainMenu.DefaultItems.SaveAsImage />
      {props.isCollabEnabled && (
        <MainMenu.DefaultItems.LiveCollaborationTrigger
          isCollaborating={props.isCollaborating}
          onSelect={() => props.onCollabDialogOpen()}
        />
      )}
      <MainMenu.DefaultItems.CommandPalette className="highlighted" />
      <MainMenu.DefaultItems.SearchMenu />
      <MainMenu.DefaultItems.Help />
      <MainMenu.DefaultItems.ClearCanvas />
      <MainMenu.Separator />

      <MainMenu.Item
        onSelect={handleSaveToUnitPlan}
      >
        UnitPlan Projeme Kaydet
      </MainMenu.Item>

      <MainMenu.ItemLink
        href="https://app.unitplan.co"
      >
        app.unitplan.co/draw/(draw_id)
      </MainMenu.ItemLink>

      <MainMenu.ItemLink
        icon={ExcalLogo}
        href={`${
          import.meta.env.VITE_APP_PLUS_LP
        }/plus?utm_source=excalidraw&utm_medium=app&utm_content=hamburger`}
      >
        Excalidraw+
      </MainMenu.ItemLink>

      <MainMenu.DefaultItems.Socials />
      <MainMenu.ItemLink
        icon={loginIcon}
        href={`${import.meta.env.VITE_APP_PLUS_APP}${
          isExcalidrawPlusSignedUser ? "" : "/sign-up"
        }?utm_source=signin&utm_medium=app&utm_content=hamburger`}
        className="highlighted"
      >
        {isExcalidrawPlusSignedUser ? "Sign in" : "Sign up"}
      </MainMenu.ItemLink>

      {isDevEnv() && (
        <MainMenu.Item
          icon={eyeIcon}
          onClick={() => {
            if (window.visualDebug) {
              delete window.visualDebug;
              saveDebugState({ enabled: false });
            } else {
              window.visualDebug = { data: [] };
              saveDebugState({ enabled: true });
            }
            props?.refresh();
          }}
        >
          Visual Debug
        </MainMenu.Item>
      )}
      <MainMenu.Separator />
      <MainMenu.DefaultItems.ToggleTheme
        allowSystemTheme
        theme={props.theme}
        onSelect={props.setTheme}
      />
      <MainMenu.ItemCustom>
        <LanguageList style={{ width: "100%" }} />
      </MainMenu.ItemCustom>
      <MainMenu.DefaultItems.ChangeCanvasBackground />
    </MainMenu>
  );
});
