import { useNavigate, useSearchParams } from "react-router-dom";
import SplashScreen from "../components/SplashScreen";
import { NUM_TABLES } from "../constants/config";

export default function SplashPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const raw = parseInt(searchParams.get("table"), 10);
  const table = Number.isInteger(raw) && raw >= 1 && raw <= NUM_TABLES ? raw : null;

  const handlePickLang = (lang) => {
    const p = new URLSearchParams({ lang });
    if (table) p.set("table", String(table));
    navigate(`/menu?${p.toString()}`);
  };

  return <SplashScreen onPickLang={handlePickLang} />;
}
