import * as React from "react";
import { Button, ButtonProps } from "./button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";

export interface DropdownButtonOption {
  label: string;
  value: string;
}

export interface DropdownButtonProps extends Omit<ButtonProps, "onSelect"> {
  options?: DropdownButtonOption[];
  onSelect?: (value: string) => void;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({
  children,
  options,
  onSelect,
  ...buttonProps
}) => {
  if (!options || options.length < 2) {
    // Un seul choix ou aucun, bouton classique
    return <Button {...buttonProps}>{children}</Button>;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...buttonProps}>{children}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((opt) => (
          <DropdownMenuItem key={opt.value} onSelect={() => onSelect?.(opt.value)}>
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
