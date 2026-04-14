import Link from "next/link";
import type { Route } from "next";

type SharedButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

type ButtonAsLinkProps = SharedButtonProps & {
  href: Route;
};

type ButtonAsButtonProps = SharedButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};

type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

function isLinkButton(props: ButtonProps): props is ButtonAsLinkProps {
  return "href" in props && typeof props.href !== "undefined";
}

export function Button(props: ButtonProps) {
  const variant = props.variant ?? "primary";
  const className = `button button-${variant}${props.className ? ` ${props.className}` : ""}`;

  if (isLinkButton(props)) {
    const { children, href } = props;

    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  const { children, className: _className, variant: _variant, type, ...buttonProps } = props;

  return (
    <button {...buttonProps} type={type ?? "button"} className={className}>
      {children}
    </button>
  );
}
