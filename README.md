# Pip v3 — ChatGPT & Claude Mascot

**A tiny animated companion for your AI conversations.** Pip reacts as you type and while the assistant generates a response.

**ChatGPT:** a low-poly chibi robot · **Claude:** a pixel-art critter  
The character can be switched manually in the extension popup.

---

## Features

- **Context-aware animations:** listening while you type, thinking while a response starts, moving while text streams, and celebrating when the response finishes.
- **Two characters:** Pip, a low-poly robot, and a pixel-art critter.
- **Customizable:** visibility, size, character, interface language, and sound effects.
- **Interactive:** move Pip by dragging; click to poke and double-click to trigger a greeting.
- **Keyboard shortcut:** `Alt + M` toggles visibility.
- **Remembers your position and settings** using browser extension storage.
- **Reduced-motion support** for users whose system requests less animation.

## Installation

Works with **Chrome, Edge, and Brave**.

1. Download the repository ZIP and extract it, or clone the repository.
2. Open `chrome://extensions` in your browser.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose the project folder containing `manifest.json`.
5. Open or refresh [ChatGPT](https://chatgpt.com) or [Claude](https://claude.ai).

Pip runs on `chatgpt.com`, `chat.openai.com`, and `claude.ai`.

## Controls & Settings

| Action | How |
|---|---|
| Show / hide Pip | `Alt + M` |
| Move Pip | Click and drag |
| Poke Pip | Single-click |
| Greeting animation | Double-click |
| Change character, size, language, or sound | Click the Pip extension icon |
| Reset Pip's position | Open the extension popup and select **Reset position** |

Sound effects are **off by default**. The interface language can be set to English or Turkish. With **Auto** selected, ChatGPT uses Pip and Claude uses the pixel character.

## Troubleshooting

If Pip stops reacting after a website interface update, its DOM selectors may need adjustment.

1. Open `content.js`.
2. Find `SELS` near the top of the file.
3. Update the `stop`, `editor`, and `assistant` selectors for the changed interface.
4. Return to `chrome://extensions` and reload the extension, then refresh the chat page.

## Privacy & Permissions

Pip requests the browser's **`storage`** permission to save its settings and position. Its content script observes the chat page to detect typing and response-generation states. The supplied extension files do not declare network/API permissions or implement remote requests.

---

# Pip v3 — ChatGPT ve Claude Maskotu

**Yapay zekâ sohbetlerinize eşlik eden küçük, animasyonlu bir maskot.** Pip siz yazarken ve asistan yanıt üretirken farklı animasyonlarla tepki verir.

**ChatGPT:** low-poly chibi robot · **Claude:** piksel sanat tarzında küçük bir karakter  
Karakter, eklenti açılır penceresinden elle değiştirilebilir.

## Özellikler

- **Sohbete göre animasyonlar:** yazarken dinler, yanıt oluşturulmaya başlandığında düşünür, yanıt akarken hareket eder ve yanıt bittiğinde sevinir.
- **İki karakter:** low-poly robot Pip ve piksel sanat tarzında karakter.
- **Kişiselleştirme:** görünürlük, boyut, karakter, arayüz dili ve ses efektleri.
- **Etkileşim:** sürükleyerek taşıyabilir, tek tıklamayla dürtebilir ve çift tıklamayla selamlama animasyonunu tetikleyebilirsiniz.
- **Klavye kısayolu:** `Alt + M` ile görünürlüğü değiştirin.
- **Ayarları ve konumu hatırlar:** bilgiler tarayıcının eklenti depolamasında saklanır.
- **Azaltılmış hareket desteği:** sisteminiz daha az animasyon tercih ediyorsa animasyonlar buna uyum sağlar.

## Kurulum

**Chrome, Edge ve Brave** ile uyumludur.

1. Depoyu ZIP olarak indirin ve çıkarın veya depoyu klonlayın.
2. Tarayıcınızda `chrome://extensions` adresini açın.
3. **Geliştirici modu** seçeneğini etkinleştirin.
4. **Paketlenmemiş öğe yükle** seçeneğine tıklayın ve `manifest.json` dosyasını içeren proje klasörünü seçin.
5. [ChatGPT](https://chatgpt.com) veya [Claude](https://claude.ai) sayfasını açın ya da yenileyin.

Pip; `chatgpt.com`, `chat.openai.com` ve `claude.ai` adreslerinde çalışır.

## Kontroller ve Ayarlar

| İşlem | Nasıl yapılır? |
|---|---|
| Pip'i göster / gizle | `Alt + M` |
| Pip'i taşı | Tıklayıp sürükleyin |
| Pip'i dürt | Tek tıklayın |
| Selamlama animasyonu | Çift tıklayın |
| Karakteri, boyutu, dili veya sesi değiştir | Araç çubuğundaki Pip simgesine tıklayın |
| Konumu sıfırla | Eklenti penceresinden **Konumu sıfırla** seçeneğini kullanın |

Ses efektleri varsayılan olarak **kapalıdır**. Arayüz dili İngilizce veya Türkçe seçilebilir. **Otomatik** seçiliyken ChatGPT'de Pip, Claude'da piksel karakter kullanılır.

## Sorun Giderme

Bir web sitesi arayüzünü güncelledikten sonra Pip tepki vermeyi bırakırsa DOM seçicilerinin düzenlenmesi gerekebilir.

1. `content.js` dosyasını açın.
2. Dosyanın üst tarafındaki `SELS` nesnesini bulun.
3. Arayüz değişikliğine göre `stop`, `editor` ve `assistant` seçicilerini güncelleyin.
4. `chrome://extensions` sayfasından eklentiyi yeniden yükleyin ve sohbet sayfasını yenileyin.

## Gizlilik ve İzinler

Pip, ayarları ve konumu kaydetmek için tarayıcının **`storage`** iznini kullanır. İçerik betiği, yazma ve yanıt oluşturma durumlarını algılamak için sohbet sayfasını gözlemler. İncelenen eklenti dosyalarında ağ/API izni tanımlanmamış ve uzaktan istekte bulunan bir kod bulunmamıştır.
