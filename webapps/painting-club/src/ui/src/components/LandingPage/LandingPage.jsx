import { useEffect, useState } from "react";

import Announcements from "./Announcements";
import Login from "./Login";
import "../../styles/app-layout.css";

const image = 'imgs/ma.png';

export default function LandingPage() {
  const [backgroundImage, setBackgroundImage] = useState(image);

  return (
    <main className="page">
      <img
        src={image}
        className="page-background"
        style={{border: '1px black solid'}}
      />
      <div className="title">
        -• Painting Club •-
      </div>

      <Announcements/>
      <Login/>
      {/* <Themes
        setBackgroundImage={setBackgroundImage}
      /> */}
    </main>
  );
}