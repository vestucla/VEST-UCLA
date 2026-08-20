import { LinkTo } from "./styles";
import { ChevronRight } from "lucide-react";
import { useIsMobile } from "../../../../libs/useIsMobile";

type GetStartedButtonProps = {
  padding: string;
  href?: string;
  label?: string;
  target?: string;
};

const GetStartedButton = ({
  padding,
  href = "/about",
  label = "What We Do",
  target,
}: GetStartedButtonProps) => {
  const isMobile = useIsMobile();

  return (
    <LinkTo
      style={{
        padding: padding,
        background: "linear-gradient(90deg, #2165C8, #0A2040)",
        borderRadius: "76px",
        boxShadow:
          "0px 4px 12px 0px rgba(0,0,0,0.10), 0px 0px 36px 6px rgba(55,125,226,1.00)",
        border: "0.2px solid #efefef",
        backdropFilter: "blur(3px)",
        mixBlendMode: "screen",
        fontFamily: "Inter, sans-serif",
        fontSize: isMobile ? "1rem" : "1.75rem",
        fontWeight: "400",
      }}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "0.5rem" : "1rem",
        }}
      >
        {label}
        <ChevronRight size={isMobile ? 16 : 24} />
      </div>
    </LinkTo>
  );
};

export default GetStartedButton;
