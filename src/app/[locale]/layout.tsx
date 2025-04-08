import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { locales } from "../i18n";
import { notFound } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 각 언어별 메타데이터 객체 생성
const metadataByLocale: Record<string, Metadata> = {
  ko: {
    title: "Cut and Move - 투명 배경 이미지에서 GIF 애니메이션 생성",
    description: "투명 배경의 이미지에서 프레임별 캐릭터를 자동으로 인식하여 GIF 애니메이션을 생성합니다. 스프라이트 시트, 캐릭터 애니메이션, 게임 리소스를 쉽게 변환하세요.",
    keywords: "GIF 생성, 애니메이션 제작, 투명 배경 제거, 스프라이트 시트, 게임 리소스, 캐릭터 애니메이션, 이미지 편집, 온라인 도구, 무료",
    authors: [{ name: "Cut and Move Team" }],
    openGraph: {
      title: "Cut and Move - 투명 배경 이미지에서 GIF 애니메이션 생성",
      description: "투명 배경의 이미지에서 프레임별 캐릭터를 자동으로 인식하여 GIF 애니메이션을 생성합니다. 스프라이트 시트, 캐릭터 애니메이션, 게임 리소스를 쉽게 변환하세요.",
      images: ['/images/og-image-ko.png'],
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Cut and Move - 투명 배경 이미지에서 GIF 애니메이션 생성",
      description: "투명 배경의 이미지에서 프레임별 캐릭터를 자동으로 인식하여 GIF 애니메이션을 생성합니다.",
      images: ['/images/twitter-image-ko.png'],
    },
    alternates: {
      canonical: 'https://cutandmove.app/ko',
      languages: {
        'en': 'https://cutandmove.app/en',
        'ja': 'https://cutandmove.app/ja',
        'zh': 'https://cutandmove.app/zh',
        'ru': 'https://cutandmove.app/ru',
        'es': 'https://cutandmove.app/es',
        'fr': 'https://cutandmove.app/fr',
        'it': 'https://cutandmove.app/it',
        'de': 'https://cutandmove.app/de',
        'vi': 'https://cutandmove.app/vi',
        'th': 'https://cutandmove.app/th',
        'hi': 'https://cutandmove.app/hi'
      }
    },
  },
  en: {
    title: "Cut and Move - Create GIF Animations from Transparent Background Images",
    description: "Automatically detect character frames from transparent background images and convert them into GIF animations. Easily transform sprite sheets, character animations, and game resources.",
    keywords: "GIF creator, animation maker, transparent background removal, sprite sheet, game resources, character animation, image editing, online tool, free tool",
    authors: [{ name: "Cut and Move Team" }],
    openGraph: {
      title: "Cut and Move - Create GIF Animations from Transparent Background Images",
      description: "Automatically detect character frames from transparent background images and convert them into GIF animations. Easily transform sprite sheets, character animations, and game resources.",
      images: ['/images/og-image-en.png'],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Cut and Move - Create GIF Animations from Transparent Background Images",
      description: "Automatically detect character frames from transparent background images and convert them into GIF animations.",
      images: ['/images/twitter-image-en.png'],
    },
    alternates: {
      canonical: 'https://cutandmove.app/en',
      languages: {
        'ko': 'https://cutandmove.app/ko',
        'ja': 'https://cutandmove.app/ja',
        'zh': 'https://cutandmove.app/zh',
        'ru': 'https://cutandmove.app/ru',
        'es': 'https://cutandmove.app/es',
        'fr': 'https://cutandmove.app/fr',
        'it': 'https://cutandmove.app/it',
        'de': 'https://cutandmove.app/de',
        'vi': 'https://cutandmove.app/vi',
        'th': 'https://cutandmove.app/th',
        'hi': 'https://cutandmove.app/hi'
      }
    },
  },
  ja: {
    title: "Cut and Move - 透明背景画像からGIFアニメーションを作成",
    description: "透明背景の画像からキャラクターフレームを自動検出し、GIFアニメーションに変換します。スプライトシート、キャラクターアニメーション、ゲームリソースを簡単に変換できます。",
    keywords: "GIF作成, アニメーション制作, 透明背景除去, スプライトシート, ゲームリソース, キャラクターアニメーション, 画像編集, オンラインツール, 無料ツール",
    authors: [{ name: "Cut and Move Team" }],
    openGraph: {
      title: "Cut and Move - 透明背景画像からGIFアニメーションを作成",
      description: "透明背景の画像からキャラクターフレームを自動検出し、GIFアニメーションに変換します。スプライトシート、キャラクターアニメーション、ゲームリソースを簡単に変換できます。",
      images: ['/images/og-image-ja.png'],
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Cut and Move - 透明背景画像からGIFアニメーションを作成",
      description: "透明背景の画像からキャラクターフレームを自動検出し、GIFアニメーションに変換します。",
      images: ['/images/twitter-image-ja.png'],
    },
    alternates: {
      canonical: 'https://cutandmove.app/ja',
      languages: {
        'en': 'https://cutandmove.app/en',
        'ko': 'https://cutandmove.app/ko',
        'zh': 'https://cutandmove.app/zh',
        'ru': 'https://cutandmove.app/ru',
        'es': 'https://cutandmove.app/es',
        'fr': 'https://cutandmove.app/fr',
        'it': 'https://cutandmove.app/it',
        'de': 'https://cutandmove.app/de',
        'vi': 'https://cutandmove.app/vi',
        'th': 'https://cutandmove.app/th',
        'hi': 'https://cutandmove.app/hi'
      }
    },
  },
  zh: {
    title: "Cut and Move - 从透明背景图像创建GIF动画",
    description: "自动检测透明背景图像中的角色帧并将其转换为GIF动画。轻松转换精灵表、角色动画和游戏资源。",
    keywords: "GIF制作, 动画制作, 透明背景移除, 精灵表, 游戏资源, 角色动画, 图像编辑, 在线工具, 免费工具",
    authors: [{ name: "Cut and Move Team" }],
    openGraph: {
      title: "Cut and Move - 从透明背景图像创建GIF动画",
      description: "自动检测透明背景图像中的角色帧并将其转换为GIF动画。轻松转换精灵表、角色动画和游戏资源。",
      images: ['/images/og-image-zh.png'],
      locale: 'zh_CN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Cut and Move - 从透明背景图像创建GIF动画",
      description: "自动检测透明背景图像中的角色帧并将其转换为GIF动画。",
      images: ['/images/twitter-image-zh.png'],
    },
    alternates: {
      canonical: 'https://cutandmove.app/zh',
      languages: {
        'en': 'https://cutandmove.app/en',
        'ko': 'https://cutandmove.app/ko',
        'ja': 'https://cutandmove.app/ja',
        'ru': 'https://cutandmove.app/ru',
        'es': 'https://cutandmove.app/es',
        'fr': 'https://cutandmove.app/fr',
        'it': 'https://cutandmove.app/it',
        'de': 'https://cutandmove.app/de',
        'vi': 'https://cutandmove.app/vi',
        'th': 'https://cutandmove.app/th',
        'hi': 'https://cutandmove.app/hi'
      }
    },
  },
  ru: {
    title: "Cut and Move - Создание GIF-анимации из изображений с прозрачным фоном",
    description: "Автоматическое определение кадров персонажей на изображениях с прозрачным фоном и преобразование их в GIF-анимацию. Легко трансформируйте спрайтовые листы, анимацию персонажей и игровые ресурсы.",
    keywords: "GIF-редактор, создание анимации, удаление прозрачного фона, спрайтовый лист, игровые ресурсы, анимация персонажа, редактирование изображений, онлайн-инструмент, бесплатный инструмент",
    authors: [{ name: "Cut and Move Team" }],
    openGraph: {
      title: "Cut and Move - Создание GIF-анимации из изображений с прозрачным фоном",
      description: "Автоматическое определение кадров персонажей на изображениях с прозрачным фоном и преобразование их в GIF-анимацию. Легко трансформируйте спрайтовые листы, анимацию персонажей и игровые ресурсы.",
      images: ['/images/og-image-ru.png'],
      locale: 'ru_RU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Cut and Move - Создание GIF-анимации из изображений с прозрачным фоном",
      description: "Автоматическое определение кадров персонажей на изображениях с прозрачным фоном и преобразование их в GIF-анимацию.",
      images: ['/images/twitter-image-ru.png'],
    },
    alternates: {
      canonical: 'https://cutandmove.app/ru',
      languages: {
        'en': 'https://cutandmove.app/en',
        'ko': 'https://cutandmove.app/ko',
        'ja': 'https://cutandmove.app/ja',
        'zh': 'https://cutandmove.app/zh',
        'es': 'https://cutandmove.app/es',
        'fr': 'https://cutandmove.app/fr',
        'it': 'https://cutandmove.app/it',
        'de': 'https://cutandmove.app/de',
        'vi': 'https://cutandmove.app/vi',
        'th': 'https://cutandmove.app/th',
        'hi': 'https://cutandmove.app/hi'
      }
    },
  },
  es: {
    title: "Cut and Move - Crea animaciones GIF desde imágenes con fondo transparente",
    description: "Detecta automáticamente los fotogramas de personajes de imágenes con fondo transparente y conviértelos en animaciones GIF. Transforma fácilmente hojas de sprites, animaciones de personajes y recursos de juegos.",
    keywords: "Creador de GIF, creador de animaciones, eliminación de fondo transparente, hoja de sprites, recursos de juegos, animación de personajes, edición de imágenes, herramienta en línea, herramienta gratuita",
    authors: [{ name: "Cut and Move Team" }],
    openGraph: {
      title: "Cut and Move - Crea animaciones GIF desde imágenes con fondo transparente",
      description: "Detecta automáticamente los fotogramas de personajes de imágenes con fondo transparente y conviértelos en animaciones GIF. Transforma fácilmente hojas de sprites, animaciones de personajes y recursos de juegos.",
      images: ['/images/og-image-es.png'],
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Cut and Move - Crea animaciones GIF desde imágenes con fondo transparente",
      description: "Detecta automáticamente los fotogramas de personajes de imágenes con fondo transparente y conviértelos en animaciones GIF.",
      images: ['/images/twitter-image-es.png'],
    },
    alternates: {
      canonical: 'https://cutandmove.app/es',
      languages: {
        'en': 'https://cutandmove.app/en',
        'ko': 'https://cutandmove.app/ko',
        'ja': 'https://cutandmove.app/ja',
        'zh': 'https://cutandmove.app/zh',
        'ru': 'https://cutandmove.app/ru',
        'fr': 'https://cutandmove.app/fr',
        'it': 'https://cutandmove.app/it',
        'de': 'https://cutandmove.app/de',
        'vi': 'https://cutandmove.app/vi',
        'th': 'https://cutandmove.app/th',
        'hi': 'https://cutandmove.app/hi'
      }
    },
  },
  fr: {
    title: "Cut and Move - Créez des animations GIF à partir d'images à fond transparent",
    description: "Détectez automatiquement les images de personnages à partir d'images à fond transparent et convertissez-les en animations GIF. Transformez facilement les feuilles de sprites, les animations de personnages et les ressources de jeu.",
    keywords: "Créateur de GIF, créateur d'animation, suppression de fond transparent, feuille de sprites, ressources de jeu, animation de personnage, édition d'image, outil en ligne, outil gratuit",
    authors: [{ name: "Cut and Move Team" }],
    openGraph: {
      title: "Cut and Move - Créez des animations GIF à partir d'images à fond transparent",
      description: "Détectez automatiquement les images de personnages à partir d'images à fond transparent et convertissez-les en animations GIF. Transformez facilement les feuilles de sprites, les animations de personnages et les ressources de jeu.",
      images: ['/images/og-image-fr.png'],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Cut and Move - Créez des animations GIF à partir d'images à fond transparent",
      description: "Détectez automatiquement les images de personnages à partir d'images à fond transparent et convertissez-les en animations GIF.",
      images: ['/images/twitter-image-fr.png'],
    },
    alternates: {
      canonical: 'https://cutandmove.app/fr',
      languages: {
        'en': 'https://cutandmove.app/en',
        'ko': 'https://cutandmove.app/ko',
        'ja': 'https://cutandmove.app/ja',
        'zh': 'https://cutandmove.app/zh',
        'ru': 'https://cutandmove.app/ru',
        'es': 'https://cutandmove.app/es',
        'it': 'https://cutandmove.app/it',
        'de': 'https://cutandmove.app/de',
        'vi': 'https://cutandmove.app/vi',
        'th': 'https://cutandmove.app/th',
        'hi': 'https://cutandmove.app/hi'
      }
    },
  },
  de: {
    title: "Cut and Move - Erstellen Sie GIF-Animationen aus Bildern mit transparentem Hintergrund",
    description: "Erkennen Sie automatisch Charakterframes aus Bildern mit transparentem Hintergrund und konvertieren Sie sie in GIF-Animationen. Transformieren Sie einfach Sprite-Sheets, Charakteranimationen und Spielressourcen.",
    keywords: "GIF-Ersteller, Animations-Ersteller, Entfernung transparenter Hintergründe, Sprite-Sheet, Spielressourcen, Charakteranimation, Bildbearbeitung, Online-Tool, kostenloses Tool",
    authors: [{ name: "Cut and Move Team" }],
    openGraph: {
      title: "Cut and Move - Erstellen Sie GIF-Animationen aus Bildern mit transparentem Hintergrund",
      description: "Erkennen Sie automatisch Charakterframes aus Bildern mit transparentem Hintergrund und konvertieren Sie sie in GIF-Animationen. Transformieren Sie einfach Sprite-Sheets, Charakteranimationen und Spielressourcen.",
      images: ['/images/og-image-de.png'],
      locale: 'de_DE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Cut and Move - Erstellen Sie GIF-Animationen aus Bildern mit transparentem Hintergrund",
      description: "Erkennen Sie automatisch Charakterframes aus Bildern mit transparentem Hintergrund und konvertieren Sie sie in GIF-Animationen.",
      images: ['/images/twitter-image-de.png'],
    },
    alternates: {
      canonical: 'https://cutandmove.app/de',
      languages: {
        'en': 'https://cutandmove.app/en',
        'ko': 'https://cutandmove.app/ko',
        'ja': 'https://cutandmove.app/ja',
        'zh': 'https://cutandmove.app/zh',
        'ru': 'https://cutandmove.app/ru',
        'es': 'https://cutandmove.app/es',
        'fr': 'https://cutandmove.app/fr',
        'it': 'https://cutandmove.app/it',
        'vi': 'https://cutandmove.app/vi',
        'th': 'https://cutandmove.app/th',
        'hi': 'https://cutandmove.app/hi'
      }
    },
  },
  it: {
    title: "Cut and Move - Crea animazioni GIF da immagini con sfondo trasparente",
    description: "Rileva automaticamente i fotogrammi dei personaggi dalle immagini con sfondo trasparente e convertili in animazioni GIF. Trasforma facilmente sprite sheet, animazioni dei personaggi e risorse di gioco.",
    keywords: "Creatore di GIF, creatore di animazioni, rimozione sfondo trasparente, sprite sheet, risorse di gioco, animazione dei personaggi, modifica immagini, strumento online, strumento gratuito",
    authors: [{ name: "Cut and Move Team" }],
    openGraph: {
      title: "Cut and Move - Crea animazioni GIF da immagini con sfondo trasparente",
      description: "Rileva automaticamente i fotogrammi dei personaggi dalle immagini con sfondo trasparente e convertili in animazioni GIF. Trasforma facilmente sprite sheet, animazioni dei personaggi e risorse di gioco.",
      images: ['/images/og-image-it.png'],
      locale: 'it_IT',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Cut and Move - Crea animazioni GIF da immagini con sfondo trasparente",
      description: "Rileva automaticamente i fotogrammi dei personaggi dalle immagini con sfondo trasparente e convertili in animazioni GIF.",
      images: ['/images/twitter-image-it.png'],
    },
    alternates: {
      canonical: 'https://cutandmove.app/it',
      languages: {
        'en': 'https://cutandmove.app/en',
        'ko': 'https://cutandmove.app/ko',
        'ja': 'https://cutandmove.app/ja',
        'zh': 'https://cutandmove.app/zh',
        'ru': 'https://cutandmove.app/ru',
        'es': 'https://cutandmove.app/es',
        'fr': 'https://cutandmove.app/fr',
        'de': 'https://cutandmove.app/de',
        'vi': 'https://cutandmove.app/vi',
        'th': 'https://cutandmove.app/th',
        'hi': 'https://cutandmove.app/hi'
      }
    },
  },
  vi: {
    title: "Cut and Move - Tạo hoạt hình GIF từ hình ảnh có nền trong suốt",
    description: "Tự động phát hiện khung nhân vật từ hình ảnh có nền trong suốt và chuyển đổi thành hoạt hình GIF. Dễ dàng biến đổi bảng sprite, hoạt hình nhân vật và tài nguyên trò chơi.",
    keywords: "Tạo GIF, tạo hoạt hình, loại bỏ nền trong suốt, bảng sprite, tài nguyên trò chơi, hoạt hình nhân vật, chỉnh sửa hình ảnh, công cụ trực tuyến, công cụ miễn phí",
    authors: [{ name: "Cut and Move Team" }],
    openGraph: {
      title: "Cut and Move - Tạo hoạt hình GIF từ hình ảnh có nền trong suốt",
      description: "Tự động phát hiện khung nhân vật từ hình ảnh có nền trong suốt và chuyển đổi thành hoạt hình GIF. Dễ dàng biến đổi bảng sprite, hoạt hình nhân vật và tài nguyên trò chơi.",
      images: ['/images/og-image-vi.png'],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Cut and Move - Tạo hoạt hình GIF từ hình ảnh có nền trong suốt",
      description: "Tự động phát hiện khung nhân vật từ hình ảnh có nền trong suốt và chuyển đổi thành hoạt hình GIF.",
      images: ['/images/twitter-image-vi.png'],
    },
    alternates: {
      canonical: 'https://cutandmove.app/vi',
      languages: {
        'en': 'https://cutandmove.app/en',
        'ko': 'https://cutandmove.app/ko',
        'ja': 'https://cutandmove.app/ja',
        'zh': 'https://cutandmove.app/zh',
        'ru': 'https://cutandmove.app/ru',
        'es': 'https://cutandmove.app/es',
        'fr': 'https://cutandmove.app/fr',
        'it': 'https://cutandmove.app/it',
        'de': 'https://cutandmove.app/de',
        'th': 'https://cutandmove.app/th',
        'hi': 'https://cutandmove.app/hi'
      }
    },
  },
  th: {
    title: "Cut and Move - สร้างภาพเคลื่อนไหว GIF จากภาพพื้นหลังโปร่งใส",
    description: "ตรวจจับเฟรมตัวละครโดยอัตโนมัติจากภาพพื้นหลังโปร่งใสและแปลงเป็นภาพเคลื่อนไหว GIF ง่ายๆ แปลงสไปรต์ชีต ภาพเคลื่อนไหวตัวละคร และทรัพยากรเกม",
    keywords: "สร้าง GIF, สร้างภาพเคลื่อนไหว, ลบพื้นหลังโปร่งใส, สไปรต์ชีต, ทรัพยากรเกม, ภาพเคลื่อนไหวตัวละคร, แก้ไขภาพ, เครื่องมือออนไลน์, เครื่องมือฟรี",
    authors: [{ name: "Cut and Move Team" }],
    openGraph: {
      title: "Cut and Move - สร้างภาพเคลื่อนไหว GIF จากภาพพื้นหลังโปร่งใส",
      description: "ตรวจจับเฟรมตัวละครโดยอัตโนมัติจากภาพพื้นหลังโปร่งใสและแปลงเป็นภาพเคลื่อนไหว GIF ง่ายๆ แปลงสไปรต์ชีต ภาพเคลื่อนไหวตัวละคร และทรัพยากรเกม",
      images: ['/images/og-image-th.png'],
      locale: 'th_TH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Cut and Move - สร้างภาพเคลื่อนไหว GIF จากภาพพื้นหลังโปร่งใส",
      description: "ตรวจจับเฟรมตัวละครโดยอัตโนมัติจากภาพพื้นหลังโปร่งใสและแปลงเป็นภาพเคลื่อนไหว GIF",
      images: ['/images/twitter-image-th.png'],
    },
    alternates: {
      canonical: 'https://cutandmove.app/th',
      languages: {
        'en': 'https://cutandmove.app/en',
        'ko': 'https://cutandmove.app/ko',
        'ja': 'https://cutandmove.app/ja',
        'zh': 'https://cutandmove.app/zh',
        'ru': 'https://cutandmove.app/ru',
        'es': 'https://cutandmove.app/es',
        'fr': 'https://cutandmove.app/fr',
        'it': 'https://cutandmove.app/it',
        'de': 'https://cutandmove.app/de',
        'vi': 'https://cutandmove.app/vi',
        'hi': 'https://cutandmove.app/hi'
      }
    },
  },
  hi: {
    title: "Cut and Move - पारदर्शी पृष्ठभूमि वाली छवियों से GIF एनिमेशन बनाएं",
    description: "पारदर्शी पृष्ठभूमि वाली छवियों से चरित्र फ्रेम्स का स्वचालित रूप से पता लगाएं और उन्हें GIF एनिमेशन में बदलें। स्प्राइट शीट्स, चरित्र एनिमेशन और गेम संसाधनों को आसानी से परिवर्तित करें।",
    keywords: "GIF निर्माता, एनिमेशन निर्माता, पारदर्शी पृष्ठभूमि हटाना, स्प्राइट शीट, गेम संसाधन, चरित्र एनिमेशन, छवि संपादन, ऑनलाइन टूल, मुफ्त टूल",
    authors: [{ name: "Cut and Move Team" }],
    openGraph: {
      title: "Cut and Move - पारदर्शी पृष्ठभूमि वाली छवियों से GIF एनिमेशन बनाएं",
      description: "पारदर्शी पृष्ठभूमि वाली छवियों से चरित्र फ्रेम्स का स्वचालित रूप से पता लगाएं और उन्हें GIF एनिमेशन में बदलें। स्प्राइट शीट्स, चरित्र एनिमेशन और गेम संसाधनों को आसानी से परिवर्तित करें।",
      images: ['/images/og-image-hi.png'],
      locale: 'hi_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Cut and Move - पारदर्शी पृष्ठभूमि वाली छवियों से GIF एनिमेशन बनाएं",
      description: "पारदर्शी पृष्ठभूमि वाली छवियों से चरित्र फ्रेम्स का स्वचालित रूप से पता लगाएं और उन्हें GIF एनिमेशन में बदलें।",
      images: ['/images/twitter-image-hi.png'],
    },
    alternates: {
      canonical: 'https://cutandmove.app/hi',
      languages: {
        'en': 'https://cutandmove.app/en',
        'ko': 'https://cutandmove.app/ko',
        'ja': 'https://cutandmove.app/ja',
        'zh': 'https://cutandmove.app/zh',
        'ru': 'https://cutandmove.app/ru',
        'es': 'https://cutandmove.app/es',
        'fr': 'https://cutandmove.app/fr',
        'it': 'https://cutandmove.app/it',
        'de': 'https://cutandmove.app/de',
        'vi': 'https://cutandmove.app/vi',
        'th': 'https://cutandmove.app/th'
      }
    },
  }
};

// 기본 메타데이터

export async function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

// 메타데이터 생성 함수
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  // params를 비동기적으로 처리합니다
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // 해당 언어의 메타데이터 반환 (없으면 기본 메타데이터 반환)
  return metadataByLocale[locale as keyof typeof metadataByLocale] || metadataByLocale.en;
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // params를 비동기적으로 처리합니다
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  
  // 유효한 로케일인지 확인
  if (!locales.includes(locale as any)) {
    notFound();
  }
  
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
} 