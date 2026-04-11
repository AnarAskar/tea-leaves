import { useState, useEffect } from "react";
import { NUM_TABLES } from "../constants/config";
import SplashScreen from "../components/SplashScreen";
import MenuApp from "../components/MenuApp";

export default function App() {
  const [page, setPage] = useState("splash");
  const [lang, setLang] = useState("en");
  const [tableNum, setTableNum] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = parseInt(params.get("table"), 10);
    if (n >= 1 && n <= NUM_TABLES) setTableNum(n);
  }, []);

  if (page === "splash") {
    return (
      <SplashScreen
        onPickLang={(code) => {
          setLang(code);
          setPage("menu");
        }}
      />
    );
  }

  return <MenuApp lang={lang} onChangeLang={setLang} tableNum={tableNum} />;
}
