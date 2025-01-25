"use client";
import React, { useState } from "react";

const links = [
  { href: "#link1", text: "Link 1" },
  { href: "#link2", text: "Link 2" },
  { href: "#link3", text: "Link 3" },
];

function Header() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="flex justify-center mt-8">
      <ul className="bg-[#232323] bg-black rounded-md flex gap-2 w-[800px] px-1 py-3">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className={`px-2 py-2 rounded-md m-2 ${selected === index ? "bg-white text-black" : "bg-transparent text-white"}`}
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Header;
