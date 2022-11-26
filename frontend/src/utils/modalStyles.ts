import { Styles } from "react-modal";

export const customStyles: Styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "transparent",
  },
  content: {
    position: "absolute",
    inset: 0,
    zIndex: 9,
    display: "grid",
    placeItems: "center",
    background: "var(--add-bg)",
    backdropFilter: "blur(10px)",
    fontSize: "clamp(0.6rem, 1.5vw + 1vh + 0.1rem, 1.2rem)",
  },
};
