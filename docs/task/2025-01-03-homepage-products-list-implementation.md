# 홈페이지 및 상품 목록 페이지 구현

**작업 일시**: 2025-01-03  
**작업 내용**: Phase 2의 홈페이지와 상품 목록 페이지(Grid 레이아웃) 구현

## 구현 완료 항목

### 1. 타입 정의 및 쿼리 함수
- ✅ `lib/types/product.ts`: Product 타입 및 관련 유틸리티 함수
- ✅ `lib/supabase/queries/products.ts`: 상품 조회 함수들
  - `getProducts()`: 상품 목록 조회 (필터, 정렬, 페이지네이션 지원)
  - `getFeaturedProducts()`: 인기 상품 조회
  - `getProductById()`: 상품 상세 조회
  - `getProductCountsByCategory()`: 카테고리별 상품 개수 조회

### 2. 상품 관련 컴포넌트
- ✅ `components/products/product-card.tsx`: 상품 카드 컴포넌트
  - 이미지 플레이스홀더
  - 가격 천 단위 포맷팅
  - 재고 상태 표시
  - 호버 효과
- ✅ `components/products/product-grid.tsx`: 상품 Grid 레이아웃
  - 반응형 Grid (모바일 1열, 태블릿 2열, 데스크톱 3-4열)
- ✅ `components/products/category-filter.tsx`: 카테고리 필터
  - URL 쿼리 파라미터 기반 필터링
  - 활성 카테고리 하이라이트
- ✅ `components/products/sort-select.tsx`: 정렬 선택
  - 드롭다운 메뉴 형태
  - 가격/최신순/이름순 정렬 지원
- ✅ `components/products/pagination.tsx`: 페이지네이션
  - 이전/다음 버튼
  - 페이지 번호 표시 (생략 처리 포함)

### 3. 홈페이지 컴포넌트
- ✅ `components/home/hero-banner.tsx`: 프로모션 배너
  - 그라데이션 배경
  - 쇼핑하기 버튼
- ✅ `components/home/category-section.tsx`: 카테고리 진입 섹션
  - 7개 카테고리 아이콘 및 링크
  - 반응형 Grid 레이아웃
- ✅ `components/home/featured-products.tsx`: 인기 상품 미리보기
  - 상위 8개 상품 표시
  - 전체 보기 링크

### 4. 페이지 구현
- ✅ `app/page.tsx`: 홈페이지 업데이트
  - Hero Banner
  - Category Section
  - Featured Products
- ✅ `app/products/page.tsx`: 상품 목록 페이지
  - Grid 레이아웃
  - 카테고리 필터
  - 정렬 기능
  - 페이지네이션
  - Server Component 기반 데이터 페칭

### 5. 네비게이션 업데이트
- ✅ `components/Navbar.tsx`: 상품 목록 링크 추가

## 주요 기능

### 홈페이지
1. **프로모션 배너**: 주요 프로모션 정보 및 쇼핑하기 버튼
2. **카테고리 진입**: 7개 주요 카테고리로 빠른 진입
3. **인기 상품 미리보기**: 최신 상품 8개를 Grid로 표시

### 상품 목록 페이지
1. **Grid 레이아웃**: 반응형 디자인 (모바일 1열 → 데스크톱 4열)
2. **카테고리 필터**: URL 쿼리 파라미터 기반 필터링
3. **정렬 기능**: 가격 낮은순/높은순, 최신순, 이름순
4. **페이지네이션**: 한 페이지당 12개 상품, 총 상품 수 표시

## 기술 스택 활용

- **Next.js 15**: Server Components, App Router, Suspense
- **Supabase**: 상품 데이터 조회 (RLS 비활성화 상태)
- **Tailwind CSS**: 반응형 Grid 및 스타일링
- **shadcn/ui**: Button 컴포넌트 활용
- **lucide-react**: 아이콘 사용

## 파일 구조

```
lib/
  types/
    product.ts                    # Product 타입 정의
  supabase/
    queries/
      products.ts                 # 상품 조회 함수들

components/
  products/
    product-card.tsx              # 상품 카드
    product-grid.tsx              # Grid 레이아웃
    category-filter.tsx           # 카테고리 필터
    sort-select.tsx               # 정렬 선택
    pagination.tsx                # 페이지네이션
  home/
    hero-banner.tsx               # 프로모션 배너
    category-section.tsx          # 카테고리 섹션
    featured-products.tsx         # 인기 상품

app/
  page.tsx                        # 홈페이지
  products/
    page.tsx                      # 상품 목록 페이지
```

## 다음 단계

- 상품 상세 페이지 구현 (`app/products/[id]/page.tsx`)
- 이미지 필드 추가 및 이미지 업로드 기능
- 검색 기능 추가

