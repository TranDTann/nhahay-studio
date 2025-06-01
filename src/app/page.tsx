import React from 'react'
import HomeView from '@/sections/home/view/HomeView'

export const metadata = {
  title: 'NhaHayStudio - Home',
  description:
    'NhaHayStudio cung cấp bài viết đánh giá chi tiết, khách quan về các thiết bị và vật dụng trong nhà như nồi cơm điện, tủ lạnh, lavabo, vòi hoa sen, máy lọc không khí và nhiều sản phẩm khác để giúp bạn chọn mua dễ dàng hơn.'
}

// export const metadata = {
//   title: 'NhaHayStudio - Home',
//   description:
//     'NhaHayStudio offers detailed and unbiased reviews of home appliances and household items such as rice cookers, refrigerators, bathroom sinks, showerheads, air purifiers, and more — helping you make better buying decisions.'
// }

const HomePage = () => {
  return <HomeView />
}

export default HomePage
