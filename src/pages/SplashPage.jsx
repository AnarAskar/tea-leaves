import { useNavigate, useSearchParams } from "react-router-dom";
import SplashScreen from "../components/SplashScreen";

export default function SplashPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Opaque table token from the QR code; forwarded as-is to the menu, which
  // resolves it to a table number. Invalid tokens just become browse-only.
  const token = searchParams.get("t");

  const handlePickLang = (lang) => {
    const p = new URLSearchParams({ lang });
    if (token) p.set("t", token);
    navigate(`/menu?${p.toString()}`);
  };

  return <SplashScreen onPickLang={handlePickLang} />;
}
