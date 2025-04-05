declare global {
  interface Window {
    excalidrawAPI?: any;
    };
  }
}
import {
  loginIcon,
  ExcalLogo,
  eyeIcon,
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

      {/* UnitPlan Projeme Kaydet Butonu */}
<MainMenu.Item
  onSelect={async () => {
    const companyId = new URLSearchParams(window.location.search).get("company");
    if (!companyId) {
      alert("Company ID URL'de bulunamadı.");
      return;
    }

    const name = prompt("Bu çizime bir ad verin:");
    if (!name) {
      alert("Ad girmeden kayıt yapılamaz.");
      return;
    }

    if (!window.excalidrawAPI) {
      alert("Excalidraw API'ye ulaşılamadı.");
      return;
    }

    const elements = window.excalidrawAPI?.getSceneElements?.() || [];
const appState = window.excalidrawAPI?.getAppState?.() || {};
const files = window.excalidrawAPI?.getFiles?.() || {};

    const payload = {
      company_id: companyId,
      name,
      elements: JSON.stringify(elements),
      appstate: JSON.stringify(appState),
      files: JSON.stringify(files),
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
      const newDrawId = result?.response?._id;

      if (newDrawId) {
        const url = new URL(window.location.href);
        url.searchParams.set("draw", newDrawId);
        window.history.replaceState({}, "", url.toString());
        alert("UnitPlan'a başarıyla kaydedildi!");
      } else {
        alert("Kayıt başarılı ama ID alınamadı.");
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("UnitPlan'a kaydederken bir hata oluştu.");
    }
  }}
>
  UnitPlan Projeme Kaydet
</MainMenu.Item>
    </MainMenu>
  );
});
