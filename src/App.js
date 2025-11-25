import React, { useState } from "react";
import "./App.css";

function App() {
  const [tickets, setTickets] = useState([]);
  const [organizerForm, setOrganizerForm] = useState({
    tc: "",
  });
  const [gateForm, setGateForm] = useState({
    tc: "",
  });
  const [status, setStatus] = useState(null); // { type, message }
  const [lastValidTicket, setLastValidTicket] = useState(null); // { id, tc }

  // Yardımcı: otomatik ticketId üret (0001, 0002, 0003...)
  const generateTicketId = () => {
    const nextNumber = tickets.length + 1;
    return String(nextNumber).padStart(4, "0");
  };

  // Organizatör yeni bilet oluşturur (TC ile)
  const handleCreateTicket = (e) => {
    e.preventDefault();
    const { tc } = organizerForm;
    const tcTrimmed = tc.trim();

    // Basit TC validasyonu (11 haneli sayı)
    if (!/^\d{11}$/.test(tcTrimmed)) {
      setStatus({
        type: "error",
        message: "Lütfen geçerli bir TC kimlik numarası girin. (11 haneli sayı)",
      });
      return;
    }

    // Aynı TC için ikinci bilet olmasın (demo için)
    const existing = tickets.find((t) => t.tc === tcTrimmed);
    if (existing) {
      setStatus({
        type: "error",
        message: `Bu TC için zaten bir bilet oluşturulmuş: ${tcTrimmed}`,
      });
      return;
    }

    const newTicket = {
      id: generateTicketId(),
      tc: tcTrimmed,
      isUsed: false,
    };

    setTickets((prev) => [...prev, newTicket]);
    setStatus({
      type: "success",
      message: `Bilet oluşturuldu. ticketId: ${newTicket.id}, TC: ${newTicket.tc}`,
    });
    setOrganizerForm({ tc: "" });
  };

  // Turnike: sadece TC ile bilet doğrulama
  const handleValidateTicket = (e) => {
    e.preventDefault();
    const { tc } = gateForm;
    const tcTrimmed = tc.trim();

    if (!/^\d{11}$/.test(tcTrimmed)) {
      setStatus({
        type: "error",
        message: "Lütfen geçerli bir TC kimlik numarası girin. (11 haneli sayı)",
      });
      setLastValidTicket(null);
      return;
    }

    const ticket = tickets.find((t) => t.tc === tcTrimmed);

    if (!ticket) {
      setStatus({
        type: "error",
        message: "Bu TC için kayıtlı bir bilet bulunamadı.",
      });
      setLastValidTicket(null);
      return;
    }

    if (ticket.isUsed) {
      setStatus({
        type: "error",
        message: `Bu TC için oluşturulan bilet zaten kullanılmış görünüyor. (ticketId: ${ticket.id})`,
      });
      setLastValidTicket(null);
      return;
    }

    setStatus({
      type: "success",
      message:
        "Bilet geçerli ✅ Kullanıcı içeri girebilir. İsterseniz bileti 'kullanıldı' olarak işaretleyin.",
    });
    setLastValidTicket(ticket);
  };

  // Bileti kullanılmış işaretleme
  const handleUseTicket = () => {
    if (!lastValidTicket) return;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === lastValidTicket.id ? { ...t, isUsed: true } : t
      )
    );
    setStatus({
      type: "info",
      message: `Bilet kullanıldı olarak işaretlendi. ticketId: ${lastValidTicket.id}, TC: ${lastValidTicket.tc}`,
    });
    setLastValidTicket(null);
  };

  // Status bileşeni
  const StatusBanner = () => {
    if (!status) return null;
    let className = "status-banner ";
    if (status.type === "success") className += "status-success";
    else if (status.type === "error") className += "status-error";
    else className += "status-info";

    return <div className={className}>{status.message}</div>;
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>BlockTicket – React Demo</h1>
          <p>
            TC kimlik numarası ile bilet oluşturup, sadece TC üzerinden
            doğrulama yapan basit bir frontend prototipi.
          </p>
        </div>
        <span className="app-badge">Frontend Only</span>
      </header>

      <StatusBanner />

      <main className="grid">
        {/* Organizatör Paneli */}
        <section className="card">
          <h2>Organizatör Paneli</h2>
          <p className="card-subtitle">
            Kullanıcının TC kimlik numarası ile bilet oluştur. ticketId otomatik
            atanır.
          </p>
          <form onSubmit={handleCreateTicket} className="form">
            <div className="form-group">
              <label htmlFor="tc">TC Kimlik Numarası</label>
              <input
                id="tc"
                type="text"
                value={organizerForm.tc}
                onChange={(e) =>
                  setOrganizerForm((prev) => ({
                    ...prev,
                    tc: e.target.value,
                  }))
                }
                placeholder="Örn: 12345678901"
              />
            </div>
            <button type="submit" className="btn primary">
              Bilet Oluştur
            </button>
          </form>
          <p className="hint">
            Demo mantığı: Gerçek hayatta bu adımda bilet bilgisi akıllı kontrata
            yazılıyor gibi düşünebilirsiniz.
          </p>
        </section>

        {/* Turnike / Giriş Kontrolü */}
        <section className="card">
          <h2>Turnike / Giriş Kontrolü</h2>
          <p className="card-subtitle">
            Kullanıcı TC’sini söyleyerek bileti okutuyor. Sistem sadece TC ile
            doğrulama yapıyor.
          </p>
          <form onSubmit={handleValidateTicket} className="form">
            <div className="form-group">
              <label htmlFor="gateTc">TC Kimlik Numarası</label>
              <input
                id="gateTc"
                type="text"
                value={gateForm.tc}
                onChange={(e) =>
                  setGateForm((prev) => ({
                    ...prev,
                    tc: e.target.value,
                  }))
                }
                placeholder="Örn: 12345678901"
              />
            </div>
            <button type="submit" className="btn secondary">
              Bileti Doğrula
            </button>
          </form>

          {lastValidTicket && (
            <div className="use-ticket-box">
              <p>
                ✅ TC <strong>{lastValidTicket.tc}</strong> için oluşturulan{" "}
                <strong>{lastValidTicket.id}</strong> ID’li bilet şu an geçerli.
                İçeri alındıktan sonra bu bileti{" "}
                <strong>kullanıldı</strong> olarak işaretleyebilirsin.
              </p>
              <button onClick={handleUseTicket} className="btn danger">
                Bileti Kullanıldı Olarak İşaretle
              </button>
            </div>
          )}

          <p className="hint">
            Buradaki kontrol, gerçek projede akıllı kontrata giden bir{" "}
            <em>validateTicket(tc)</em> çağrısının frontend’de
            simülasyonudur.
          </p>
        </section>
      </main>

      {/* “Mini blok explorer” – bilet listesi */}
      <section className="card full-width">
        <h2>Simüle Edilen “Blockchain” Durumu</h2>
        <p className="card-subtitle">
          Oluşturulan tüm biletleri ve durumlarını burada görebilirsiniz.
        </p>

        {tickets.length === 0 ? (
          <p className="empty-state">Henüz oluşturulmuş bir bilet yok.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ticketId</th>
                  <th>TC Kimlik No</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.tc}</td>
                    <td>
                      {t.isUsed ? (
                        <span className="badge used">Kullanılmış</span>
                      ) : (
                        <span className="badge active">Aktif</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="app-footer">
        <span>BlockTicket · TC ile bilet doğrulama · React frontend demo</span>
      </footer>
    </div>
  );
}

export default App;
