
"use client";
import {cva} from 'class-variance-authority';

type ButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary'|'outline';
}


export const Button = ({variant, ...props}: ButtonProps) => {
  return (
  <button {...props} className ={buttonVarients({variant})}/>
  );
};

const buttonVarients = cva(
  "py-2 px-6 rounded-md font-semibold flex items-center justify-center transition-colors ",
  {
    variants:{
      variant:{
        primary:"bg-[#321b15] text-white hover:opacity-90",
        outline:"border-2 border-[#321B15] text-[#321b15] hover:bg-[#321b15] hover:text-white hover:opacity-100",
      }
    },
    defaultVariants:{
      variant:'primary'
    }
  }
)
