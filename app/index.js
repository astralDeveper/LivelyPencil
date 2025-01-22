// import _app from "./_app";

// export default function App() {
//   return <_app />;
// }
import React, { useState, useEffect } from "react";
import _app from "./_app";
import BlueLogoScreen from "screens/BlueLogoScreen";

export default function App() {
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return showLogo ? <BlueLogoScreen /> : <_app />;
}
