import type { SUPPORTED_LOCALES } from '../src/utils/locale'

const translations = {
  'zh-Hans': {
    name: 'BiliReveal - 哔哩哔哩网页版显示 IP 属地',
    description:
      '我不喜欢 IP 属地，但是你手机都显示了，为什么电脑不显示呢？在哔哩哔哩网页版大部分场景中显示 IP 属地。',
  },
  'zh-Hant': {
    name: 'BiliReveal - 嗶哩嗶哩網頁版顯示 IP 屬地',
    description:
      '我不喜歡 IP 屬地，但是你手機都顯示了，為什麼電腦不顯示呢？在嗶哩嗶哩網頁版大部分場景中顯示 IP 屬地。',
  },
  en: {
    name: 'BiliReveal - Show IP-based locations on Bilibili',
    description:
      "I don't like IP location labels, but if they're shown on mobile, why not on the web? Show IP locations across most Bilibili web pages.",
  },
  ja: {
    name: 'BiliReveal - BilibiliのWeb版でIP所在地を表示',
    description:
      'IP所在地の表示は好きではありませんが、スマホで表示されるなら、パソコンでも表示してよいのでは？BilibiliのWeb版のさまざまなページでIP所在地を表示します。',
  },
  th: {
    name: 'BiliReveal - แสดงพื้นที่ตาม IP บนเว็บ Bilibili',
    description:
      'ฉันไม่ชอบการแสดงพื้นที่ตาม IP แต่ในเมื่อแสดงบนมือถือแล้ว ทำไมบนคอมพิวเตอร์จะไม่แสดงบ้างล่ะ? แสดงพื้นที่ตาม IP ในหน้าส่วนใหญ่ของเว็บ Bilibili',
  },
  ar: {
    name: 'BiliReveal - عرض الموقع الجغرافي حسب IP على ويب Bilibili',
    description:
      'لا أحب عرض الموقع الجغرافي حسب عنوان IP، لكن ما دام يظهر على الهاتف، فلماذا لا يظهر على الكمبيوتر؟ يعرض الموقع الجغرافي حسب IP في معظم صفحات موقع Bilibili.',
  },
  pt: {
    name: 'BiliReveal - Mostrar localização por IP no Bilibili',
    description:
      'Não gosto de rótulos de localização por IP, mas, se aparecem no celular, por que não no computador? Exibe a localização por IP na maioria das páginas do Bilibili na web.',
  },
  es: {
    name: 'BiliReveal - Mostrar la ubicación por IP en Bilibili',
    description:
      'No me gustan las etiquetas de ubicación por IP, pero, si aparecen en el móvil, ¿por qué no en el ordenador? Muestra la ubicación por IP en la mayoría de las páginas web de Bilibili.',
  },
  id: {
    name: 'BiliReveal - Tampilkan lokasi berdasarkan IP di Bilibili',
    description:
      'Saya tidak suka label lokasi berdasarkan IP, tetapi jika sudah muncul di ponsel, mengapa tidak di komputer? Menampilkan lokasi berdasarkan IP di sebagian besar halaman web Bilibili.',
  },
  ms: {
    name: 'BiliReveal - Paparkan lokasi berdasarkan IP di Bilibili',
    description:
      'Saya tidak suka label lokasi berdasarkan IP, tetapi jika ia dipaparkan pada telefon, mengapa tidak pada komputer? Memaparkan lokasi berdasarkan IP pada kebanyakan halaman web Bilibili.',
  },
  ru: {
    name: 'BiliReveal - Показывать местоположение по IP на Bilibili',
    description:
      'Мне не нравятся метки местоположения по IP, но если они видны на телефоне, почему их нет на компьютере? Показывает местоположение по IP на большинстве страниц веб-версии Bilibili.',
  },
  tr: {
    name: 'BiliReveal - Bilibili web sürümünde IP konumunu göster',
    description:
      'IP konumu etiketlerini sevmiyorum ama telefonda gösteriliyorsa neden bilgisayarda gösterilmesin? Bilibili web sürümünün çoğu sayfasında IP konumunu gösterir.',
  },
  vi: {
    name: 'BiliReveal - Hiển thị vị trí theo IP trên web Bilibili',
    description:
      'Tôi không thích nhãn vị trí theo IP, nhưng điện thoại đã hiển thị rồi thì tại sao máy tính lại không? Hiển thị vị trí theo IP trên hầu hết các trang web Bilibili.',
  },
} satisfies Record<(typeof SUPPORTED_LOCALES)[number], { name: string; description: string }>

// 脚本管理器也可能使用地区标签，而不是 B 站路径中的书写系统标签。
const localizedMetadata = {
  '': translations['zh-Hans'],
  ...translations,
  'zh-CN': translations['zh-Hans'],
  'zh-SG': translations['zh-Hans'],
  'zh-TW': translations['zh-Hant'],
  'zh-HK': translations['zh-Hant'],
  'zh-MO': translations['zh-Hant'],
}

export const createUserscriptMetadata = (lite: boolean) => ({
  name: Object.fromEntries(
    Object.entries(localizedMetadata).map(([locale, { name }]) => [
      locale,
      name + (lite ? ' (Lite)' : ''),
    ]),
  ),
  description: Object.fromEntries(
    Object.entries(localizedMetadata).map(([locale, { description }]) => [locale, description]),
  ),
})
