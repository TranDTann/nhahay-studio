# Tính năng Xem Chi tiết Bài viết

## Tổng quan

Đã thêm tính năng xem chi tiết bài viết với giao diện đẹp và responsive. Người dùng có thể click vào nút "View" trên danh sách bài viết để xem chi tiết bài viết.

## Các tính năng đã thêm

### 1. Trang Detail Bài viết

- **Route**: `/admin/articles/view/[id]`
- **File**: `src/app/admin/articles/view/[id]/page.tsx`
- Hiển thị đầy đủ thông tin bài viết bao gồm:
  - Tiêu đề
  - Thông tin meta (ngày tạo, ngày cập nhật, category, tags)
  - Hình ảnh cover
  - Mô tả
  - Nội dung chi tiết với formatting đẹp

### 2. Components mới

#### ArticleRenderer (`src/components/ArticleRenderer.tsx`)

- Component để render nội dung bài viết với syntax highlighting cho code
- Hỗ trợ các định dạng HTML từ Quill editor
- Styling đẹp cho headings, paragraphs, images, code blocks, etc.

#### ArticleMeta (`src/components/ArticleMeta.tsx`)

- Component hiển thị thông tin meta của bài viết
- Bao gồm ngày tạo, ngày cập nhật, category, tags
- Giao diện đẹp với icons

#### ArticleBreadcrumb (`src/components/ArticleBreadcrumb.tsx`)

- Breadcrumb navigation cho trang detail
- Cho phép điều hướng dễ dàng giữa các trang
- Nút Edit Article tích hợp

### 3. Styling với SCSS

- **SCSS Module**: `src/app/admin/articles/view/[id]/page.module.scss`
- **Global SCSS**:
  - `src/styles/variables.scss` - Variables và mixins chung
  - `src/styles/components.scss` - Styling cho components
  - `src/styles/article-renderer.scss` - Styling cho article content
- Responsive design cho mobile và desktop
- Sử dụng SCSS features: variables, mixins, nesting, functions

### 4. Cập nhật ArticlesList

- Thêm nút "View" cho mỗi bài viết
- Icon EyeOutlined từ Ant Design
- Route đến trang detail khi click

### 5. Routing

- Cập nhật `src/routes/paths.ts` với route mới:
  ```typescript
  articleView: (id: string) => `${roots.admin}/articles/view/${id}`
  ```

## Cách sử dụng

### 1. Từ danh sách bài viết

1. Vào trang `/admin/articles`
2. Click nút "View" trên card bài viết muốn xem
3. Sẽ chuyển đến trang detail của bài viết

### 2. Từ trang detail

- **Breadcrumb**: Click vào "Articles" để quay lại danh sách
- **Nút Edit**: Click "Edit Article" để chỉnh sửa bài viết
- **Back to Articles**: Nút quay lại danh sách

## Tính năng hiển thị

### 1. Thông tin cơ bản

- Tiêu đề bài viết
- Mô tả
- Hình ảnh cover (nếu có)

### 2. Thông tin meta

- Ngày tạo và cập nhật
- Category
- Tags (nếu có)

### 3. Nội dung

- Render HTML content từ Quill editor
- Syntax highlighting cho code blocks
- Styling đẹp cho headings, paragraphs, images
- Hỗ trợ blockquotes, lists, tables
- Responsive images

### 4. Navigation

- Breadcrumb navigation
- Nút Edit Article
- Back to Articles

## Responsive Design

- Desktop: Layout đầy đủ với sidebar và content
- Tablet: Layout tối ưu cho màn hình vừa
- Mobile: Layout đơn giản, dễ đọc

## SCSS Architecture

### Variables (`src/styles/variables.scss`)

- Color palette
- Typography scale
- Spacing scale
- Breakpoints
- Shadows và border radius
- Mixins chung

### Components (`src/styles/components.scss`)

- Styling cho ArticleMeta component
- Styling cho ArticleBreadcrumb component
- Styling cho ArticleCard component
- Loading và error states

### Article Renderer (`src/styles/article-renderer.scss`)

- Styling cho nội dung bài viết
- Syntax highlighting
- Typography và spacing
- Responsive design

### SCSS Module (`src/app/admin/articles/view/[id]/page.module.scss`)

- Styling cụ thể cho trang detail
- Sử dụng variables từ file chung

## Dependencies

- Ant Design components
- highlight.js cho syntax highlighting
- Next.js routing
- SCSS cho styling

## File structure

```
src/
├── app/admin/articles/view/[id]/
│   ├── page.tsx
│   └── page.module.scss
├── components/
│   ├── ArticleRenderer.tsx
│   ├── ArticleMeta.tsx
│   └── ArticleBreadcrumb.tsx
├── styles/
│   ├── variables.scss
│   ├── components.scss
│   └── article-renderer.scss
└── routes/
    └── paths.ts (updated)
```

## SCSS Features Used

- **Variables**: Colors, spacing, typography, breakpoints
- **Mixins**: Responsive design, flexbox utilities, component styles
- **Nesting**: Component structure, pseudo-selectors
- **Functions**: Conditional styling
- **Partials**: Modular SCSS architecture
- **Import**: Reusable variables and mixins across files
