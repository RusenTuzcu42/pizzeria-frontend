export default function Datenschutz() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px' }}>Datenschutzerklärung</h1>
      
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>Verantwortlicher</h2>
      <p>Pizzeria Napoli<br />
      Inhaber: Fikret Tuzcu<br />
      Gevelsberger Str. 28<br />
      45549 Sprockhövel<br />
      Telefon: 02339 9116777<br />
      E-Mail: pizzeria-gevelsberg@outlook.com</p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>Hosting</h2>
      <p>Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet.<br />
      Beim Besuch der Website werden automatisch folgende Daten verarbeitet (Server-Logfiles):</p>
      <ul style={{ marginLeft: '20px' }}>
        <li>IP-Adresse des Besuchers</li>
        <li>Datum und Uhrzeit des Zugriffs</li>
        <li>Browsertyp und -version</li>
        <li>Verwendetes Betriebssystem</li>
        <li>Referrer-URL</li>
      </ul>
      <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der sicheren und technischen Bereitstellung der Website).</p>
      <p>Die Daten können in die USA übertragen werden. Für die USA besteht ein Angemessenheitsbeschluss der EU-Kommission (EU-US Data Privacy Framework), sofern der Anbieter entsprechend zertifiziert ist.</p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>Zweck der Datenverarbeitung</h2>
      <p>Die Daten werden zur technischen Bereitstellung, Stabilität und Sicherheit der Website verarbeitet.</p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>Speicherdauer</h2>
      <p>Die Server-Logfiles werden für maximal 7 Tage gespeichert und anschließend automatisch gelöscht.</p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>Cookies</h2>
      <p>Diese Website verwendet keine Tracking-Cookies. Es können jedoch technisch notwendige Cookies eingesetzt werden, die für den Betrieb der Website erforderlich sind.</p>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>Ihre Rechte</h2>
      <p>Sie haben jederzeit das Recht auf:</p>
      <ul style={{ marginLeft: '20px' }}>
        <li>Auskunft (Art. 15 DSGVO)</li>
        <li>Berichtigung (Art. 16 DSGVO)</li>
        <li>Löschung (Art. 17 DSGVO)</li>
        <li>Einschränkung (Art. 18 DSGVO)</li>
        <li>Widerspruch (Art. 21 DSGVO)</li>
        <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
      </ul>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>SSL-/TLS-Verschlüsselung</h2>
      <p>Diese Website nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung.</p>
    </div>
  );
}
