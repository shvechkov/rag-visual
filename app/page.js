'use client'; // 👈 Required since ButtonPanelApp uses useState/useEffect

import ButtonPanelApp from '../components/ButtonPanelApp';

export default function HomePage() {
  return (
    <main className="p-4">
      <ButtonPanelApp />
    </main>
  );
}
