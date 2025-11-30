import React from "react";

const Footer = () => {
  return (
    <footer className="p-4 text-center bg-[#f8fafc] border-t border-[#e2e8f0] text-[#64748b] text-sm flex-shrink-0">
      <p>
        Made with ❤️ by{" "}
        <a
          href="https://tushar-bhardwaj.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4f46e5] font-medium underline hover:text-[#4338ca] transition-all duration-200"
        >
          Tushar Bhardwaj
        </a>
      </p>
    </footer>
  );
};

export default Footer;
