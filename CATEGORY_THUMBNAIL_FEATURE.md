# Category Thumbnail Feature

## Tổng quan

Tính năng thêm trường `urlThumbnail` vào Category cho phép admin upload và quản lý ảnh thumbnail cho từng category. Tính năng này tương tự như upload ảnh trong Banner management.

## Các thay đổi đã thực hiện

### 1. Cập nhật Category Interface

**File:** `src/store/categories/crud.ts`

```typescript
export interface Category {
  id?: string
  name: string
  description?: string
  urlThumbnail?: string // ✅ Thêm trường mới
  createdAt?: string
}
```

### 2. Cập nhật API Methods

**File:** `src/store/categories/crud.ts`

```typescript
// Create Category
createCategory: async (data: {
  name: string;
  description?: string;
  urlThumbnail?: string  // ✅ Thêm trường mới
}) => { ... }

// Update Category
updateCategory: async (
  id: string,
  data: {
    name: string;
    description?: string;
    urlThumbnail?: string  // ✅ Thêm trường mới
  }
) => { ... }
```

### 3. Cập nhật CategoryForm Component

**File:** `src/sections/admin/categories/components/CategoryForm.tsx`

#### Thêm imports:

```typescript
import { Form, Input, Modal, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { imageCrud } from '@/store/image/crud'
```

#### Thêm state management:

```typescript
const [imageUrl, setImageUrl] = useState<string>('')
const [uploading, setUploading] = useState(false)
```

#### Thêm upload functionality:

```typescript
const handleImageUpload = async (file: File) => {
  try {
    setUploading(true)
    const response = await imageCrud.createImage(file)
    setImageUrl(response.url)
    form.setFieldsValue({ urlThumbnail: response.url })
    setUploading(false)
  } catch (error) {
    console.error('Upload failed:', error)
    setUploading(false)
  }
}
```

#### Thêm upload UI:

```typescript
<Form.Item label="Thumbnail Image">
  <Upload {...uploadProps}>
    <Button icon={<UploadOutlined />} loading={uploading}>
      {uploading ? 'Uploading...' : 'Upload Thumbnail'}
    </Button>
  </Upload>
  {imageUrl && (
    <div style={{ marginTop: 8 }}>
      <img src={imageUrl} alt="Thumbnail Preview" />
    </div>
  )}
</Form.Item>
```

### 4. Cập nhật CategoryTable Component

**File:** `src/sections/admin/categories/components/CategoryTable.tsx`

#### Thêm thumbnail column:

```typescript
{
  title: 'Thumbnail',
  dataIndex: 'urlThumbnail',
  key: 'urlThumbnail',
  render: (urlThumbnail) => urlThumbnail ? (
    <Image src={urlThumbnail} alt="Category thumbnail" />
  ) : (
    <div className="no-image-placeholder">No Image</div>
  ),
}
```

### 5. Cập nhật CategoriesStore

**File:** `src/store/categories/categoriesStore.ts`

```typescript
createCategory: (data: {
  name: string
  description?: string
  urlThumbnail?: string // ✅ Thêm trường mới
}) => Promise<void>

updateCategory: (
  id: string,
  data: {
    name: string
    description?: string
    urlThumbnail?: string // ✅ Thêm trường mới
  }
) => Promise<void>
```

### 6. Styling

**File:** `src/assets/style/CategoryTable.scss`

```scss
.category-table {
  .thumbnail-cell {
    .ant-image {
      border-radius: 4px;
      overflow: hidden;
    }

    .no-image-placeholder {
      width: 60px;
      height: 60px;
      background-color: #f5f5f5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 12px;
      border: 1px dashed #d9d9d9;
    }
  }
}
```

## Cách sử dụng

### 1. Tạo Category mới với Thumbnail

1. Vào Admin → Categories
2. Click "Add Category"
3. Điền thông tin:
   - **Name**: Tên category
   - **Description**: Mô tả (tùy chọn)
   - **Thumbnail Image**: Click "Upload Thumbnail" để chọn ảnh
4. Click "Save"

### 2. Chỉnh sửa Category

1. Trong danh sách categories, click "Edit" trên category cần sửa
2. Thay đổi thông tin hoặc upload ảnh thumbnail mới
3. Click "Save"

### 3. Xem Thumbnail trong Table

- Thumbnail sẽ hiển thị trong cột "Thumbnail" với kích thước 60x60px
- Nếu không có ảnh, sẽ hiển thị placeholder "No Image"
- Click vào ảnh để xem full size

## Tính năng

### ✅ Upload Image

- Sử dụng `imageCrud.createImage()` để upload
- Preview ảnh ngay sau khi upload
- Loading state khi đang upload

### ✅ Image Preview

- Hiển thị ảnh thumbnail trong form
- Responsive design
- Fallback cho trường hợp lỗi ảnh

### ✅ Table Display

- Cột thumbnail trong table
- Placeholder cho category không có ảnh
- Responsive trên mobile

### ✅ Form Integration

- Tự động đồng bộ với form data
- Validation và error handling
- Reset form khi đóng modal

## API Endpoints

### POST /api/category

```json
{
  "name": "Category Name",
  "description": "Category Description",
  "urlThumbnail": "https://example.com/image.jpg"
}
```

### PUT /api/category

```json
{
  "id": "category-id",
  "name": "Updated Name",
  "description": "Updated Description",
  "urlThumbnail": "https://example.com/new-image.jpg"
}
```

## Dependencies

- `@ant-design/icons` - Icons cho upload button
- `antd` - UI components (Upload, Image, Button)
- `imageCrud` - Image upload service
- Custom SCSS styling

## Responsive Design

- **Desktop**: Thumbnail 60x60px
- **Mobile**: Thumbnail 40x40px, font size nhỏ hơn
- **Table**: Tự động scroll horizontal trên mobile
