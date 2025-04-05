// components/ExportToUnitPlan.tsx
import React from "react";

export const ExportToUnitPlan = ({
  excalidrawAPI,
  companyId,
}: {
  excalidrawAPI: any;
  companyId: string;
}) => {
  const handleSave = async () => {
    try {
      const scene = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      const jsonData = {
        type: "excalidraw",
        version: 2,
        source: "unitplan",
        elements: scene,
        appState,
        files,
      };

      const response = await fetch(
        "https://app.unitplan.co/version-test/api/1.1/wf/draws",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: companyId,
            json: JSON.stringify(jsonData),
          }),
        }
      );

      const result = await response.json();

      if (result && result.response && result.response.draw_id) {
        const drawId = result.response.draw_id;
        const url = new URL(window.location.href);
        url.searchParams.set("draw", drawId);
        window.location.href = url.toString();
      } else {
        alert("Draw kaydedildi ama ID alınamadı.");
      }
    } catch (error) {
      console.error("UnitPlan'a kaydetme hatası:", error);
      alert("Kaydetme işlemi başarısız oldu.");
    }
  };

  return (
    <button className="UnitPlan-Save-Button" onClick={handleSave}>
      UnitPlan Projeme Kaydet
    </button>
  );
};
