# 관리자 가이드

## 개요

이 문서는 쇼핑몰 MVP의 관리자 기능 사용 가이드를 제공합니다.

## 상품 관리

### 상품 등록

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 → **Table Editor** 메뉴
3. `products` 테이블 선택
4. **Insert row** 버튼 클릭
5. 다음 필드 입력:

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `name` | TEXT | ✅ | 상품명 |
| `description` | TEXT | ❌ | 상품 설명 |
| `price` | DECIMAL | ✅ | 가격 (예: 29900) |
| `stock_quantity` | INTEGER | ✅ | 재고 수량 |
| `category` | TEXT | ✅ | 카테고리 (`top`, `bottom`, `outer`, `shoes`, `accessories`) |
| `is_active` | BOOLEAN | ✅ | 판매 여부 (`true`/`false`) |

6. **Save** 클릭하여 저장

### 상품 수정

1. `products` 테이블에서 수정할 상품 선택
2. 필드 수정
3. **Save** 클릭

### 상품 삭제

1. `products` 테이블에서 삭제할 상품 선택
2. **Delete** 버튼 클릭
3. 확인

**주의**: 상품 삭제 시 관련된 주문 아이템(`order_items`)에는 영향이 없습니다.

## 주문 관리

### 주문 목록 확인

1. Supabase Dashboard → **Table Editor** → `orders` 테이블
2. 주문 목록 확인:
   - 주문번호 (`id`)
   - 사용자 ID (`clerk_id`)
   - 총 금액 (`total_amount`)
   - 주문 상태 (`status`)
   - 배송지 정보 (`shipping_address`)
   - 주문일시 (`created_at`)

### 주문 상태 변경

1. `orders` 테이블에서 주문 선택
2. `status` 필드 수정:
   - `pending`: 결제 대기 중
   - `confirmed`: 결제 완료
   - `shipped`: 배송 중
   - `delivered`: 배송 완료
   - `cancelled`: 취소됨
3. **Save** 클릭

### 주문 상세 확인

1. `orders` 테이블에서 주문 선택
2. `order_items` 테이블에서 해당 주문의 상품 목록 확인:
   - `order_id`로 필터링
   - 상품명 (`product_name`)
   - 수량 (`quantity`)
   - 가격 (`price`)

## 사용자 관리

### 사용자 목록 확인

1. **Clerk Dashboard**에서 사용자 관리 (권장)
2. 또는 Supabase `users` 테이블에서 확인:
   - `clerk_id`: Clerk 사용자 ID
   - `name`: 사용자 이름
   - `created_at`: 가입일시

### 사용자 정보 수정

- Clerk Dashboard에서 수정 권장
- Supabase `users` 테이블은 Clerk와 자동 동기화됨

## 재고 관리

### 재고 수량 업데이트

1. `products` 테이블에서 상품 선택
2. `stock_quantity` 필드 수정
3. **Save** 클릭

### 재고 부족 알림

현재는 자동 알림 기능이 없습니다. 정기적으로 재고를 확인하고 업데이트해야 합니다.

## 데이터 백업

### Supabase 백업

1. Supabase Dashboard → **Settings** → **Database**
2. **Backups** 섹션에서 백업 설정 확인
3. 필요시 수동 백업 실행

### 데이터 내보내기

1. Supabase Dashboard → **Table Editor**
2. 각 테이블에서 **Export** 기능 사용
3. CSV 또는 JSON 형식으로 다운로드

## 모니터링

### 주문 통계

1. Supabase Dashboard → **SQL Editor**
2. 다음 쿼리 실행:

```sql
-- 일일 주문 통계
SELECT 
  DATE(created_at) as date,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue
FROM orders
WHERE status = 'confirmed'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 인기 상품

```sql
-- 판매량 상위 상품
SELECT 
  product_name,
  SUM(quantity) as total_sold,
  SUM(quantity * price) as total_revenue
FROM order_items
GROUP BY product_name
ORDER BY total_sold DESC
LIMIT 10;
```

자세한 모니터링 방법은 [모니터링 가이드](./monitoring.md)를 참고하세요.

## 주의사항

- 상품 가격 변경 시 기존 주문에는 영향 없음 (주문 시점의 가격이 저장됨)
- 상품 삭제 시 기존 주문에는 영향 없음
- 주문 취소 시 재고 자동 복구 기능 없음 (수동 처리 필요)
- 사용자 정보는 Clerk에서 관리하는 것을 권장

