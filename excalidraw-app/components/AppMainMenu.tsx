<MainMenu.Item
  onSelect={async () => {
    const companyId = new URLSearchParams(window.location.search).get("company");
    if (!companyId) {
      alert("Company ID URL'de bulunamadı.");
      return;
    }

    const name = prompt("Çiziminize bir ad verin:");
    if (!name || name.trim() === "") {
      alert("Lütfen geçerli bir ad girin.");
      return;
    }

    const elements = JSON.parse(localStorage.getItem("excalidraw") || "[]");
    const appState = JSON.parse(localStorage.getItem("excalidraw-state") || "{}");
    const files = JSON.parse(localStorage.getItem("excalidraw-files") || "{}");

    const payload = {
      company_id: companyId,
      name: name.trim(),
      elements: JSON.stringify(elements),     // ✅ DÜZGÜN STRINGIFY
      appstate: JSON.stringify(appState),     // ✅ DÜZGÜN STRINGIFY
      files: JSON.stringify(files),           // ✅ DÜZGÜN STRINGIFY
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
      const newDrawId = result?.response?.id;

      if (newDrawId) {
        const url = new URL(window.location.href);
        url.searchParams.set("draw", newDrawId);
        window.history.replaceState({}, "", url.toString());
        alert("UnitPlan'a başarıyla kaydedildi!");
      } else {
        alert("ID alınamadı.");
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("UnitPlan'a kaydederken bir hata oluştu.");
    }
  }}
>
  UnitPlan Projeme Kaydet
</MainMenu.Item>
