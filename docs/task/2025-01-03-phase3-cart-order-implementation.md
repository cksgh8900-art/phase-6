# Phase 3: 장바구니 & 주문 기능 구현

**작업 일시**: 2025-01-03  
**작업 내용**: Phase 3의 장바구니 및 주문 기능 구현

## 구현 완료 항목

### 1. 타입 정의
- ✅ `lib/types/cart.ts`: CartItem, CartItemWithProduct, CartSummary 타입 정의
- ✅ `lib/types/order.ts`: Order, OrderItem, OrderWithItems, ShippingAddress, CreateOrderInput 타입 정의

### 2. 쿼리 함수
- ✅ `lib/supabase/queries/cart.ts`: 장바구니 조회 함수들
  - `getCartItems()`: 사용자 장바구니 조회 (상품 정보 포함)
  - `getCartSummary()`: 장바구니 요약 정보 조회
  - `getCartItemCount()`: 장바구니 아이템 개수 조회
- ✅ `lib/supabase/queries/orders.ts`: 주문 조회 함수들
  - `getOrders()`: 사용자 주문 목록 조회
  - `getOrderById()`: 주문 상세 조회 (주문 아이템 포함)

### 3. Server Actions
- ✅ `lib/actions/cart-actions.ts`: 장바구니 CRUD Server Actions
  - `addToCart()`: 장바구니에 상품 추가 (재고 확인, UPSERT)
  - `updateCartItemQuantity()`: 장바구니 아이템 수량 변경
  - `removeFromCart()`: 장바구니 아이템 삭제
  - `clearCart()`: 장바구니 전체 비우기
- ✅ `lib/actions/order-actions.ts`: 주문 생성 Server Action
  - `createOrder()`: 주문 생성 (합계 검증, 트랜잭션 처리)

### 4. 장바구니 컴포넌트
- ✅ `components/cart/cart-icon.tsx`: 네비게이션 장바구니 아이콘 (개수 표시)
- ✅ `components/cart/cart-item.tsx`: 장바구니 아이템 컴포넌트 (수량 변경, 삭제)
- ✅ `components/cart/cart-summary.tsx`: 장바구니 요약 컴포넌트 (총 금액, 주문하기 버튼)
- ✅ `components/products/add-to-cart-button.tsx`: 장바구니 담기 버튼 컴포넌트

### 5. 주문 컴포넌트
- ✅ `components/checkout/shipping-form.tsx`: 배송지 입력 폼 (react-hook-form + Zod)
- ✅ `components/checkout/order-summary.tsx`: 주문 요약 컴포넌트
- ✅ `components/checkout/checkout-form-wrapper.tsx`: 주문 폼 래퍼 (Server Action 호출)

### 6. 페이지 구현
- ✅ `app/cart/page.tsx`: 장바구니 페이지
- ✅ `app/checkout/page.tsx`: 주문 페이지 (배송지 입력)
- ✅ `app/orders/[id]/page.tsx`: 주문 완료 페이지
- ✅ `app/orders/page.tsx`: 주문 내역 페이지 (기본 구현)

### 7. 기능 연결
- ✅ `app/products/[id]/page.tsx`: 상품 상세 페이지에 장바구니 담기 기능 연결
- ✅ `components/Navbar.tsx`: 네비게이션에 장바구니 아이콘 추가

## 주요 기능

### 장바구니 기능
1. **장바구니 담기**
   - 상품 상세 페이지에서 "장바구니에 담기" 버튼 클릭
   - 재고 확인 후 추가
   - 같은 상품이 이미 있으면 수량 증가 (UPSERT)

2. **장바구니 조회**
   - 사용자별 장바구니 아이템 목록 표시
   - 상품 정보 JOIN하여 표시

3. **수량 변경**
   - +/- 버튼으로 수량 조절
   - 재고 초과 방지
   - 실시간 업데이트

4. **장바구니 삭제**
   - 개별 아이템 삭제
   - 확인 다이얼로그 표시

5. **장바구니 아이콘**
   - 네비게이션에 장바구니 아이콘 표시
   - 장바구니 아이템 개수 표시 (99+ 처리)
   - 5초마다 자동 업데이트

### 주문 생성 흐름
1. **주문 페이지 접근**
   - 장바구니가 비어있으면 장바구니 페이지로 리다이렉트
   - 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트

2. **배송지 입력 폼**
   - 받는 분 정보 (이름, 전화번호)
   - 배송지 주소 (우편번호, 주소, 상세주소)
   - 주문 요청사항 (선택)
   - Zod 스키마로 유효성 검사

3. **주문 요약**
   - 주문할 상품 목록
   - 상품별 수량 및 가격
   - 총 주문 금액

4. **주문 생성**
   - 주문 정보를 `orders` 테이블에 저장
   - 주문 상세를 `order_items` 테이블에 저장
   - 서버 사이드에서 총액 재계산 및 검증
   - 주문 생성 후 장바구니 자동 비우기
   - 주문 완료 페이지로 리다이렉트

### 합계 검증
- 서버 사이드에서 상품 가격 재계산
- 클라이언트 계산 결과와 서버 계산 결과 비교
- 불일치 시 에러 반환

## 기술 스택 활용

- **Next.js 15**: Server Actions, Server Components, Dynamic Routes
- **Supabase**: `cart_items`, `orders`, `order_items` 테이블 연동
- **Clerk**: 사용자 인증 (clerk_id로 사용자 식별)
- **react-hook-form + Zod**: 폼 관리 및 유효성 검사
- **Tailwind CSS**: UI 스타일링
- **shadcn/ui**: Form, Input, Button, Label, Textarea 컴포넌트 활용
- **lucide-react**: 아이콘 사용

## 파일 구조

```
lib/
  types/
    cart.ts                    # Cart 타입 정의
    order.ts                   # Order 타입 정의
  supabase/
    queries/
      cart.ts                  # 장바구니 조회 함수들
      orders.ts                # 주문 조회 함수들
  actions/
    cart-actions.ts            # 장바구니 Server Actions
    order-actions.ts           # 주문 Server Actions

components/
  cart/
    cart-icon.tsx              # 장바구니 아이콘
    cart-item.tsx              # 장바구니 아이템
    cart-summary.tsx           # 장바구니 요약
  checkout/
    shipping-form.tsx           # 배송지 입력 폼
    order-summary.tsx          # 주문 요약
    checkout-form-wrapper.tsx  # 주문 폼 래퍼
  products/
    add-to-cart-button.tsx     # 장바구니 담기 버튼

app/
  cart/
    page.tsx                   # 장바구니 페이지
  checkout/
    page.tsx                   # 주문 페이지
  orders/
    page.tsx                   # 주문 내역 페이지
    [id]/
      page.tsx                 # 주문 완료 페이지
```

## 보안 및 검증

- 모든 장바구니/주문 작업은 로그인 사용자만 접근 가능
- `clerk_id`로 사용자 식별 및 데이터 필터링
- 재고 확인: 장바구니 담기 및 수량 변경 시 재고 확인
- 합계 검증: 서버 사이드에서 총액 재계산 및 검증
- 트랜잭션 처리: 주문 생성 시 원자성 보장 (주문 아이템 생성 실패 시 주문 삭제)

## 다음 단계

- Phase 4: 결제 통합 (Toss Payments 테스트 모드)
- Phase 5: 마이페이지 (주문 내역 상세 구현)

