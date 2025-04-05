import {
  loginIcon,
  ExcalLogo,
  eyeIcon,
  saveIcon,
} from "@excalidraw/excalidraw/components/icons";
import { MainMenu } from "@excalidraw/excalidraw/index";
import React from "react";

import { isDevEnv } from "@excalidraw/common";
import type { Theme } from "@excalidraw/element/types";
import { LanguageList } from "../app-language/LanguageList";
import { isExcalidrawPlusSignedUser } from "../app_constants";
import { saveDebugState } from "./DebugCanvas";

export const AppMainMenu: React.FC<{
  onCollabDialogOpen: () => any;
  isCollaborating: boolean;
  isCollabEnabled: boolean;
  theme: Theme | "system";
  setTheme: (theme: Theme | "system") => void;
  refresh: () => void;
}> = React.memo((props) => {
  const handleUnitPlanSave = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const company = urlParams.get("company");

    // Excalidraw içeriğini almak için API erişimi gerekiyorsa, bu kısmı değiştir.
    const payload = {
      company_id: company,
      data: "Dummy placeholder content", // Buraya gerçek JSON içeriği eklenecek.
    };

    try {
      const response = await fetch("https://app.unitplan.co/version-test/api/1.1/wf/draws", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      const newDrawId = result.response?.id;

      if (newDrawId) {
        urlParams.set("draw", newDrawId);
        window.history.replaceState(null, "", `?${urlParams.toString()}`);
        alert("UnitPlan Projene kaydedildi!");
      }
    } catch (err) {
      console.error("UnitPlan kaydetme hatası:", err);
      alert("Kaydedilirken bir hata oluştu.");
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
        icon={saveIcon}
        onClick={handleUnitPlanSave}
        className="highlighted"
      >
        UnitPlan Projeme Kaydet
      </MainMenu.Item>
      <MainMenu.ItemLink
        icon={ExcalLogo}
        href={`${
          import.meta.env.VITE_APP_PLUS_LP
        }/plus?utm_source=excalidraw&utm_medium=app&utm_content=hamburger`}
        className=""
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
