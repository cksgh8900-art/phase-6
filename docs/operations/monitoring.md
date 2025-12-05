# 모니터링 가이드

## 개요

이 문서는 쇼핑몰 MVP의 모니터링 및 로그 확인 방법을 안내합니다.

## Supabase 모니터링

### 데이터베이스 로그 확인

1. Supabase Dashboard → **Logs** → **Postgres Logs**
2. 쿼리 실행 로그 확인
3. 에러 로그 확인

### API 로그 확인

1. Supabase Dashboard → **Logs** → **API Logs**
2. API 요청 및 응답 확인
3. 에러 발생 시 상세 정보 확인

### 실시간 모니터링

1. Supabase Dashboard → **Database** → **Replication**
2. 실시간 데이터 변경 확인

## Vercel 모니터링

### 배포 로그 확인

1. Vercel Dashboard → 프로젝트 선택
2. **Deployments** 탭
3. 배포 선택 → **Runtime Logs** 확인

### 함수 로그 확인

1. Vercel Dashboard → 프로젝트 선택
2. **Functions** 탭
3. 함수별 로그 확인

### 성능 모니터링

1. Vercel Dashboard → 프로젝트 선택
2. **Analytics** 탭 (Pro 플랜 필요)
3. 성능 지표 확인:
   - 페이지 로딩 시간
   - 요청 수
   - 에러율

## 주요 모니터링 지표

### 주문 통계

```sql
-- 일일 주문 통계
SELECT 
  DATE(created_at) as date,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_order_value
FROM orders
WHERE status = 'confirmed'
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;
```

### 상품별 판매 통계

```sql
-- 상품별 판매량 및 매출
SELECT 
  oi.product_name,
  SUM(oi.quantity) as total_sold,
  SUM(oi.quantity * oi.price) as total_revenue,
  COUNT(DISTINCT oi.order_id) as order_count
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'confirmed'
GROUP BY oi.product_name
ORDER BY total_sold DESC;
```

### 사용자 활동 통계

```sql
-- 일일 신규 사용자 수
SELECT 
  DATE(created_at) as date,
  COUNT(*) as new_users
FROM users
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;
```

### 재고 부족 상품

```sql
-- 재고가 부족한 상품 (10개 이하)
SELECT 
  name,
  stock_quantity,
  category
FROM products
WHERE stock_quantity <= 10
  AND is_active = true
ORDER BY stock_quantity ASC;
```

## 에러 모니터링

### Supabase 에러 확인

1. Supabase Dashboard → **Logs** → **Postgres Logs**
2. 에러 필터 적용
3. 에러 메시지 및 스택 트레이스 확인

### Vercel 에러 확인

1. Vercel Dashboard → 프로젝트 선택
2. **Deployments** → **Runtime Logs**
3. 에러 로그 확인

### 클라이언트 에러 확인

1. 브라우저 개발자 도구 (F12)
2. **Console** 탭에서 에러 확인
3. **Network** 탭에서 실패한 요청 확인

## 성능 모니터링

### Lighthouse 점수 확인

1. Chrome 개발자 도구 → **Lighthouse** 탭
2. 리포트 생성
3. 다음 지표 확인:
   - Performance (목표: 80 이상)
   - Accessibility (목표: 90 이상)
   - Best Practices (목표: 90 이상)
   - SEO (목표: 90 이상)

### 페이지 로딩 시간

1. Chrome 개발자 도구 → **Network** 탭
2. 페이지 새로고침
3. 로딩 시간 확인:
   - DOMContentLoaded
   - Load
   - First Contentful Paint

### 데이터베이스 쿼리 성능

1. Supabase Dashboard → **SQL Editor**
2. 쿼리 실행 시간 확인
3. 느린 쿼리 최적화

## 알림 설정 (선택사항)

### Supabase 알림

1. Supabase Dashboard → **Settings** → **Alerts**
2. 알림 조건 설정:
   - 데이터베이스 사용량
   - API 사용량
   - 에러 발생

### Vercel 알림

1. Vercel Dashboard → 프로젝트 선택
2. **Settings** → **Notifications**
3. 알림 설정:
   - 배포 성공/실패
   - 함수 에러
   - 성능 이슈

## 정기 점검 항목

### 일일 점검
- [ ] 주문 확인 및 처리
- [ ] 재고 확인
- [ ] 에러 로그 확인

### 주간 점검
- [ ] 주문 통계 확인
- [ ] 인기 상품 확인
- [ ] 성능 지표 확인
- [ ] 사용자 피드백 확인

### 월간 점검
- [ ] 전체 통계 분석
- [ ] 성능 최적화
- [ ] 보안 점검
- [ ] 백업 확인

## 참고 자료

- [Supabase 모니터링 문서](https://supabase.com/docs/guides/platform/metrics)
- [Vercel 모니터링 문서](https://vercel.com/docs/observability)
- [Next.js 성능 최적화](https://nextjs.org/docs/app/building-your-application/optimizing)

