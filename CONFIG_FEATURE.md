# Config Management Feature

## Tổng quan

Tính năng Config Management cho phép quản lý các cấu hình hệ thống thông qua giao diện admin. Mỗi config bao gồm 3 trường chính: key, value, và description.

## Cấu trúc dự án

```
src/
├── app/admin/config/
│   └── page.tsx                 # Trang chính quản lý config
├── components/admin/
│   └── ConfigFormModal.tsx      # Component modal form
├── api/
│   └── configService.ts         # Service layer cho API calls
└── hooks/
    └── useConfig.ts             # Custom hook quản lý state
```

## Tính năng

### 1. Hiển thị danh sách config

- Bảng hiển thị tất cả config với các cột: Key, Value, Description, Actions
- Phân trang với pagination controls (skip, take)
- Tìm kiếm theo key, value, description
- Sắp xếp theo key, value, description, createdAt, updatedAt
- Hỗ trợ sắp xếp tăng dần/giảm dần

### 2. Thêm config mới

- Modal form với validation
- Các trường bắt buộc: key, value, description
- Validation rules:
  - Key: tối đa 100 ký tự, chỉ cho phép chữ cái, số, dấu gạch ngang và gạch dưới
  - Value: tối đa 500 ký tự
  - Description: tối đa 200 ký tự

### 3. Chỉnh sửa config

- Click vào icon edit để mở modal chỉnh sửa
- Form được pre-fill với dữ liệu hiện tại
- Validation tương tự như thêm mới

### 4. Xóa config

- Click vào icon delete với confirmation dialog
- Xóa vĩnh viễn config

### 5. Refresh data

- Nút refresh để tải lại dữ liệu từ server

## API Endpoints

### GET /api/configsetting

Lấy danh sách tất cả config

**Query Parameters:**

- `sort`: Field để sắp xếp (key, value, description, createdAt, updatedAt)
- `sortDir`: Hướng sắp xếp (asc, desc)
- `search`: Từ khóa tìm kiếm
- `skip`: Số record bỏ qua (cho pagination)
- `take`: Số record lấy về (cho pagination)

**Example:**

```
GET /api/configsetting?sort=key&sortDir=asc&search=facebook&skip=0&take=10
```

**Response:**

```json
{
  "result": [
    {
      "id": 1,
      "key": "facebook_url",
      "value": "https://facebook.com",
      "description": "Facebook URL"
    }
  ],
  "message": "Success",
  "success": true,
  "total": 25,
  "page": 1,
  "pageSize": 10
}
```

### POST /api/configsetting

Tạo config mới

**Request:**

```json
{
  "key": "site_name",
  "value": "My Website",
  "description": "Tên website"
}
```

### PUT /api/configsetting/{id}

Cập nhật config

**Request:**

```json
{
  "key": "site_name",
  "value": "Updated Website Name",
  "description": "Tên website đã cập nhật"
}
```

### DELETE /api/configsetting/{id}

Xóa config

### GET /api/configsetting/key/{key}

Lấy config theo key

## Cách sử dụng

### 1. Truy cập trang config

- Đăng nhập vào admin panel
- Click vào menu "Config" trong sidebar

### 2. Thêm config mới

- Click nút "Add Config"
- Điền thông tin vào form
- Click "Create" để lưu

### 3. Chỉnh sửa config

- Click icon edit (✏️) trong cột Actions
- Chỉnh sửa thông tin
- Click "Update" để lưu

### 4. Xóa config

- Click icon delete (🗑️) trong cột Actions
- Xác nhận trong dialog
- Click "Yes" để xóa

## Components

### ConfigPage

Component chính quản lý trang config, sử dụng custom hook `useConfig` để quản lý state và API calls.

### ConfigFormModal

Component modal form tái sử dụng cho cả thêm mới và chỉnh sửa config.

### useConfig Hook

Custom hook cung cấp các functions để tương tác với API:

- `fetchConfigs()`: Lấy danh sách config
- `createConfig(config)`: Tạo config mới
- `updateConfig(id, config)`: Cập nhật config
- `deleteConfig(id)`: Xóa config
- `getConfigByKey(key)`: Lấy config theo key

## Validation Rules

### Key

- Bắt buộc
- Tối đa 100 ký tự
- Chỉ cho phép: chữ cái (a-z, A-Z), số (0-9), dấu gạch ngang (-), dấu gạch dưới (\_)

### Value

- Bắt buộc
- Tối đa 500 ký tự

### Description

- Bắt buộc
- Tối đa 200 ký tự

## Error Handling

- Hiển thị thông báo lỗi khi API call thất bại
- Validation errors được hiển thị trong form
- Loading states cho các operations

## Responsive Design

- Tương thích với mobile và desktop
- Modal form responsive
- Table responsive với horizontal scroll trên mobile

## Tích hợp với Social Media

### 1. Context Provider

- **ConfigContext**: Quản lý state config toàn cục
- **ConfigProvider**: Wrap toàn bộ admin layout
- Tự động load configs khi ứng dụng khởi động

### 2. Social Media Links Component

- **SocialMediaLinks**: Component hiển thị các link social media
- Tự động lấy links từ config: `facebook_url`, `instagram_url`, `tiktok_url`, etc.
- Responsive design với loading states
- Hover effects và animations đẹp mắt

### 3. Tích hợp vào Article Detail

- Thay thế hardcoded social media links bằng dynamic config
- Desktop: Card layout với social media buttons
- Mobile: Collapse layout cho tiết kiệm không gian
- AdvertisementSection: Component hiển thị thông tin website và social platforms
- Tự động hiển thị các platform có config, ẩn những platform không có

### 4. API Integration & Session Storage

- **configService.getAllConfigs()**: Gọi API `/api/configsetting` để lấy tất cả configs
- **ConfigContext**: Tự động load configs từ API khi ứng dụng khởi động
- **Session Storage**: Lưu trữ configs vào session storage để tái sử dụng
- **useSessionConfig Hook**: Hook để làm việc với configs từ session storage
- **getConfigByKey()**: Lấy config value theo key từ session storage

### 5. Các Config Keys được sử dụng

```typescript
// Social Media Links
facebook_url: 'https://www.facebook.com/nhahaystudio'
instagram_url: 'https://www.instagram.com/nhahaystudio'
tiktok_url: 'https://www.tiktok.com/@nhahaystudio'
youtube_url: 'https://www.youtube.com/@nhahaystudio'
twitter_url: 'https://twitter.com/nhahaystudio'
linkedin_url: 'https://www.linkedin.com/company/nhahaystudio'
zalo_url: 'https://zalo.me/0329000000'

// Website Information
website_url: 'https://nhahaystudio.com'
site_name: 'Nhà Hay Studio'
site_description: 'Kênh truyền thông giải trí nội dung...'
```

### 6. AdvertisementSection Component

- Hiển thị thông tin website và social platforms
- Tự động lấy configs từ session storage
- Dynamic content dựa trên configs có sẵn
- Clickable social platform cards
- Responsive design
- Fallback cho trường hợp không có configs

## Cách sử dụng Social Media Configs

### 1. Tạo configs social media

1. Vào trang `/admin/config`
2. Click nút "Add Config"
3. Tạo các config với keys sau:
   - `facebook_url`: Link Facebook
   - `instagram_url`: Link Instagram
   - `tiktok_url`: Link TikTok
   - `youtube_url`: Link YouTube
   - `twitter_url`: Link Twitter
   - `linkedin_url`: Link LinkedIn
   - `zalo_url`: Link Zalo

### 2. Chỉnh sửa links

1. Click icon edit trên config muốn sửa
2. Cập nhật URL mới
3. Click "Update" để lưu

### 3. Xem kết quả

- Vào trang detail bài viết bất kỳ
- Social media links sẽ tự động hiển thị với URLs từ session storage
- Configs được load từ API `/api/configsetting` và lưu vào session storage
- Links sẽ mở trong tab mới khi click
- Nếu không có config nào, component sẽ tự động ẩn
- Khi reload page, configs sẽ được load từ session storage thay vì gọi API lại

## Future Enhancements

1. **Search và Filter**: Thêm tính năng tìm kiếm và lọc config
2. **Bulk Operations**: Thêm/xóa nhiều config cùng lúc
3. **Import/Export**: Import/export config từ file CSV/JSON
4. **Config Categories**: Phân loại config theo categories
5. **Config History**: Lưu lịch sử thay đổi config
6. **Config Validation**: Validation rules cho value field
7. **Config Templates**: Templates cho các loại config phổ biến
8. **Social Media Analytics**: Theo dõi click rates trên social links
9. **Dynamic Social Icons**: Tự động detect và hiển thị icon phù hợp
10. **Social Share Buttons**: Thêm nút share bài viết lên social media
11. **Config Validation**: Validation cho URL format của social media links
12. **Config Import/Export**: Import/export configs từ file JSON
