# Supabase 테이블 에러 수정

**작업 일시**: 2025-01-03  
**작업 내용**: "Could not find the table 'public.products'" 에러 처리 개선

## 문제 상황

Supabase에서 `products` 테이블을 찾을 수 없다는 에러가 발생했습니다:
```
Failed to fetch featured products: Could not find the table 'public.products' in the schema cache
```

## 원인 분석

1. **마이그레이션 미적용**: Supabase 데이터베이스에 마이그레이션이 적용되지 않았을 가능성
2. **스키마 캐시 문제**: Supabase의 스키마 캐시가 업데이트되지 않았을 가능성
3. **환경변수 문제**: Supabase 연결 설정이 잘못되었을 가능성

## 수정 내용

### 1. 에러 처리 개선 (`lib/supabase/queries/products.ts`)

- 테이블이 없는 경우에 대한 특별 처리 추가
- 개발 환경에서는 에러를 throw하지 않고 빈 결과 반환
- 더 자세한 에러 로깅 및 경고 메시지 추가

### 2. 주요 변경사항

**`getFeaturedProducts` 함수:**
- 테이블이 없는 경우 경고 메시지 출력
- 개발 환경에서는 빈 배열 반환 (페이지 크래시 방지)
- 프로덕션 환경에서는 에러 throw

**`getProducts` 함수:**
- 동일한 에러 처리 로직 적용
- 개발 환경에서는 빈 결과 반환

## 해결 방법

### 즉시 해결 (에러 처리 개선)
- 개발 환경에서는 에러가 발생해도 페이지가 크래시되지 않도록 처리
- 빈 결과를 반환하여 UI가 정상적으로 표시됨

### 근본적 해결 (마이그레이션 적용 필요)

1. **Supabase 대시보드에서 마이그레이션 확인**
   - Supabase Dashboard > Database > Migrations 확인
   - `db.sql` 파일의 내용이 적용되었는지 확인

2. **마이그레이션 수동 적용**
   ```sql
   -- supabase/migrations/db.sql 파일의 내용을
   -- Supabase Dashboard > SQL Editor에서 실행
   ```

3. **Supabase CLI 사용 (권장)**
   ```bash
   # Supabase CLI 설치 후
   supabase db push
   ```

4. **스키마 캐시 새로고침**
   - Supabase Dashboard에서 스키마 캐시 새로고침
   - 또는 Supabase 프로젝트 재시작

## 참고사항

- 개발 환경에서는 에러가 발생해도 페이지가 정상적으로 표시됩니다
- 프로덕션 환경에서는 마이그레이션이 적용되어 있어야 정상 작동합니다
- 마이그레이션 적용 후에는 에러가 해결됩니다

