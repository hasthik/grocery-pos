import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className="text-4xl w-full outline-none text-right"
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
