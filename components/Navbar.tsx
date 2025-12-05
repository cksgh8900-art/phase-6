import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/cart/cart-icon";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
      <Link
        href="/"
        className="text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        aria-label="홈 이동"
      >
        SaaS Template
      </Link>
      <nav className="flex items-center gap-6" aria-label="주요 네비게이션">
        <Link
          href="/products"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors"
          aria-label="상품 목록"
        >
          상품
        </Link>
        <SignedIn>
          <Link
            href="/orders"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors"
            aria-label="주문 내역"
          >
            주문 내역
          </Link>
        </SignedIn>
        <div className="flex gap-4 items-center">
          <SignedIn>
            <CartIcon />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>로그인</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
