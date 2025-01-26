import React from "react";
import HeaderContent from "./HeaderContent";

export default function Header() {
  return (
    <nav className={"fixed top-8 left-0 right-0 z-50 flex justify-center w-full bg-transparent"}>
      <HeaderContent />
    </nav>
  );
}
