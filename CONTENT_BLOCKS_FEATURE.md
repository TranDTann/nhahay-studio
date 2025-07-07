# Tính năng Content Blocks cho Bài viết

## Tổng quan

Đã thêm tính năng content blocks cho phép tạo bài viết với nhiều loại nội dung xen kẽ: text, ảnh đơn, và ảnh so sánh. Tính năng này giúp tạo ra bài viết phong phú và tương tác hơn.

## Các tính năng đã thêm

### 1. Content Blocks System

- **Text Block**: Nội dung văn bản với rich text editor (Quill)
- **Image Block**: Ảnh đơn với caption tùy chọn
- **Compare Block**: Ảnh so sánh với slider tương tác

### 2. Dropdown Button System

- **Button chính**: "Add Content Block" với dropdown 3 lựa chọn
- **Button thứ hai**: "Add Another Block" xuất hiện sau khi có ít nhất 1 block
- **3 lựa chọn**: Add Text Block, Add Image, Add Compare Images

### 3. Components mới

#### ImageBlock (`src/components/ImageBlock.tsx`)

- Component để thêm ảnh đơn vào bài viết
- Upload ảnh và thêm caption
- Preview ảnh trước khi thêm
- Sử dụng trong modal

#### CompareImageBlock (`src/components/CompareImageBlock.tsx`)

- Component để thêm ảnh so sánh
- Upload 2 ảnh và thêm label cho mỗi ảnh
- Sử dụng react-compare-image library
- Sử dụng trong modal

#### ContentBlock (`src/components/ContentBlock.tsx`)

- Component để render các block nội dung
- Hỗ trợ edit và delete cho từng block
- Badge hiển thị loại block
- Text editor inline cho text blocks

### 4. Cập nhật FormBlog

- Loại bỏ Quill editor cũ
- Sử dụng content blocks hoàn toàn
- Dropdown button với 3 lựa chọn
- Modal cho image và compare image
- Preview area hiển thị tất cả blocks
- Lưu contentBlocks vào database

### 5. Cập nhật ArticleRenderer

- Hỗ trợ render contentBlocks
- Fallback về content cũ nếu không có blocks
- Styling đẹp cho từng loại block

### 6. Styling với SCSS

- **`src/styles/content-blocks.scss`**: Styling cho content blocks
- Responsive design
- Hover effects và animations

## Cách sử dụng

### 1. Tạo bài viết với Content Blocks

1. Vào trang tạo bài viết mới
2. Điền thông tin cơ bản (title, description, cover image, category, tags)
3. Sử dụng dropdown "Add Content Block" với 3 lựa chọn:
   - **"Add Text Block"**: Thêm block văn bản với rich text editor
   - **"Add Image"**: Thêm ảnh đơn (mở modal)
   - **"Add Compare Images"**: Thêm ảnh so sánh (mở modal)

### 2. Thêm Text Block

1. Click dropdown "Add Content Block"
2. Chọn "Add Text Block"
3. Block mới sẽ xuất hiện với text editor
4. Viết nội dung và click "Save"

### 3. Thêm ảnh đơn

1. Click dropdown "Add Content Block"
2. Chọn "Add Image"
3. Modal sẽ mở ra
4. Click "Select Image" để chọn file ảnh
5. Thêm caption (tùy chọn)
6. Click "Add Image" để thêm vào bài viết

### 4. Thêm ảnh so sánh

1. Click dropdown "Add Content Block"
2. Chọn "Add Compare Images"
3. Modal sẽ mở ra
4. Chọn ảnh bên trái và ảnh bên phải
5. Thêm label cho mỗi ảnh (tùy chọn)
6. Click "Add Compare Images" để thêm vào bài viết

### 5. Quản lý Content Blocks

- **Edit**: Click nút edit trên block để chỉnh sửa (chỉ text blocks)
- **Delete**: Click nút delete để xóa block
- **Reorder**: Các blocks sẽ hiển thị theo thứ tự thêm vào
- **Add More**: Sau khi có ít nhất 1 block, button "Add Another Block" sẽ xuất hiện

### 6. Preview và Save

- **Preview**: Click nút "Preview" để xem bài viết trong modal
- **Save**: Click nút "Save Article" để lưu bài viết

## Cấu trúc dữ liệu

### ContentBlock Interface

```typescript
interface ContentBlock {
  id: string
  type: 'text' | 'image' | 'compare'
  content: string
  imageUrl?: string
  caption?: string
  leftImageUrl?: string
  rightImageUrl?: string
  leftLabel?: string
  rightLabel?: string
}
```

### Article Data Structure

```typescript
{
    title: string;
    description: string;
    content: string; // Generated from text blocks
    image: string; // Cover image
    tags: string[];
    contentBlocks: ContentBlock[]; // New field
}
```

## Tính năng hiển thị

### 1. Text Block

- Rich text content từ Quill editor
- Syntax highlighting cho code
- Styling đẹp cho headings, paragraphs, lists
- Inline editing với save button

### 2. Image Block

- Ảnh responsive với border radius
- Caption tùy chọn
- Hover effect scale

### 3. Compare Block

- Slider tương tác để so sánh 2 ảnh
- Labels cho mỗi ảnh
- Smooth animations

## Dependencies mới

- **react-compare-image**: Library để tạo ảnh so sánh
- **SCSS**: Styling cho content blocks

## File structure

```
src/
├── components/
│   ├── ImageBlock.tsx
│   ├── CompareImageBlock.tsx
│   ├── ContentBlock.tsx
│   └── ArticleRenderer.tsx (updated)
├── sections/admin/articles/
│   └── FormBlog.tsx (updated)
├── styles/
│   └── content-blocks.scss
└── app/admin/articles/view/[id]/
    └── page.tsx (updated)
```

## Workflow

### 1. Tạo bài viết

1. Điền thông tin cơ bản
2. Sử dụng dropdown để thêm các loại blocks
3. Edit text blocks inline
4. Preview để xem kết quả
5. Save bài viết

### 2. Xem bài viết

1. Vào trang detail bài viết
2. Xem các blocks được render đẹp
3. Tương tác với ảnh so sánh

### 3. Edit bài viết

1. Vào trang edit
2. Chỉnh sửa từng block
3. Thêm/xóa blocks bằng dropdown
4. Save changes

## Lợi ích

1. **Flexibility**: Tạo bài viết với nhiều loại nội dung
2. **Interactivity**: Ảnh so sánh tương tác
3. **Visual Appeal**: Layout đẹp và responsive
4. **User Experience**: Dễ dàng thêm và quản lý nội dung
5. **Scalability**: Dễ dàng thêm loại block mới
6. **Intuitive**: Dropdown button rõ ràng và dễ sử dụng

## Responsive Design

- Desktop: Layout đầy đủ với tất cả features
- Tablet: Layout tối ưu cho màn hình vừa
- Mobile: Layout đơn giản, dễ sử dụng

## Future Enhancements

- Drag & drop để reorder blocks
- More block types (video, gallery, etc.)
- Block templates
- Advanced editing options
- Block duplication
- Undo/Redo functionality
